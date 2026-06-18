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
 * calls. Useful for verifying parsing and planning before a real push.
 */

import { buildPlan, printPlanStats } from './plan.mjs';

/**
 * @param {import('../setup/context.mjs').RunContext} ctx
 */
export function runDryRun(ctx) {
  const plan = buildPlan(ctx);
  printPlanStats(ctx, plan);
  console.log('\n✅  Dry run complete — no changes made to Figma.\n');
}
