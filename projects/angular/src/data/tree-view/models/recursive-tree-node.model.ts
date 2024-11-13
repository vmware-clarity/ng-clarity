/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { BehaviorSubject, from, isObservable, Observable, of, Subscription, take } from 'rxjs';

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
  private rawChildren: BehaviorSubject<T[]> = new BehaviorSubject([]);

  constructor(
    model: T,
    parent: RecursiveTreeNodeModel<T> | null,
    private getChildren: (node: T) => AsyncArray<T> | undefined,
    private featuresService: TreeFeaturesService<T> | undefined
  ) {
    super();
    this.model = model;
    this.parent = parent;
    this.getRawChildren()
      .pipe(take(1))
      .subscribe(raw => {
        this.rawChildren.next(raw);
      });
  }

  get children(): RecursiveTreeNodeModel<T>[] {
    this.fetchChildren();
    return this._children;
  }
  set children(value: RecursiveTreeNodeModel<T>[]) {
    this._children = value;
  }

  override get hasChildren() {
    // We work with the raw data, opposed to using this.children, as the latter will trigger
    // wrapping the children only to get them counted, which leads to serious performance issues
    return this.rawChildren.getValue() && this.rawChildren.getValue().length > 0;
  }

  override destroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    super.destroy();
  }

  // TODO: research whether we still need this.
  // if we do - cleanup and reset the rawChildren too.
  clearChildren() {
    this._children.forEach(child => child.destroy());
    delete this._children;
    this.childrenFetched = false;
  }

  fetchChildren() {
    if (this.childrenFetched) {
      return;
    }

    this.loading = true;
    this.subscription = this.rawChildren.subscribe(rawChildren => {
      this._children = this.wrapChildren(rawChildren);
      this.loading = false;
      this.childrenFetched = true;
      if (this.featuresService) {
        this.featuresService.childrenFetched.next();
      }
    });
  }

  private getRawChildren(): Observable<T[]> {
    const asyncChildren = this.getChildren(this.model);
    let asObservable: Observable<T[]>;
    if (isPromise(asyncChildren)) {
      asObservable = from<Promise<T[]>>(asyncChildren);
    } else if (isObservable(asyncChildren)) {
      asObservable = asyncChildren;
    } else if (asyncChildren) {
      // Synchronous case
      asObservable = of(asyncChildren);
    } else {
      asObservable = of([]);
    }
    return asObservable;
  }

  private wrapChildren(rawModels: T[]) {
    console.log('WRAPPINGGG', rawModels.length);
    return rawModels.map(m => new RecursiveTreeNodeModel(m, this, this.getChildren, this.featuresService));
  }
}
