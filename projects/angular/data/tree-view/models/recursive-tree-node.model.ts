/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { signal, untracked } from '@angular/core';
import { isObservable, Subscription } from 'rxjs';

import { TreeFeaturesService } from '../tree-features.service';
import { AsyncArray, isPromise } from './async-array';
import { TreeNodeModel } from './tree-node.model';

/*
 * A recursive model is built received from the app and traversed to create the corresponding components.
 * Recursive = Model dictates the tree node components
 */
export class RecursiveTreeNodeModel<T> extends TreeNodeModel<T> {
  parent: RecursiveTreeNodeModel<T> | null;

  private subscription: Subscription;
  private childrenFetched = false;
  private destroyed = false;
  // A signal, so that the node is refreshed when its children arrive or get cleared.
  private readonly _children = signal<RecursiveTreeNodeModel<T>[]>([]);

  constructor(
    model: T,
    parent: RecursiveTreeNodeModel<T> | null,
    private getChildren: (node: T) => AsyncArray<T> | undefined,
    // No longer used: the children are a signal now. Kept so that the constructor signature does not change.
    _featuresService?: TreeFeaturesService<T>
  ) {
    super();
    this.model = model;
    this.parent = parent;
  }

  get children(): RecursiveTreeNodeModel<T>[] {
    // The children are fetched the first time they are read, often by a template while Angular renders it, and
    // fetching writes the loading state. The app's getChildren function is not a dependency of that template either.
    untracked(() => this.fetchChildren());
    return this._children();
  }
  set children(value: RecursiveTreeNodeModel<T>[]) {
    this._children.set(value);
  }

  override get _loadedChildren(): RecursiveTreeNodeModel<T>[] {
    return this._children();
  }

  override destroy() {
    this.destroyed = true;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    super.destroy();
  }

  clearChildren() {
    this._children().forEach(child => child.destroy());
    this._children.set([]);
    this.childrenFetched = false;
  }

  fetchChildren() {
    if (this.destroyed || this.childrenFetched) {
      return;
    }

    const asyncChildren = this.getChildren(this.model);
    if (isPromise(asyncChildren)) {
      this.loading = true;
      asyncChildren.then(raw => {
        if (this.destroyed) {
          return;
        }
        this._children.set(this.wrapChildren(raw));
        this.loading = false;
      });
    } else if (isObservable(asyncChildren)) {
      this.loading = true;
      this.subscription = asyncChildren.subscribe(raw => {
        this._children.set(this.wrapChildren(raw));
        this.loading = false;
      });
    } else if (asyncChildren) {
      // Synchronous case
      this._children.set(this.wrapChildren(asyncChildren));
    } else {
      this._children.set([]);
    }
    this.childrenFetched = true;
  }

  private wrapChildren(rawModels: T[] | null | undefined) {
    return (rawModels || []).map(m => new RecursiveTreeNodeModel(m, this, this.getChildren));
  }
}
