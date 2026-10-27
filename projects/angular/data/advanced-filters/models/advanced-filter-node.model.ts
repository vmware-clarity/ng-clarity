/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { uniqueIdFactory } from '@clr/angular/utils';
import { Observable, Subject } from 'rxjs';

// Type only, so the base class pulls in nothing from its subclasses at runtime, as tree-view's TreeNodeModel does.
import type { ClrAdvancedFilterGroup } from './advanced-filter-group.model';
import { AdvancedFilterChangeQueue } from './change-queue';
import { ClrAdvancedFilterChange } from '../interfaces/advanced-filter-change.interface';

/**
 * A node of a filter tree: a `ClrAdvancedFilterGroup` or a `ClrAdvancedFilter`. Tell them apart with `instanceof`.
 *
 * Nodes are mutable, and consumers get the tree as it is, never a copy. Every change goes through a method or the
 * `logic` setter, so `parent`, `children` and the notifications always agree. A node without a parent is the root of
 * its own tree: a new node, a removed one, or the root of a filter.
 *
 * Not designed to be extended: groups only accept `ClrAdvancedFilterGroup` and `ClrAdvancedFilter` nodes.
 */
export abstract class ClrAdvancedFilterNode {
  /**
   * Generated when the node is created. It never changes: not on a change of operator, value or logic, a move,
   * `remove()` or adding the node again. Unique among the nodes created on the page. Opaque: do not parse it, and do
   * not use it as a DOM id.
   */
  readonly id: string = uniqueIdFactory();

  private _parent: ClrAdvancedFilterGroup | null = null;
  /**
   * Created on the first access to `changes`, so a node nobody listens to holds no Subject.
   */
  private _changes: Subject<ClrAdvancedFilterChange> | undefined;
  private _changes$: Observable<ClrAdvancedFilterChange> | undefined;

  /**
   * The group this node is a direct child of, or `null` for a root or a removed node.
   */
  get parent(): ClrAdvancedFilterGroup | null {
    return this._parent;
  }

  /**
   * Emits once per call that changes this node or anything below it, so on a root it announces every change of the
   * tree. See `ClrAdvancedFilterChange` for what is emitted, and in which order.
   * - It does not emit when you subscribe, and not for calls that change nothing.
   * - It emits synchronously, before the call that made the change returns. A change made by a subscriber while a
   *   change is being emitted waits until that change has reached all its subscribers.
   * - The ancestors that get a change are the ones the node had when the call was made, even if a subscriber moves
   *   the node before the change reaches them.
   * - It never completes: unsubscribe when you are done.
   * - The same Observable on every read, so it can be bound with the `async` pipe.
   */
  get changes(): Observable<ClrAdvancedFilterChange> {
    if (!this._changes$) {
      this._changes = new Subject<ClrAdvancedFilterChange>();
      this._changes$ = this._changes.asObservable();
    }
    return this._changes$;
  }

  /**
   * Detaches this node, with its subtree, from its parent. The node keeps its id and its subtree and stays usable, so
   * it can be added again anywhere. Emits on the former parent and its ancestors.
   * Does nothing for a node without a parent, so a root cannot be removed: use `clear()` instead.
   */
  remove(): void {
    // Typed as the base class, which is what lets this class call the protected hook on another node.
    const parent: ClrAdvancedFilterNode | null = this._parent;
    if (!parent) {
      return;
    }
    parent.detachChild(this);
    this._parent = null;
    this.emitChange(parent);
  }

  /**
   * Internal. Makes this group the parent of `child`. Only `ClrAdvancedFilterGroup` calls it, while it changes its own
   * list of children, so links and lists always agree.
   */
  protected linkChild(this: ClrAdvancedFilterGroup, child: ClrAdvancedFilterNode): void {
    child._parent = this;
  }

  /**
   * Internal. Clears the parent link of `child`, under the same rule as `linkChild()`.
   */
  protected unlinkChild(child: ClrAdvancedFilterNode): void {
    child._parent = null;
  }

  /**
   * Internal hook of `remove()`: `ClrAdvancedFilterGroup` drops `child` from its list of children, without touching
   * links or emitting.
   */
  protected detachChild(_child: ClrAdvancedFilterNode): void {
    // Filters have no children.
  }

  /**
   * Internal. Announces that the own state of each `changed` node changed: the operator or value of a filter, or the
   * logic or list of children of a group. Called after the tree is consistent again. Each node gets its own change,
   * emitted on the node and on each of its ancestors, up to the root, which emits last. The changes go out in the
   * order of the nodes, and the ancestors of all of them are taken before the first is delivered.
   */
  protected emitChange(...changed: ClrAdvancedFilterNode[]): void {
    const deliveries: (() => void)[] = [];
    for (const node of changed) {
      const change: ClrAdvancedFilterChange = Object.freeze({ node });
      for (let current: ClrAdvancedFilterNode | null = node; current; current = current.parent) {
        const target = current;
        // Read at delivery time, so a subscription made by an earlier subscriber gets this change too.
        deliveries.push(() => target._changes?.next(change));
      }
    }
    AdvancedFilterChangeQueue.instance.deliver(deliveries);
  }

  /**
   * The public state of this node and its subtree as plain data, so that `JSON.stringify()` and the `json` pipe work:
   * without it they fail on the circular parent link.
   */
  abstract toJSON(): object;
}
