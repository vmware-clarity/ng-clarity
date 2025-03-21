/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

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
  private _children: RecursiveTreeNodeModel<T>[] = [];

  constructor(
    model: T,
    parent: RecursiveTreeNodeModel<T> | null,
    private getChildren: (node: T) => AsyncArray<T> | undefined,
    private featuresService: TreeFeaturesService<T> | undefined
  ) {
    super();
    this.model = model;
    this.parent = parent;
  }

  get children(): RecursiveTreeNodeModel<T>[] {
    this.fetchChildren();
    return this._children;
  }
  set children(value: RecursiveTreeNodeModel<T>[]) {
    this._children = value;
  }

  override destroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    super.destroy();
  }

  clearChildren() {
    this._children.forEach(child => child.destroy());
    delete this._children;
    this.childrenFetched = false;
  }

  fetchChildren() {
    if (this.childrenFetched) {
      return;
    }

    const asyncChildren = this.getChildren(this.model);
    if (isPromise(asyncChildren)) {
      this.loading = true;
      asyncChildren.then(raw => {
        this._children = this.wrapChildren(raw);
        this.loading = false;
      });
    } else if (isObservable(asyncChildren)) {
      this.loading = true;
      this.subscription = asyncChildren.subscribe(raw => {
        this._children = this.wrapChildren(raw);
        this.loading = false;
      });
    } else if (asyncChildren) {
      // Synchronous case
      this._children = this.wrapChildren(asyncChildren);
    } else {
      this._children = [];
    }
    this.childrenFetched = true;
    if (this.featuresService) {
      this.featuresService.childrenFetched.next();
    }
  }

  private wrapChildren(rawModels: T[]) {
    return rawModels.map(m => new RecursiveTreeNodeModel(m, this, this.getChildren, this.featuresService));
  }
}
