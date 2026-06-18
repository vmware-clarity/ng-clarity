/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Push controller (default mode).
 *
 * Pushes the planned variables to Figma one collection at a time (via
 * {@link executePush}), then prints the change diff and the final summary.
 */

import { executePush } from '../api/push-executor.mjs';
import { printDiff, printStats } from '../api/diff-printer.mjs';

/**
 * @param {import('../setup/context.mjs').RunContext} ctx
 */
export async function runPush(ctx) {
  console.log('\n⬆️   Pushing to Figma…');

  const { totalNew, totalUpdate, totalSkipped, totalDeleted, totalModeValues, diffReport } = await executePush({
    figma: ctx.figma,
    effectiveFileKey: ctx.effectiveFileKey,
    collectionDefs: ctx.collectionDefs,
    collectionSuffix: ctx.collectionSuffix,
    existingCollections: ctx.existingCollections,
    existingVars: ctx.existingVars,
    existingModes: ctx.existingModes,
    rules: ctx.rules,
    varLookup: ctx.varLookup,
  });

  printDiff(diffReport);

  printStats(
    'Push summary',
    {
      collections: ctx.collectionDefs.length,
      created: totalNew,
      updated: totalUpdate,
      skipped: totalSkipped,
      deleted: totalDeleted,
      modeValues: totalModeValues,
      humanReadable: ctx.humanReadableCount,
    },
    `\n✅  Done! ${totalNew + totalUpdate} tokens published to Figma.\n`
  );
}
