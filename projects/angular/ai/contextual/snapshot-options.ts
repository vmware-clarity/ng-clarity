/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrContextSnapshotOptions } from './interfaces/context.interface';

/**
 * Default budgets applied while building a snapshot, tuned to keep snapshots compact
 * enough for an AI agent's context window.
 */
export const CLR_CONTEXT_DEFAULT_OPTIONS: Required<ClrContextSnapshotOptions> = {
  maxTextLength: 100,
  maxItemsPerCollection: 25,
  maxComponents: 100,
  includeDomComponents: true,
};

type BudgetKey = 'maxTextLength' | 'maxItemsPerCollection' | 'maxComponents';

/**
 * The range each budget is held to. The walk stops when a budget is exhausted, so a
 * budget that is not a finite number — `NaN`, `Infinity` — would never be exhausted and
 * the whole document would be walked and serialised; the upper bounds keep even a
 * trusted caller's typo from doing the same.
 */
const BUDGET_RANGES: Record<BudgetKey, { min: number; max: number }> = {
  maxTextLength: { min: 1, max: 10_000 },
  maxItemsPerCollection: { min: 1, max: 1_000 },
  maxComponents: { min: 0, max: 10_000 },
};

const BUDGET_KEYS = Object.keys(BUDGET_RANGES) as BudgetKey[];

/**
 * The budgets a snapshot is actually built with: the caller's options over the defaults,
 * with every budget a finite integer inside its range. Anything that is not a usable
 * number falls back to the default rather than to "unbounded".
 */
export function resolveSnapshotOptions(options?: ClrContextSnapshotOptions): Required<ClrContextSnapshotOptions> {
  const resolved: Required<ClrContextSnapshotOptions> = { ...CLR_CONTEXT_DEFAULT_OPTIONS };
  if (!options) {
    return resolved;
  }
  for (const key of BUDGET_KEYS) {
    const value = options[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      resolved[key] = clamp(Math.floor(value), BUDGET_RANGES[key]);
    }
  }
  if (typeof options.includeDomComponents === 'boolean') {
    resolved.includeDomComponents = options.includeDomComponents;
  }
  return resolved;
}

/**
 * Budgets requested by one party, held to the ceiling set by another: whichever asked
 * for less wins. This is how a host caps what an embedded frame may ask for — a frame
 * can request a smaller snapshot than the host allows, never a larger one.
 */
export function capSnapshotOptions(
  requested: ClrContextSnapshotOptions | undefined,
  ceiling: ClrContextSnapshotOptions | undefined
): ClrContextSnapshotOptions {
  const capped: ClrContextSnapshotOptions = { ...requested };
  if (!ceiling) {
    return capped;
  }
  for (const key of BUDGET_KEYS) {
    const limit = ceiling[key];
    if (typeof limit !== 'number' || !Number.isFinite(limit)) {
      continue;
    }
    const asked = capped[key];
    capped[key] = typeof asked === 'number' && Number.isFinite(asked) ? Math.min(asked, limit) : limit;
  }
  if (ceiling.includeDomComponents === false) {
    capped.includeDomComponents = false;
  }
  return capped;
}

function clamp(value: number, range: { min: number; max: number }): number {
  return Math.min(range.max, Math.max(range.min, value));
}
