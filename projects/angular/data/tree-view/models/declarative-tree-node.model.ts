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

  // A signal, so that the parent node is refreshed when a child node is added or removed after it was checked.
  private readonly _children = signal<DeclarativeTreeNodeModel<T>[]>([]);

  constructor(parent: DeclarativeTreeNodeModel<T> | null) {
    super();
    this.parent = parent;
    if (parent) {
      parent._addChild(this);
    }
  }

  get children(): DeclarativeTreeNodeModel<T>[] {
    return this._children();
  }
  set children(value: DeclarativeTreeNodeModel<T>[]) {
    this._children.set(value);
  }

  override destroy() {
    if (this.parent) {
      this.parent._removeChild(this);
    }
    super.destroy();
  }

  _addChild(child: DeclarativeTreeNodeModel<T>) {
    this._children.update(children => [...children, child]);
  }

  _removeChild(child: DeclarativeTreeNodeModel<T>) {
    this._children.update(children => children.filter(existing => existing !== child));
  }
}
