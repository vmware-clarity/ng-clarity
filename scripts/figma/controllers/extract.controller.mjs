/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Extract controller (`--extract [file]`).
 *
 * Builds the full push plan and serializes a human-readable, per-collection view
 * of it to a JSON file instead of pushing. Requires no Figma credentials.
 */

import fs from 'node:fs';
import path from 'node:path';

import { buildExtractView } from '../api/extract-view.mjs';
import { buildPlan, printPlanStats } from './plan.mjs';

/**
 * @param {import('../setup/context.mjs').RunContext} ctx
 */
export function runExtract(ctx) {
  const plan = buildPlan(ctx);
  printPlanStats(ctx, plan);

  const output = buildExtractView({
    collectionDefs: ctx.collectionDefs,
    collectionSuffix: ctx.collectionSuffix,
    plan,
    existingModes: ctx.existingModes,
    branchName: ctx.branchName,
    source: ctx.source,
  });

  const outPath = path.resolve(ctx.root, ctx.extractFile);
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');

  const { stats } = plan;
  console.log(`\n💾  Extracted ${stats.new + stats.update} tokens → ${path.relative(ctx.root, outPath)}\n`);
}
