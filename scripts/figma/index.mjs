#!/usr/bin/env node

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Figma token publisher for ng-clarity (modular entry point).
 *
 * Reads dist/clr-ui/clr-ui.css (the compiled output of `npm run _build:ui`),
 * applies scope/exclusion rules from figma-tokens.config.json, and publishes
 * all CSS custom properties as Figma variables via the Figma Variables REST API.
 *
 * This is the orchestration layer: it wires together the single-concern modules
 * (cli, env, config, css-parser, collections, token-rules, planner, extract-view,
 * figma-client) and performs the network I/O and logging.
 *
 * Usage:
 *   node --env-file=.env.figma scripts/figma/index.mjs [options]
 *
 * Options:
 *   --dry-run              Parse and plan the push but make no API calls.
 *   --preview              Fetch the current Figma state, compute a full variable
 *                          diff (new / updated / deleted), print it to the console,
 *                          and exit without pushing. Requires credentials.
 *   --extract [file]       Write the parsed token plan to a JSON file instead
 *                          of pushing. No Figma credentials required.
 *                          Defaults to: figma-tokens.extract.json
 *   --branch <name>        Dev branch name; isolates tokens from production.
 *                          With FIGMA_BRANCH_MODE=branch: targets a Figma branch.
 *                          With FIGMA_BRANCH_MODE=collection (default): suffixes
 *                          collection names with " [<branch>]".
 *
 * Required env vars (set in .env.figma) — not needed for --extract:
 *   FIGMA_TOKEN        Personal access token with file_variables:read/write.
 *   FIGMA_FILE_KEY     Figma file key (last path segment of the file URL).
 *
 * Optional env vars:
 *   FIGMA_BRANCH_MODE  "branch" | "collection" (default: "collection")
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseCliArgs } from './setup/cli.mjs';
import { loadEnv } from './setup/env.mjs';
import { loadConfig } from './setup/config.mjs';
import { createFigmaClient } from './api/figma-client.mjs';
import { parseCssBlocks, resolveModeVars } from './setup/css-parser.mjs';
import { buildCollectionDefs } from './core/collections.mjs';
import { createTokenRules } from './core/token-rules.mjs';
import { createIdMap } from './core/id-map.mjs';
import { buildPushPlan, buildCollectionPlan, populateIdMapFromExisting } from './core/planner.mjs';
import { buildExtractView } from './api/extract-view.mjs';
import { printDiff, printStats } from './api/diff-printer.mjs';
import { executePush } from './api/push-executor.mjs';
import { parseFigmaVarsResponse, buildLookupMaps } from './util/figma-response.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const CONFIG_PATH = path.join(ROOT, 'figma-tokens.config.json');
const CSS_FILE = path.join(ROOT, 'dist', 'clr-ui', 'clr-ui.css');

async function main() {
  // ── CLI + environment ─────────────────────────────────────────────────────
  const { dryRun, previewMode, extractMode, extractFile, branchName } = parseCliArgs();
  const { figmaToken, figmaFileKey, figmaBranchMode } = loadEnv({ extractMode });
  const config = loadConfig(CONFIG_PATH);
  const rules = createTokenRules(config);
  const figma = createFigmaClient(figmaToken);

  const modeLabel = dryRun ? ' (DRY RUN)' : previewMode ? ' (PREVIEW)' : '';
  console.log(
    `\n🎨  Figma token push — file: ${figmaFileKey}${branchName ? ` [branch: ${branchName}]` : ''}${modeLabel}\n`
  );

  // ── Fetch existing Figma variables ──────────────────────────────────────────
  let existingCollections = [];
  let existingVars = [];
  let existingModes = [];
  let effectiveFileKey = figmaFileKey;

  // Preview mode fetches existing vars inside its own block (after branch isolation
  // resolves effectiveFileKey), so we skip the initial fetch here for preview too.
  if (!dryRun && !extractMode && !previewMode) {
    console.log('⬇️   Fetching existing Figma variables…');
    const existing = await figma.get(`/files/${figmaFileKey}/variables/local`);
    ({ collections: existingCollections, vars: existingVars, modes: existingModes } = parseFigmaVarsResponse(existing));
  }

  // ── Branch isolation ────────────────────────────────────────────────────────
  let collectionSuffix = '';
  if (branchName) {
    if (figmaBranchMode === 'branch' && !dryRun) {
      // Target the Figma branch file key
      const branches = await figma.get(`/files/${figmaFileKey}/branches`);
      const branch = branches.branches?.find(b => b.name.toLowerCase().includes(branchName.toLowerCase()));
      if (branch) {
        effectiveFileKey = branch.key;
        console.log(`🌿  Targeting Figma branch: ${branch.name} (${branch.key})`);
      } else {
        console.warn(`⚠️   No Figma branch found matching "${branchName}". Using collection suffix instead.`);
        collectionSuffix = ` [${branchName}]`;
      }
    } else {
      collectionSuffix = ` [${branchName}]`;
    }
  }

  // ── Parse CSS ──────────────────────────────────────────────────────────────
  if (!fs.existsSync(CSS_FILE)) {
    console.error(`❌  ${CSS_FILE} not found. Run: npm run _build:ui`);
    process.exit(1);
  }
  const cssText = fs.readFileSync(CSS_FILE, 'utf8');
  const modeVars = resolveModeVars(parseCssBlocks(cssText));
  const collectionDefs = buildCollectionDefs(config.collections, modeVars, config.humanReadable);

  // ── Dry-run / extract: build full plan and report, then exit ───────────────
  if (dryRun || extractMode) {
    const idMap = createIdMap();
    const plan = buildPushPlan({
      collectionDefs,
      collectionSuffix,
      existingCollections,
      existingModes,
      existingVars,
      idMap,
      rules,
      varLookup: name => modeVars.rootVars.get(name),
    });

    const { payloadModeValues, deletedVarIds, stats } = plan;
    const hrCount = Object.keys(config.humanReadable).length;
    printStats('Token plan', {
      collections: collectionDefs.length,
      created: stats.new,
      updated: stats.update,
      skipped: stats.skipped,
      deleted: deletedVarIds.size,
      modeValues: payloadModeValues.length,
      humanReadable: hrCount,
    });

    if (dryRun) {
      console.log('\n✅  Dry run complete — no changes made to Figma.\n');
      return;
    }

    // ── Extract to file ───────────────────────────────────────────────────────
    const output = buildExtractView({
      collectionDefs,
      collectionSuffix,
      plan,
      existingModes,
      branchName,
      source: path.relative(ROOT, CSS_FILE),
    });

    const outPath = path.resolve(ROOT, extractFile);
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
    console.log(`\n💾  Extracted ${stats.new + stats.update} tokens → ${path.relative(ROOT, outPath)}\n`);
    return;
  }

  // ── Preview: fetch current state, compute full diff, print, no push ─────────
  if (previewMode) {
    console.log('\n👁️   Fetching current Figma state to compute diff…');
    const existing = await figma.get(`/files/${effectiveFileKey}/variables/local`);
    const {
      collections: previewCollections,
      vars: previewVars,
      modes: previewModes,
    } = parseFigmaVarsResponse(existing);
    const { collByName: existingCollByName, varByName: existingVarByName } = buildLookupMaps(
      previewCollections,
      previewVars
    );

    const previewIdMap = createIdMap();
    populateIdMapFromExisting(previewVars, previewIdMap);

    let previewNew = 0;
    let previewUpdate = 0;
    let previewSkipped = 0;
    const diffReport = [];

    for (const colDef of collectionDefs) {
      const colPlan = buildCollectionPlan({
        colDef,
        collectionSuffix,
        existingCollByName,
        existingModes: previewModes,
        existingVarByName,
        idMap: previewIdMap,
        rules,
        varLookup: name => modeVars.rootVars.get(name),
      });

      previewNew += colPlan.stats.new;
      previewUpdate += colPlan.stats.update;
      previewSkipped += colPlan.stats.skipped;
      diffReport.push({ collectionName: colDef.name + collectionSuffix, diff: colPlan.diff });
    }

    const hrCount = Object.keys(config.humanReadable).length;
    printDiff(diffReport);
    printStats(
      'Push preview',
      {
        collections: collectionDefs.length,
        created: previewNew,
        updated: previewUpdate,
        skipped: previewSkipped,
        deleted: 0,
        modeValues: 0,
        humanReadable: hrCount,
      },
      '\n✅  Preview complete — no changes made to Figma.\n'
    );
    return;
  }

  // ── Push to Figma ─────────────────────────────────────────────────────────
  console.log('\n⬆️   Pushing to Figma…');

  const { totalNew, totalUpdate, totalSkipped, totalDeleted, totalModeValues, diffReport } = await executePush({
    figma,
    effectiveFileKey,
    collectionDefs,
    collectionSuffix,
    existingCollections,
    existingVars,
    existingModes,
    rules,
    varLookup: name => modeVars.rootVars.get(name),
  });

  // ── Diff ───────────────────────────────────────────────────────────────────
  printDiff(diffReport);

  // ── Summary ────────────────────────────────────────────────────────────────
  const hrCount = Object.keys(config.humanReadable).length;
  printStats(
    'Push summary',
    {
      collections: collectionDefs.length,
      created: totalNew,
      updated: totalUpdate,
      skipped: totalSkipped,
      deleted: totalDeleted,
      modeValues: totalModeValues,
      humanReadable: hrCount,
    },
    `\n✅  Done! ${totalNew + totalUpdate} tokens published to Figma.\n`
  );
}

main().catch(err => {
  console.error('❌ ', err.message);
  process.exit(1);
});
