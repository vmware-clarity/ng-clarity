/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComponentContext } from '@clr/angular/utils';

/** What is left of a component budget, and whether anything was cut for lack of it. */
export interface NodeBudget {
  remaining: number;
  truncated: boolean;
}

/**
 * `nodes` and their children, depth first, each charged to `budget` while it lasts; nodes of an
 * `excluded` type are dropped with their children, as are nodes more than `levels` deep. For trees that
 * are not walked: published children and provider regions.
 */
export function charged(
  nodes: ClrComponentContext[],
  budget: NodeBudget,
  excluded: ReadonlySet<string> = new Set(),
  levels = Infinity
): ClrComponentContext[] {
  if (levels <= 0) {
    if (nodes.length) {
      budget.truncated = true;
    }
    return [];
  }
  const kept: ClrComponentContext[] = [];
  for (const node of nodes) {
    if (excluded.has(node.type)) {
      continue;
    }
    if (budget.remaining <= 0) {
      budget.truncated = true;
      break;
    }
    budget.remaining--;
    kept.push(node.children ? { ...node, children: charged(node.children, budget, excluded, levels - 1) } : node);
  }
  return kept;
}
