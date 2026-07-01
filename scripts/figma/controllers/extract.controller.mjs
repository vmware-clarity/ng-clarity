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
 * to a JSON file. Requires no Figma credentials.
 */

import fs from 'node:fs';
import path from 'node:path';

import { buildExtractView } from '../api/extract-view.mjs';
import { buildPlan, printPlanStats } from './plan.mjs';

/**
 * @param {ReturnType<import('../setup/cli.mjs').parseCliArgs>} cli
 * @param {import('../setup/context.mjs').RunContext} ctx
 */
export function runExtract(cli, ctx) {
  console.log('\n🎨  Figma token extract\n');

  const plan = buildPlan(ctx);
  printPlanStats(ctx, plan);

  const output = buildExtractView({
    collectionDefs: ctx.collectionDefs,
    plan,
    existingModes: [],
    source: ctx.source,
  });

  const outPath = path.resolve(ctx.root, cli.extractFile);
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');

  const { stats } = plan;
  console.log(`\n💾  Extracted ${stats.new + stats.update} tokens → ${path.relative(ctx.root, outPath)}\n`);
}
