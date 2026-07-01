/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Plan-building helpers shared by the dry-run and extract controllers.
 *
 * Both branches build the same full push plan (no network I/O, temp IDs are
 * never resolved to real ones) and print the same "Token plan" summary; only
 * their tail behavior differs (one logs, the other serializes to disk).
 */

import { createIdMap } from '../core/id-map.mjs';
import { buildPushPlan } from '../core/planner.mjs';
import { printStats } from '../api/diff-printer.mjs';

/**
 * Build the complete push plan for all collections.
 *
 * @param {import('../setup/context.mjs').RunContext} ctx
 * @returns {ReturnType<typeof buildPushPlan>}
 */
export function buildPlan(ctx) {
  const idMap = createIdMap();
  return buildPushPlan({
    collectionDefs: ctx.collectionDefs,
    existingCollections: [],
    existingModes: [],
    existingVars: [],
    idMap,
    rules: ctx.rules,
    varLookup: ctx.varLookup,
  });
}

/**
 * Print the "Token plan" stats summary for a built plan.
 *
 * @param {import('../setup/context.mjs').RunContext} ctx
 * @param {ReturnType<typeof buildPushPlan>} plan
 */
export function printPlanStats(ctx, plan) {
  const { payloadModeValues, deprecatedVarIds, stats } = plan;
  printStats('Token plan', {
    collections: ctx.collectionDefs.length,
    created: stats.new,
    updated: stats.update,
    skipped: stats.skipped,
    deprecated: deprecatedVarIds.size,
    modeValues: payloadModeValues.length,
  });
}
