/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  afterNextRender,
  ChangeDetectorRef,
  Injectable,
  Injector,
  Optional,
  SkipSelf,
  TemplateRef,
} from '@angular/core';
import { Subject } from 'rxjs';

import { RecursiveTreeNodeModel } from './models/recursive-tree-node.model';
import { TreeNodeModel } from './models/tree-node.model';
import { ClrRecursiveForOfContext } from './recursive-for-of';

/**
 * A request to expand or collapse a whole scope of the tree at once.
 * A `null` scope targets every node in the tree, otherwise the scope node itself and all of its descendants.
 */
export interface TreeExpandAllRequest<T> {
  scope: TreeNodeModel<T> | null;
  expanded: boolean;
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
   * Broadcast of bulk expand/collapse requests. Every node in the tree listens to it and applies the request
   * if it is inside the scope, which makes the whole operation O(N) with a single change detection pass,
   * regardless of whether the tree is declarative or recursive.
   */
  expandAllRequest = new Subject<TreeExpandAllRequest<T>>();

  /**
   * Scopes that are currently in the "everything expanded" state.
   * Nodes that get created later (lazy-loaded children, dynamically added nodes) check this when they initialize,
   * so that they come in expanded too. A scope is cleared as soon as any node inside it is collapsed.
   */
  expandedScopes = new Set<TreeNodeModel<T> | null>();

  /**
   * Emits the scope that was just cleared, so that the owner of the corresponding `clrExpandAll` binding
   * can update its two-way binding.
   */
  expandedScopeCleared = new Subject<TreeNodeModel<T> | null>();

  /**
   * True while a bulk request is being rendered. Nodes skip their expand/collapse animation during that time,
   * since animating hundreds of nested containers at once forces a layout for each of them.
   */
  animationsDisabled = false;

  setExpandedScope(scope: TreeNodeModel<T> | null, expanded: boolean) {
    if (expanded) {
      this.expandedScopes.add(scope);
    } else {
      this.expandedScopes.delete(scope);
    }
  }

  /**
   * Applies a bulk request to every node currently in the tree, without animations, then re-enables the
   * animations once the result has been rendered.
   */
  requestExpandAll(scope: TreeNodeModel<T> | null, expanded: boolean, injector: Injector, cdr: ChangeDetectorRef) {
    this.setExpandedScope(scope, expanded);
    this.animationsDisabled = true;
    this.expandAllRequest.next({ scope, expanded });
    // Nodes have the default change detection strategy, so marking the caller is enough to refresh all of them
    // on the next tick, even in zoneless applications.
    cdr.markForCheck();
    afterNextRender(
      () => {
        this.animationsDisabled = false;
        cdr.markForCheck();
      },
      { injector }
    );
  }

  /**
   * Whether the given node is inside a scope that is currently in the "everything expanded" state.
   */
  isInExpandedScope(model: TreeNodeModel<T>): boolean {
    if (this.expandedScopes.size === 0) {
      return false;
    }
    if (this.expandedScopes.has(null)) {
      return true;
    }
    for (let current = model; current; current = current.parent) {
      if (this.expandedScopes.has(current)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Called when a node collapses: every scope containing that node is no longer fully expanded.
   */
  clearExpandedScopesContaining(model: TreeNodeModel<T>) {
    if (this.expandedScopes.size === 0) {
      return;
    }
    if (this.expandedScopes.delete(null)) {
      this.expandedScopeCleared.next(null);
    }
    for (let current = model; current; current = current.parent) {
      if (this.expandedScopes.delete(current)) {
        this.expandedScopeCleared.next(current);
      }
    }
  }
}

/**
 * Whether a node is inside the given scope: the scope itself or any of its descendants. `null` matches everything.
 */
export function isTreeNodeInScope<T>(model: TreeNodeModel<T>, scope: TreeNodeModel<T> | null): boolean {
  if (scope === null) {
    return true;
  }
  for (let current = model; current; current = current.parent) {
    if (current === scope) {
      return true;
    }
  }
  return false;
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
