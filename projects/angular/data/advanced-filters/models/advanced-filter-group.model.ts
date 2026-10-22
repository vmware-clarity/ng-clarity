/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAdvancedFilterNode } from './advanced-filter-node.model';
import { ClrAdvancedFilter } from './advanced-filter.model';
import { ClrAdvancedFilterLogic } from '../enums/advanced-filter-logic.enum';

const LOGIC_VALUES = new Set<string>(Object.values(ClrAdvancedFilterLogic));

/**
 * A group of nodes, combined by one logic. The root of every filter tree is a group: an empty root with AND logic is
 * the empty filter, never `null`. A new group has AND logic and no children: set the logic with the `logic` setter and
 * add children with `addChild()`.
 *
 * Nesting is not limited here: `clr-advanced-filters` limits what users can add, and renders deeper trees built in
 * code as they are. Code can build an empty nested group.
 */
export class ClrAdvancedFilterGroup extends ClrAdvancedFilterNode {
  private _logic: ClrAdvancedFilterLogic = ClrAdvancedFilterLogic.AND;
  /**
   * Copy-on-write: replaced by a new frozen array on every change, never changed in place.
   */
  private _children: readonly ClrAdvancedFilterNode[] = Object.freeze([]);

  /**
   * The logic of all direct children. Setting another value emits; setting the current one does nothing.
   * @throws When set to a value that is not a `ClrAdvancedFilterLogic`. Nothing changes then.
   */
  get logic(): ClrAdvancedFilterLogic {
    return this._logic;
  }
  set logic(value: ClrAdvancedFilterLogic) {
    if (this.checkLogic(value) !== this._logic) {
      this._logic = value;
      this.emitChange(this);
    }
  }

  /**
   * The direct children, in order. A frozen array, replaced exactly when the list changes, so its identity tells
   * whether the list changed (for `@for`, OnPush inputs or signals). Change the list with `addChild()`, `remove()` and
   * `clear()`.
   */
  get children(): readonly ClrAdvancedFilterNode[] {
    return this._children;
  }

  /**
   * Adds `node`, with its subtree, at `index`: its position after the call. A missing, non-integer or out-of-range
   * index means at the end.
   *
   * A node that already has a parent is moved: within this group (a reorder), from another group of this tree, or from
   * another tree. It keeps its id and its subtree. A reorder emits once. A move out of another group is a removal from
   * that group and an addition to this one: two changes, each emitted up to its own root, the removal first, both
   * after the move is complete. Adding a node where it already is emits nothing.
   *
   * @returns `node`, for chaining.
   * @throws When `node` is not a `ClrAdvancedFilterGroup` or a `ClrAdvancedFilter`, or is this group or one of its
   *   ancestors. Nothing changes then.
   */
  addChild<T extends ClrAdvancedFilterNode>(node: T, index?: number): T {
    this.checkNode(node);
    for (let current: ClrAdvancedFilterNode | null = this; current; current = current.parent) {
      if (current === node) {
        throw new Error('ClrAdvancedFilterGroup: a group cannot be added to itself or to one of its descendants.');
      }
    }
    const oldParent = node.parent;
    const siblings = this._children.filter(child => child !== node);
    const position = Number.isInteger(index) && index >= 0 && index <= siblings.length ? index : siblings.length;
    if (oldParent === this && this._children.indexOf(node) === position) {
      return node;
    }
    if (oldParent && oldParent !== this) {
      oldParent._children = Object.freeze(oldParent._children.filter(child => child !== node));
    }
    siblings.splice(position, 0, node);
    this._children = Object.freeze(siblings);
    this.linkChild(node);
    if (oldParent && oldParent !== this) {
      this.emitChange(oldParent, this);
    } else {
      this.emitChange(this);
    }
    return node;
  }

  /**
   * Clear all: removes every child and sets the logic back to AND, in one change. The group keeps its id; the removed
   * children are detached and stay usable. Emits nothing when the group already is an empty AND group.
   */
  clear(): void {
    if (!this._children.length && this._logic === ClrAdvancedFilterLogic.AND) {
      return;
    }
    // An empty list keeps its array, so the identity of `children` changes only when the list does.
    if (this._children.length) {
      this._children.forEach(child => this.unlinkChild(child));
      this._children = Object.freeze([]);
    }
    this._logic = ClrAdvancedFilterLogic.AND;
    this.emitChange(this);
  }

  toJSON(): { id: string; logic: ClrAdvancedFilterLogic; children: object[] } {
    return { id: this.id, logic: this._logic, children: this._children.map(child => child.toJSON()) };
  }

  protected override detachChild(child: ClrAdvancedFilterNode): void {
    this._children = Object.freeze(this._children.filter(current => current !== child));
  }

  /**
   * Throws for a value that is not an enum member, like the datagrid's `selectionTypeAttribute()`.
   */
  private checkLogic(logic: ClrAdvancedFilterLogic): ClrAdvancedFilterLogic {
    if (!LOGIC_VALUES.has(logic)) {
      throw new Error(`Invalid ClrAdvancedFilterLogic: '${logic}'. Expected one of: ${[...LOGIC_VALUES].join(', ')}`);
    }
    return logic;
  }

  /**
   * Only the two node classes. Cycles are checked by `addChild()`.
   */
  private checkNode(node: ClrAdvancedFilterNode): void {
    if (!(node instanceof ClrAdvancedFilterGroup) && !(node instanceof ClrAdvancedFilter)) {
      throw new Error('ClrAdvancedFilterGroup: only ClrAdvancedFilterGroup and ClrAdvancedFilter nodes can be added.');
    }
  }
}
