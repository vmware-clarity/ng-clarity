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
 * to a JSON file. Requires no Figma credentials. Branch names are always rendered
 * as a collection suffix — no network call is made to resolve them.
 */

import fs from 'node:fs';
import path from 'node:path';

import { buildExtractView } from '../api/extract-view.mjs';
import { buildPlan, printPlanStats } from './plan.mjs';

/**
 * @param {import('../setup/context.mjs').RunContext} ctx
 */
export function runExtract(ctx) {
  const collectionSuffix = ctx.branchName ? ` [${ctx.branchName}]` : '';
  console.log(
    `\n🎨  Figma token extract${ctx.figmaFileKey ? ` — file: ${ctx.figmaFileKey}` : ''}${ctx.branchName ? ` [branch: ${ctx.branchName}]` : ''}\n`
  );

  const plan = buildPlan(ctx, collectionSuffix);
  printPlanStats(ctx, plan);

  const output = buildExtractView({
    collectionDefs: ctx.collectionDefs,
    collectionSuffix,
    plan,
    existingModes: [],
    branchName: ctx.branchName,
    source: ctx.source,
  });

  const outPath = path.resolve(ctx.root, ctx.extractFile);
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');

  const { stats } = plan;
  console.log(`\n💾  Extracted ${stats.new + stats.update} tokens → ${path.relative(ctx.root, outPath)}\n`);
}
