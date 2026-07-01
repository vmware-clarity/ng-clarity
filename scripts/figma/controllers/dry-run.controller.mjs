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
 * calls.
 */

import { buildPlan, printPlanStats } from './plan.mjs';

/**
 * @param {import('../setup/context.mjs').RunContext} ctx
 */
export function runDryRun(ctx) {
  console.log(`\n🎨  Figma token dry run — file: ${ctx.figmaFileKey}\n`);
  const plan = buildPlan(ctx);
  printPlanStats(ctx, plan);
  console.log('\n✅  Dry run complete — no changes made to Figma.\n');
}
