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
 *1
 * Options:
 *   --dry-run              Parse and plan the push but make no API calls.
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

import { parseCliArgs } from './cli.mjs';
import { loadEnv } from './env.mjs';
import { loadConfig } from './config.mjs';
import { createFigmaClient } from './figma-client.mjs';
import { parseCssBlocks, resolveModeVars } from './css-parser.mjs';
import { buildCollectionDefs } from './collections.mjs';
import { createTokenRules } from './token-rules.mjs';
import { createIdMap } from './id-map.mjs';
import { buildPushPlan } from './planner.mjs';
import { buildExtractView } from './extract-view.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const CONFIG_PATH = path.join(ROOT, 'figma-tokens.config.json');
const CSS_FILE = path.join(ROOT, 'dist', 'clr-ui', 'clr-ui.css');

const BATCH = 500;

async function main() {
  // ── CLI + environment ─────────────────────────────────────────────────────
  const { dryRun, extractMode, extractFile, branchName } = parseCliArgs();
  const { figmaToken, figmaFileKey, figmaBranchMode } = loadEnv({ extractMode });
  const config = loadConfig(CONFIG_PATH);
  const rules = createTokenRules(config);
  const figma = createFigmaClient(figmaToken);

  console.log(
    `\n🎨  Figma token push — file: ${figmaFileKey}${branchName ? ` [branch: ${branchName}]` : ''}${dryRun ? ' (DRY RUN)' : ''}\n`
  );

  // ── Parse CSS ──────────────────────────────────────────────────────────────
  if (!fs.existsSync(CSS_FILE)) {
    console.error(`❌  ${CSS_FILE} not found. Run: npm run _build:ui`);
    process.exit(1);
  }
  const cssText = fs.readFileSync(CSS_FILE, 'utf8');
  const modeVars = resolveModeVars(parseCssBlocks(cssText));
  const collectionDefs = buildCollectionDefs(modeVars);

  // ── Fetch existing Figma variables ──────────────────────────────────────────
  let existingCollections = [];
  let existingVars = [];
  let existingModes = [];
  let effectiveFileKey = figmaFileKey;

  if (!dryRun && !extractMode) {
    console.log('⬇️   Fetching existing Figma variables…');
    const existing = await figma.get(`/files/${figmaFileKey}/variables/local`);
    existingCollections = Object.values(existing.meta?.variableCollections ?? {});
    existingModes = Object.values(existing.meta?.variableCollections ?? {}).flatMap(c =>
      c.modes.map(m => ({ ...m, collectionId: c.id }))
    );
    existingVars = Object.values(existing.meta?.variables ?? {});
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

  // ── Build payload ───────────────────────────────────────────────────────────
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

  const { payloadCollections, payloadModes, payloadVars, payloadModeValues, deletedVarIds, stats } = plan;

  // ── Stats ───────────────────────────────────────────────────────────────────
  console.log(`📊  Token plan:`);
  console.log(`    Collections : ${collectionDefs.length}`);
  console.log(`    New vars    : ${stats.new}`);
  console.log(`    Updated vars: ${stats.update}`);
  console.log(`    Skipped     : ${stats.skipped}  (complex multi-value strings)`);
  console.log(`    Deletions   : ${deletedVarIds.size}  (type corrections)`);
  console.log(`    Mode values : ${payloadModeValues.length}`);

  if (dryRun) {
    console.log('\n✅  Dry run complete — no changes made to Figma.\n');
    return;
  }

  // ── Extract to file ─────────────────────────────────────────────────────────
  if (extractMode) {
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

  // ── Push to Figma ─────────────────────────────────────────────────────────
  console.log('\n⬆️   Pushing to Figma…');
  const createUpdateVars = payloadVars.filter(v => v.action !== 'DELETE');
  const deleteVars = payloadVars.filter(v => v.action === 'DELETE');

  if (deleteVars.length > 0) {
    console.log(deleteVars);
    console.log(`  🗑️   Deleting ${deleteVars.length} type-mismatched variables first…`);
    await figma.post(`/files/${effectiveFileKey}/variables`, {
      variableCollections: [],
      variableModes: [],
      variables: deleteVars,
      variableModeValues: [],
    });
  }

  console.log(createUpdateVars);
  await batchedPush(
    figma,
    effectiveFileKey,
    'Push',
    createUpdateVars,
    payloadModeValues,
    payloadCollections,
    payloadModes
  );

  console.log(`\n✅  Done! ${stats.new + stats.update} tokens published to Figma.\n`);
}

/**
 * Split into batches to stay under Figma's 500-item limit per request.
 * Collections + modes are sent only with the first batch.
 */
async function batchedPush(figma, fileKey, label, allVars, allModeValues, payloadCollections, payloadModes) {
  for (let i = 0; i < allVars.length; i += BATCH) {
    const slice = allVars.slice(i, i + BATCH);
    // Include mode values for the vars in this slice
    const sliceIds = new Set(slice.map(v => v.id));
    const sliceMV = allModeValues.filter(mv => sliceIds.has(mv.variableId));
    console.log(
      `  📤  ${label} batch ${Math.floor(i / BATCH) + 1}: ${slice.length} vars, ${sliceMV.length} mode values`
    );
    await figma.post(`/files/${fileKey}/variables`, {
      variableCollections: i === 0 ? payloadCollections : [],
      variableModes: i === 0 ? payloadModes : [],
      variables: slice,
      variableModeValues: sliceMV,
    });
  }
}

main().catch(err => {
  console.error('❌ ', err.message);
  process.exit(1);
});
