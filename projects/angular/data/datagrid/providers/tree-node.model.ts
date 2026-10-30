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
  /** `false` when the row says with `[clrDgExpandable]` that it has no children. */
  mayHaveChildren = true;
  /** The request for the children in flight, if any. A result is applied only for this request. */
  request: object | null = null;
  /** The row says with `[clrDgSelectable]="false"` that it can't be selected; kept while it is hidden. */
  locked = false;
  /** Expanded by expand all while its row was not shown: not reported yet, and fetches once shown. */
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
}

/** The node and its loaded descendants, depth-first. */
export function descendants<T>(node: DatagridTreeNode<T>): DatagridTreeNode<T>[] {
  return [node, ...(node.children || []).flatMap(child => descendants(child))];
}

/**
 * The items of the rows on display: every root, followed by the descendants of the expanded ones,
 * depth-first. Children are sorted with `compare`; roots keep their order, which is the server's.
 * Numbers every node among its siblings on the way, for `aria-posinset`.
 */
export function flatten<T>(roots: DatagridTreeNode<T>[], compare: ((a: T, b: T) => number) | null): T[] {
  const items: T[] = [];
  const walk = (siblings: DatagridTreeNode<T>[], sorted: boolean) => {
    const ordered = sorted && compare ? siblings.slice().sort((a, b) => compare(a.item, b.item)) : siblings;
    ordered.forEach((node, index) => {
      node.index = index;
      items.push(node.item);
      if (node.expanded && node.children) {
        walk(node.children, true);
      }
    });
  };
  walk(roots, false);
  return items;
}

/**
 * Selects or deselects `nodes` in `selection` with all their loaded descendants, then settles their
 * ancestors: a parent is selected only when all of its children are. Locked items keep their state.
 */
export function cascadeSelection<T>(
  selection: Map<any, T>,
  nodes: DatagridTreeNode<T>[],
  selected: boolean,
  identify: (item: T) => any
) {
  const set = (node: DatagridTreeNode<T>, value: boolean) => {
    if (node.locked) {
      return;
    }
    if (value) {
      selection.set(identify(node.item), node.item);
    } else {
      selection.delete(identify(node.item));
    }
  };
  nodes.forEach(node => {
    descendants(node).forEach(descendant => set(descendant, selected));
    for (let parent = node.parent; parent; parent = parent.parent) {
      set(
        parent,
        parent.children.every(child => selection.has(identify(child.item)) || child.locked)
      );
    }
  });
}

/** The nodes that are not selected themselves but have a selected descendant: indeterminate. */
export function indeterminateNodes<T>(
  roots: DatagridTreeNode<T>[],
  isSelected: (node: DatagridTreeNode<T>) => boolean
): Set<DatagridTreeNode<T>> {
  const partial = new Set<DatagridTreeNode<T>>();
  // Whether the node or any of its descendants is selected.
  const walk = (node: DatagridTreeNode<T>): boolean => {
    const below = (node.children || []).map(walk).some(Boolean);
    if (below && !isSelected(node)) {
      partial.add(node);
    }
    return below || isSelected(node);
  };
  roots.forEach(walk);
  return partial;
}
