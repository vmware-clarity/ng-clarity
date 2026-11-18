/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * A row of a tree datagrid, with its place in the tree. Nodes are kept by the identity of their
 * item across refreshes and pages, so their state outlives the objects that come from the server.
 */
export class DatagridTreeNode<T> {
  expanded = false;
  /** `null` until the children are fetched, and again once they are reloaded. */
  children: DatagridTreeNode<T>[] | null = null;
  /** Position among its siblings on display, 0-based. */
  index = 0;
  /** `false` when the row says with `[clrDgTreeExpandable]` that it has no children. */
  mayHaveChildren = true;
  /** The request for the children in flight, if any. A result is applied only for this request. */
  request: object | null = null;
  /** The row says with `[clrDgSelectable]="false"` that it can't be selected; kept while it is hidden. */
  locked = false;
  /** Expanded or collapsed by expand all or collapse all while its row was not shown: not reported yet. */
  unseen = false;
  /** Selected along with its parent before its row said whether it can be selected. */
  selectedWithParent = false;

  constructor(
    public item: T,
    public parent: DatagridTreeNode<T> | null,
    public level: number
  ) {}

  get loading(): boolean {
    return this.request !== null;
  }

  /** Children that came back empty make a leaf. */
  get expandable(): boolean {
    return this.mayHaveChildren && this.children?.length !== 0;
  }

  /** The node and its loaded descendants, depth-first. */
  descendants(): DatagridTreeNode<T>[] {
    return [this, ...(this.children || []).flatMap(child => child.descendants())];
  }
}
