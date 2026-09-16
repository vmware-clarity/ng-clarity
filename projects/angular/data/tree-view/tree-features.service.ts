/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, Optional, SkipSelf, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';

import { RecursiveTreeNodeModel } from './models/recursive-tree-node.model';
import { TreeNodeModel } from './models/tree-node.model';
import { ClrRecursiveForOfContext } from './recursive-for-of';

/**
 * The part of a rendered tree node that bulk expand operations need. Declared here rather than on the models,
 * so that a model never holds a reference to the component rendering it.
 */
export interface TreeNodeExpander {
  setExpandedInBulk(expanded: boolean): void;
  onDescendantsCollapsed(): void;
}

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
   * True while every node of the tree is expected to be expanded, see `ClrTree.expandAll()`.
   * Nodes created afterwards (lazy-loaded children, dynamic nodes) come in expanded while this is set.
   */
  allExpanded = false;
  /*
   * Internal, registered by ClrTree to be told when a node collapses while allExpanded was set.
   */
  _onAllExpandedCleared: () => void;

  /*
   * The rendered node of each model, so that a bulk operation can walk the model tree and apply itself
   * to the matching components. Weak, so that a destroyed node never keeps its model alive.
   */
  private expanders = new WeakMap<TreeNodeModel<T>, TreeNodeExpander>();

  registerExpander(model: TreeNodeModel<T>, expander: TreeNodeExpander) {
    this.expanders.set(model, expander);
  }

  unregisterExpander(model: TreeNodeModel<T>, expander: TreeNodeExpander) {
    // Only if it is still the one registered: a node can be recreated for the same model before the old one is destroyed.
    if (this.expanders.get(model) === expander) {
      this.expanders.delete(model);
    }
  }

  /**
   * Expands or collapses a node and every descendant that is already known.
   * Disabled nodes are left untouched, like for selection.
   */
  setExpandedRecursive(model: TreeNodeModel<T>, expanded: boolean) {
    if (model.disabled) {
      return;
    }
    const expander = this.expanders.get(model);
    if (expander) {
      expander.setExpandedInBulk(expanded);
    }
    for (const child of model.loadedChildren) {
      this.setExpandedRecursive(child as TreeNodeModel<T>, expanded);
    }
  }

  /*
   * Internal, called when a node collapses: neither the tree nor any ancestor of that node
   * can claim that all of their descendants are expanded anymore.
   */
  _onNodeCollapsed(model: TreeNodeModel<T>) {
    for (let current: TreeNodeModel<T> = model; current; current = current.parent) {
      if (current.descendantsExpanded) {
        current.descendantsExpanded = false;
        const expander = this.expanders.get(current);
        if (expander) {
          expander.onDescendantsCollapsed();
        }
      }
    }
    if (this.allExpanded) {
      this.allExpanded = false;
      if (this._onAllExpandedCleared) {
        this._onAllExpandedCleared();
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
