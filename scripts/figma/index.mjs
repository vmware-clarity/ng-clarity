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
import { buildPushPlan, buildCollectionPlan, populateIdMapFromExisting } from './planner.mjs';
import { buildExtractView } from './extract-view.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const CONFIG_PATH = path.join(ROOT, 'figma-tokens.config.json');
const CSS_FILE = path.join(ROOT, 'dist', 'clr-ui', 'clr-ui.css');

/** Maximum variables per Figma POST request. */
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
    console.log(`📊  Token plan:`);
    console.log(`    Collections    : ${collectionDefs.length}`);
    console.log(`    New vars       : ${stats.new}`);
    console.log(`    Updated vars   : ${stats.update}`);
    console.log(`    Skipped        : ${stats.skipped}  (complex multi-value strings)`);
    console.log(`    Deletions      : ${deletedVarIds.size}  (type corrections)`);
    console.log(`    Mode values    : ${payloadModeValues.length}`);
    console.log(`    Human readable : ${hrCount}`);

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

  // ── Push to Figma: one collection at a time ────────────────────────────────
  //
  // Figma temp IDs are only valid within the single POST request that declares
  // them.  Sending multiple collections in one batched POST (or across batches)
  // means batch 2+ carry stale temp IDs that Figma no longer recognises.
  //
  // The fix: push each collection in its own POST, then GET the current variable
  // list and refresh idMap with real Figma IDs before planning the next
  // collection.  Cross-collection VARIABLE_ALIAS values in subsequent
  // collections therefore always reference real IDs, not temp ones.
  console.log('\n⬆️   Pushing to Figma…');

  const idMap = createIdMap();
  populateIdMapFromExisting(existingVars, idMap);

  // Shared lookup structures — updated after each GET so subsequent collections
  // see the latest state (real IDs, newly-created collections/modes).
  const existingCollByName = new Map(existingCollections.map(c => [c.name, c]));
  const existingVarByName = new Map(existingVars.map(v => [v.name, v]));

  // Shared temp-ID counter: must be shared across all buildCollectionPlan calls
  // so temp IDs are globally unique within this push run.
  const tempIdCounter = { n: 0 };
  const tempId = () => `temp-${++tempIdCounter.n}`;

  let totalNew = 0;
  let totalUpdate = 0;
  let totalSkipped = 0;
  let totalDeleted = 0;
  let totalModeValues = 0;

  for (const colDef of collectionDefs) {
    console.log(`\n  📦  Collection: "${colDef.name}"`);

    const colPlan = buildCollectionPlan({
      colDef,
      collectionSuffix,
      existingCollByName,
      existingModes,
      existingVarByName,
      idMap,
      rules,
      varLookup: name => modeVars.rootVars.get(name),
      tempId,
    });

    totalNew += colPlan.stats.new;
    totalUpdate += colPlan.stats.update;
    totalSkipped += colPlan.stats.skipped;
    totalDeleted += colPlan.deletedVarIds.size;
    totalModeValues += colPlan.payloadModeValues.length;

    // ── Type-mismatch deletions (must precede recreations) ─────────────────
    const deleteVars = colPlan.payloadVars.filter(v => v.action === 'DELETE');
    if (deleteVars.length > 0) {
      console.log(`    🗑️   Deleting ${deleteVars.length} type-mismatched variable(s)…`);
      await figma.post(`/files/${effectiveFileKey}/variables`, {
        variableCollections: [],
        variableModes: [],
        variables: deleteVars,
        variableModeValues: [],
      });
    }

    // ── Push this collection in batches ────────────────────────────────────
    // Each collection is kept in a single POST whenever possible (< BATCH vars).
    // If a collection exceeds BATCH variables it is split, but the collection and
    // modes are always included in the first batch so Figma can resolve the IDs.
    const createUpdateVars = colPlan.payloadVars.filter(v => v.action !== 'DELETE');

    for (let i = 0; i < Math.max(createUpdateVars.length, 1); i += BATCH) {
      const slice = createUpdateVars.slice(i, i + BATCH);
      const sliceIds = new Set(slice.map(v => v.id));
      const sliceMV = colPlan.payloadModeValues.filter(mv => sliceIds.has(mv.variableId));
      console.log(
        `    📤  Batch ${Math.floor(i / BATCH) + 1}: ${slice.length} var(s), ${sliceMV.length} mode value(s)`
      );
      await figma.post(`/files/${effectiveFileKey}/variables`, {
        variableCollections: i === 0 ? colPlan.payloadCollections : [],
        variableModes: i === 0 ? colPlan.payloadModes : [],
        variables: slice,
        variableModeValues: sliceMV,
      });
    }

    // ── Refresh idMap with real Figma IDs ──────────────────────────────────
    // Any temp IDs assigned during this collection's plan are now resolved to
    // real Figma IDs.  The next collection's VARIABLE_ALIAS mode values will
    // therefore carry real IDs rather than stale temp IDs.
    console.log(`    🔄  Syncing variable IDs…`);
    const fresh = await figma.get(`/files/${effectiveFileKey}/variables/local`);
    const freshCollections = Object.values(fresh.meta?.variableCollections ?? {});
    const freshVars = Object.values(fresh.meta?.variables ?? {});

    // Rebuild idMap and lookup structures from the authoritative Figma state.
    populateIdMapFromExisting(freshVars, idMap);

    existingCollByName.clear();
    for (const c of freshCollections) {
      existingCollByName.set(c.name, c);
    }

    existingVarByName.clear();
    for (const v of freshVars) {
      existingVarByName.set(v.name, v);
    }

    existingModes.length = 0;
    existingModes.push(...freshCollections.flatMap(c => c.modes.map(m => ({ ...m, collectionId: c.id }))));
  }

  // ── Remove Figma's auto-created "Mode 1" from every new collection ──────────
  // Figma silently appends a default "Mode 1" whenever a collection is created,
  // even when we supply our own named modes in the same request.  Detect and
  // delete every such stale mode now that all collections are live.
  const defaultModes = existingModes.filter(m => m.name === 'Mode 1');
  if (defaultModes.length > 0) {
    console.log(`\n  🧹  Removing ${defaultModes.length} auto-created "Mode 1" mode(s)…`);
    await figma.post(`/files/${effectiveFileKey}/variables`, {
      variableCollections: [],
      variableModes: defaultModes.map(m => ({ action: 'DELETE', id: m.modeId, variableCollectionId: m.collectionId })),
      variables: [],
      variableModeValues: [],
    });
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  const hrCount = Object.keys(config.humanReadable).length;
  console.log(`\n📊  Push summary:`);
  console.log(`    Collections    : ${collectionDefs.length}`);
  console.log(`    New vars       : ${totalNew}`);
  console.log(`    Updated vars   : ${totalUpdate}`);
  console.log(`    Skipped        : ${totalSkipped}  (complex multi-value strings)`);
  console.log(`    Deletions      : ${totalDeleted}  (type corrections)`);
  console.log(`    Mode values    : ${totalModeValues}`);
  console.log(`    Human readable : ${hrCount}`);
  console.log(`\n✅  Done! ${totalNew + totalUpdate} tokens published to Figma.\n`);
}

main().catch(err => {
  console.error('❌ ', err.message);
  process.exit(1);
});
