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
 * Requires credentials. Shares its planning/aggregation loop with the push
 * controller via `executePush({ preview: true })` instead of re-implementing it.
 */

import { createFigmaClient } from '../api/figma-client.mjs';
import { executePush } from '../api/push-executor.mjs';
import { printStats } from '../api/diff-printer.mjs';
import { parseFigmaVarsResponse } from '../util/figma-response.mjs';
import { loadEnv } from '../setup/env.mjs';

/**
 * @param {import('../setup/context.mjs').RunContext} ctx
 */
export async function runPreview(ctx) {
  const { figmaToken, figmaFileKey } = loadEnv();
  const figma = createFigmaClient(figmaToken);

  console.log(`\n🎨  Figma token preview — file: ${figmaFileKey}\n`);

  console.log('👁️   Fetching current Figma state to compute diff…');
  const existing = await figma.getVariables(figmaFileKey);
  const {
    collections: existingCollections,
    vars: existingVars,
    modes: existingModes,
  } = parseFigmaVarsResponse(existing);

  const { totalNew, totalUpdate, totalSkipped, totalDeprecated } = await executePush({
    figma,
    figmaFileKey,
    collectionDefs: ctx.collectionDefs,
    existingCollections,
    existingVars,
    existingModes,
    rules: ctx.rules,
    varLookup: ctx.varLookup,
    preview: true,
  });

  printStats(
    'Push preview',
    {
      collections: ctx.collectionDefs.length,
      created: totalNew,
      updated: totalUpdate,
      skipped: totalSkipped,
      deprecated: totalDeprecated,
      modeValues: 0,
    },
    '\n✅  Preview complete — no changes made to Figma.\n'
  );
}
