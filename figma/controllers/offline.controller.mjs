/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Offline-plan controller (`--dry-run` / `--extract [file]`).
 *
 * Both flags build the exact same full push plan with no network I/O — dry-run
 * requires no Figma credentials by design. They only differ in what happens
 * with the result: dry-run just prints the summary, extract also serializes a
 * per-collection JSON view to disk. Previously these lived in two separate
 * controllers that both called the same plan.mjs helpers; merged here so that
 * difference stays a three-line tail instead of two files.
 */

import fs from 'node:fs';
import path from 'node:path';

import { buildExtractView } from '../api/extract-view.mjs';
import { buildPlan, printPlanStats } from './plan.mjs';

/**
 * @param {ReturnType<import('../setup/cli.mjs').parseCliArgs>} cli
 * @param {import('../setup/context.mjs').RunContext} ctx
 */
export function runOffline(cli, ctx) {
  console.log(cli.extractMode ? '\n🎨  Figma token extract\n' : '\n🎨  Figma token dry run\n');

  const plan = buildPlan(ctx);
  printPlanStats(ctx, plan);

  if (!cli.extractMode) {
    console.log('\n✅  Dry run complete — no changes made to Figma.\n');
    return;
  }

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
