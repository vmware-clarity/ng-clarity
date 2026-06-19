/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Push controller (default mode).
 *
 * Creates the Figma client, fetches the existing Figma state, then pushes the
 * planned variables one collection at a time (via {@link executePush}) and
 * prints the change diff and final summary.
 */

import { createFigmaClient } from '../api/figma-client.mjs';
import { executePush } from '../api/push-executor.mjs';
import { printStats } from '../api/diff-printer.mjs';
import { parseFigmaVarsResponse } from '../util/figma-response.mjs';
import { loadEnv } from '../setup/env.mjs';

/**
 * @param {import('../setup/context.mjs').RunContext} ctx
 */
export async function runPush(ctx) {
  const { figmaToken, figmaFileKey } = loadEnv();
  const figma = createFigmaClient(figmaToken);

  console.log(`\n🎨  Figma token push — file: ${figmaFileKey}\n`);

  console.log('⬇️   Fetching existing Figma variables…');
  const existing = await figma.getVariables(figmaFileKey);
  const {
    collections: existingCollections,
    vars: existingVars,
    modes: existingModes,
  } = parseFigmaVarsResponse(existing);

  console.log('\n⬆️   Pushing to Figma…');

  const { totalNew, totalUpdate, totalSkipped, totalDeleted, totalModeValues } = await executePush({
    figma,
    figmaFileKey,
    collectionDefs: ctx.collectionDefs,
    existingCollections,
    existingVars,
    existingModes,
    rules: ctx.rules,
    varLookup: ctx.varLookup,
  });

  printStats(
    'Push summary',
    {
      collections: ctx.collectionDefs.length,
      created: totalNew,
      updated: totalUpdate,
      skipped: totalSkipped,
      deleted: totalDeleted,
      modeValues: totalModeValues,
    },
    `\n✅  Done! ${totalNew + totalUpdate} tokens published to Figma.\n`
  );
}
