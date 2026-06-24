/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Preview controller (`--preview`).
 *
 * Creates the Figma client, fetches the current Figma state, computes a full
 * create/update diff per collection, prints it, and exits without pushing.
 * Requires credentials.
 */

import { createFigmaClient } from '../api/figma-client.mjs';
import { printDiff, printStats } from '../api/diff-printer.mjs';
import { createIdMap } from '../core/id-map.mjs';
import { buildCollectionPlan, populateIdMapFromExisting } from '../core/planner.mjs';
import { parseFigmaVarsResponse, buildLookupMaps } from '../util/figma-response.mjs';
import { loadEnv } from '../setup/env.mjs';

/**
 * @param {import('../setup/context.mjs').RunContext} ctx
 */
export async function runPreview(ctx) {
  const { figmaToken, figmaFileKey } = loadEnv();
  const figma = createFigmaClient(figmaToken);

  console.log(`\n🎨  Figma token preview — file: ${figmaFileKey}\n`);

  console.log('\n👁️   Fetching current Figma state to compute diff…');
  const existing = await figma.getVariables(figmaFileKey);
  const { collections: previewCollections, vars: previewVars, modes: previewModes } = parseFigmaVarsResponse(existing);
  const {
    collByName: existingCollByName,
    varByName: existingVarByName,
    varsByColId,
  } = buildLookupMaps(previewCollections, previewVars);

  const previewIdMap = createIdMap();
  populateIdMapFromExisting(previewVars, previewIdMap);

  let previewNew = 0;
  let previewUpdate = 0;
  let previewSkipped = 0;
  let previewDeprecated = 0;
  const diffReport = [];

  for (const colDef of ctx.collectionDefs) {
    const colPlan = buildCollectionPlan({
      colDef,
      existingCollByName,
      existingModes: previewModes,
      existingVarByName,
      varsByColId,
      idMap: previewIdMap,
      rules: ctx.rules,
      varLookup: ctx.varLookup,
    });

    previewNew += colPlan.stats.new;
    previewUpdate += colPlan.stats.update;
    previewSkipped += colPlan.stats.skipped;
    previewDeprecated += colPlan.deprecatedVarIds.size;
    diffReport.push({ collectionName: colDef.name, diff: colPlan.diff });
  }

  printDiff(diffReport);
  printStats(
    'Push preview',
    {
      collections: ctx.collectionDefs.length,
      created: previewNew,
      updated: previewUpdate,
      skipped: previewSkipped,
      deprecated: previewDeprecated,
      modeValues: 0,
    },
    '\n✅  Preview complete — no changes made to Figma.\n'
  );
}
