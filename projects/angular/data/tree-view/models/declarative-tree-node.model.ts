/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { signal } from '@angular/core';

import { TreeNodeModel } from './tree-node.model';

/*
 * A declarative model is built by traversing the Angular component tree.
 * Declarative = Tree node components dictate the model
 */
export class DeclarativeTreeNodeModel<T> extends TreeNodeModel<T> {
  // Override for a more precise type
  parent: DeclarativeTreeNodeModel<T> | null;

  // The children are held in a plain array that is changed in place, so that adding or removing n siblings is not
  // O(n^2). A version signal tells the parent node to refresh when a child node is added or removed after it was checked.
  private _children: DeclarativeTreeNodeModel<T>[] = [];
  private readonly childrenVersion = signal(0);

  constructor(parent: DeclarativeTreeNodeModel<T> | null) {
    super();
    this.parent = parent;
    if (parent) {
      parent._addChild(this);
    }
  }

  get children(): DeclarativeTreeNodeModel<T>[] {
    this.childrenVersion();
    return this._children;
  }
  set children(value: DeclarativeTreeNodeModel<T>[]) {
    this._children = value;
    this.notifyChildrenChange();
  }

  override destroy() {
    if (this.parent) {
      this.parent._removeChild(this);
    }
    super.destroy();
  }

  _addChild(child: DeclarativeTreeNodeModel<T>) {
    this._children.push(child);
    this.notifyChildrenChange();
  }

  _removeChild(child: DeclarativeTreeNodeModel<T>) {
    const index = this._children.indexOf(child);
    if (index > -1) {
      this._children.splice(index, 1);
      this.notifyChildrenChange();
    }
  }

  private notifyChildrenChange() {
    this.childrenVersion.update(version => version + 1);
  }
}
