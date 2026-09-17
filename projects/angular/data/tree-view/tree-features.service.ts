/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, Optional, SkipSelf, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';

import { RecursiveTreeNodeModel } from './models/recursive-tree-node.model';
import { ClrRecursiveForOfContext } from './recursive-for-of';

@Injectable()
export class TreeFeaturesService<T> {
  selectable = false;
  eager = true;
  recursion: {
    template: TemplateRef<ClrRecursiveForOfContext<T>>;
    root: RecursiveTreeNodeModel<T>[];
  };
  childrenFetched = new Subject<void>();

  /**
   * Whether every node of the tree is expanded: `true` when they all are, `false` when none of them are, and
   * `null` when only some of them are. See `ClrTree.expandAll()`.
   * Nodes created afterwards (lazy-loaded children, dynamic nodes) come in expanded while this is `true`.
   */
  allExpanded: boolean | null = false;
  /*
   * Internal, registered by ClrTree to be told when the tree-wide state changes on its own.
   */
  _onAllExpandedChange: (state: boolean | null) => void;

  /*
   * Internal, called when any node of the tree expands or collapses on its own. If the tree claimed the
   * opposite for every node, it is now only partly expanded.
   */
  _markAllExpandedMixed(expanded: boolean) {
    if (this.allExpanded === !expanded) {
      this.allExpanded = null;
      if (this._onAllExpandedChange) {
        this._onAllExpandedChange(null);
      }
    }
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
