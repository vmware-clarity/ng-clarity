/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, Optional, signal, SkipSelf, TemplateRef } from '@angular/core';

import { RecursiveTreeNodeModel } from './models/recursive-tree-node.model';
import { ClrRecursiveForOfContext } from './recursive-for-of';

interface TreeRecursion<T> {
  template: TemplateRef<ClrRecursiveForOfContext<T>>;
  root: RecursiveTreeNodeModel<T>[];
}

@Injectable()
export class TreeFeaturesService<T> {
  /*
   * Internal. Whether a bulk expansion is currently in effect for the whole tree, so that nodes created
   * afterwards (lazy-loaded children, dynamic nodes) come in expanded. See `ClrTree.expandAll()`.
   * Cleared as soon as any node of the tree is collapsed on its own.
   */
  _allExpanded = false;

  // Held in signals, so that every node of the tree is refreshed when a feature of the whole tree changes.
  private readonly _selectable = signal(false);
  private readonly _eager = signal(true);
  private readonly _recursion = signal<TreeRecursion<T> | undefined>(undefined);

  get selectable(): boolean {
    return this._selectable();
  }
  set selectable(value: boolean) {
    this._selectable.set(value);
  }

  get eager(): boolean {
    return this._eager();
  }
  set eager(value: boolean) {
    this._eager.set(value);
  }

  get recursion(): TreeRecursion<T> | undefined {
    return this._recursion();
  }
  set recursion(value: TreeRecursion<T> | undefined) {
    this._recursion.set(value);
  }
}

export function treeFeaturesFactory<T>(existing: TreeFeaturesService<T>) {
  return existing || new TreeFeaturesService();
}

export const TREE_FEATURES_PROVIDER = {
  provide: TreeFeaturesService,
  useFactory: treeFeaturesFactory,
  /*
   * The Optional + SkipSelf pattern ensures that in case of nested components, only the root one will
   * instantiate a new service and all its children will reuse the root's instance.
   * If there are several roots (in this case, several independent trees on a page), each root will instantiate
   * its own service so they won't interfere with one another.
   *
   * TL;DR - Optional + SkipSelf = 1 instance of TreeFeaturesService per tree.
   */
  deps: [[new Optional(), new SkipSelf(), TreeFeaturesService]],
};
