/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Dry-run controller (`--dry-run`).
 *
 * Builds the full push plan and prints the summary without making any Figma API
 * calls. No branch-to-file-key resolution is needed: when a branch name is
 * supplied, it is always rendered as a collection suffix.
 */

import { buildPlan, printPlanStats } from './plan.mjs';

/**
 * @param {import('../setup/context.mjs').RunContext} ctx
 */
export function runDryRun(ctx) {
  const collectionSuffix = ctx.branchName ? ` [${ctx.branchName}]` : '';
  console.log(
    `\n🎨  Figma token dry run — file: ${ctx.figmaFileKey}${ctx.branchName ? ` [branch: ${ctx.branchName}]` : ''}\n`
  );

  const plan = buildPlan(ctx, collectionSuffix);
  printPlanStats(ctx, plan);
  console.log('\n✅  Dry run complete — no changes made to Figma.\n');
}
