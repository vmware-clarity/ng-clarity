/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type { ClrAdvancedFilterNode } from '../models/advanced-filter-node.model';

/**
 * What `ClrAdvancedFilterNode.changes` emits: one change per changed node, from `addChild()`, `remove()`, `clear()`,
 * the logic setter, the operator and value setters, or `set()`. A move out of another group changes two nodes, the
 * group it left and the group it joined, so it emits two changes. The same object is emitted on the changed node and
 * on each of its ancestors, deepest first, so the root emits last.
 *
 * An object rather than a bare node, so that members can be added later, for example the kind of change.
 */
export interface ClrAdvancedFilterChange {
  /**
   * The node whose own state changed:
   * - a filter whose operator or value changed;
   * - a group whose logic or list of direct children changed: the group a node was added to or removed from.
   *
   * A node that was added, moved or removed is not listed itself: its own state did not change.
   */
  readonly node: ClrAdvancedFilterNode;
}
