/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, OnDestroy } from '@angular/core';
import { isObservable, Observable, Subject, Subscription } from 'rxjs';

import { Items } from './items';
import { Selection } from './selection';
import { Sort } from './sort';
import { SelectionType } from '../enums/selection-type';

/**
 * One chunk of children, for parents whose children are fetched page by page. `total` is how many
 * children the parent has in all; while fewer are loaded, the datagrid offers to load more.
 */
export interface ClrDatagridTreeChunk<T> {
  items: T[];
  total: number;
}

/**
 * What selecting a row of a tree selects, in multi-selection:
 * - `self` (default): only the row itself, like any datagrid row.
 * - `descendants`: the row and all of its loaded descendants; a parent is selected when all of its
 *   children are and indeterminate when only some are, like the tree view.
 */
export type ClrDatagridTreeSelection = 'self' | 'descendants';

export type ClrDatagridTreeChildren<T> = T[] | ClrDatagridTreeChunk<T> | null | undefined;

/**
 * Fetches the children of `item`, starting at `skip`. Called when a row is expanded for the first
 * time (with `skip` 0) and again every time more children are requested.
 */
export type ClrDatagridTreeChildrenLoader<T> = (
  item: T,
  skip: number
) => ClrDatagridTreeChildren<T> | Promise<ClrDatagridTreeChildren<T>> | Observable<ClrDatagridTreeChildren<T>>;

export class DatagridTreeNode<T> {
  expanded = false;
  loading = false;
  /** `null` until the children are fetched for the first time. */
  children: DatagridTreeNode<T>[] | null = null;
  /** How many children the parent has in all; equals `children.length` unless they come in chunks. */
  total = 0;
  /** Position among its loaded siblings, 1-based, for `aria-posinset`. */
  posInSet = 1;
  setSize = 1;

  constructor(
    public item: T,
    public parent: DatagridTreeNode<T> | null,
    public level: number,
    public expandable: boolean
  ) {}

  get hasMore(): boolean {
    return !!this.children && this.children.length < this.total;
  }
}

/**
 * Holds the tree behind a tree datagrid and flattens it into the list of rows on display: every
 * root, followed by the descendants of the expanded ones, depth-first.
 *
 * The rest of the datagrid only ever sees that flat list, which is what keeps selection, actions,
 * the detail pane, pagination and pinned columns working unchanged: to them a child row is a row
 * like any other.
 */
@Injectable()
export class DatagridTreeService<T = any> implements OnDestroy {
  enabled = false;
  getChildren: ClrDatagridTreeChildrenLoader<T>;
  /** Whether an item can have children. By default every item can, until it turns out to have none. */
  isExpandable: (item: T) => boolean;
  selects: ClrDatagridTreeSelection = 'self';

  private roots: DatagridTreeNode<T>[] = [];
  private nodes = new Map<any, DatagridTreeNode<T>>();
  /** Expanded state outlives the nodes, so a new page or a data refresh keeps rows open. */
  private expandedRefs = new Set<any>();
  private _visible: T[] = [];
  private _change = new Subject<T[]>();
  private subscriptions: Subscription[] = [];
  private loads = new Map<DatagridTreeNode<T>, Subscription>();
  /** Refs of the rows with some, but not all, descendants selected; rebuilt when the selection or the tree changes. */
  private indeterminateRefs = new Set<any>();
  private indeterminateFor: { selection: T[]; tree: T[] } = { selection: null, tree: null };

  constructor(
    private items: Items<T>,
    private sort: Sort<T>,
    private selection: Selection<T>
  ) {
    this.subscriptions.push(sort.change.subscribe(() => this.update()));
  }

  get change(): Observable<T[]> {
    return this._change.asObservable();
  }

  get visible(): T[] {
    return this._visible;
  }

  /**
   * With `descendants`, multi-selection works like in the tree view: a row's selection reaches all
   * of its loaded descendants, and a parent is selected when all of its children are.
   */
  get cascadesSelection(): boolean {
    return this.enabled && this.selects === 'descendants' && this.selection.selectionType === SelectionType.Multi;
  }

  setRoots(items: T[]) {
    const previous = this.nodes;
    this.nodes = new Map();
    this.roots = this.adopt(items || [], null, previous);
    this.update();
  }

  nodeFor(item: T): DatagridTreeNode<T> | undefined {
    return this.nodes.get(this.items.identifyBy(item));
  }

  toggle(item: T) {
    const node = this.nodeFor(item);
    if (node) {
      this.setExpanded(node, !node.expanded);
    }
  }

  setExpanded(node: DatagridTreeNode<T>, expanded: boolean) {
    if (!node.expandable || node.expanded === expanded) {
      return;
    }
    node.expanded = expanded;
    const ref = this.items.identifyBy(node.item);
    if (expanded) {
      this.expandedRefs.add(ref);
      if (!node.children) {
        this.load(node, 0);
      }
    } else {
      this.expandedRefs.delete(ref);
    }
    this.update();
  }

  loadMore(node: DatagridTreeNode<T>) {
    if (node.hasMore && !node.loading) {
      this.load(node, node.children.length);
    }
  }

  /**
   * Forgets the loaded children of `item`, or of every item, so they are fetched again the next
   * time they are needed. Rows that are open now fetch right away.
   */
  reload(item?: T) {
    const targets = item ? [this.nodeFor(item)].filter(Boolean) : Array.from(this.nodes.values());
    targets.forEach(node => {
      this.loads.get(node)?.unsubscribe();
      this.loads.delete(node);
      node.loading = false;
      node.children = null;
      node.total = 0;
      if (node.expanded) {
        this.load(node, 0);
      }
    });
    this.update();
  }

  /**
   * Selects or deselects `items` with all their loaded descendants, then settles their ancestors:
   * a parent is selected only when all of its children are. A parent with children left to load
   * keeps its selection when its loaded children are all selected, since the rest will inherit it.
   */
  setSelected(items: T[], selected: boolean) {
    const selection = new Map((this.selection.current || []).map(item => [this.items.identifyBy(item), item]));
    const isSelected = (node: DatagridTreeNode<T>) => selection.has(this.items.identifyBy(node.item));
    const set = (node: DatagridTreeNode<T>, value: boolean) => {
      if (this.selection.isLocked(node.item)) {
        return;
      }
      if (value) {
        selection.set(this.items.identifyBy(node.item), node.item);
      } else {
        selection.delete(this.items.identifyBy(node.item));
      }
    };
    const cascade = (node: DatagridTreeNode<T>) => {
      set(node, selected);
      node.children?.forEach(cascade);
    };

    items.forEach(item => {
      const node = this.nodeFor(item);
      if (!node) {
        return;
      }
      cascade(node);
      for (let parent = node.parent; parent; parent = parent.parent) {
        const allChildren = parent.children.every(child => isSelected(child) || this.selection.isLocked(child.item));
        set(parent, allChildren && (!parent.hasMore || isSelected(parent)));
      }
    });
    this.selection.current = Array.from(selection.values());
  }

  /**
   * The header checkbox: selects every row of the page with its loaded descendants, or clears them
   * when all the displayed rows already are.
   */
  toggleAll() {
    this.setSelected(
      this.roots.map(root => root.item),
      !this.selection.isAllSelected()
    );
  }

  isIndeterminate(item: T): boolean {
    if (this.indeterminateFor.selection !== this.selection.current || this.indeterminateFor.tree !== this._visible) {
      this.indeterminateFor = { selection: this.selection.current, tree: this._visible };
      this.indeterminateRefs.clear();
      const selected = new Set((this.selection.current || []).map(selectedItem => this.items.identifyBy(selectedItem)));
      // Whether any descendant is selected; marks the unselected rows that have one on the way.
      const walk = (node: DatagridTreeNode<T>): boolean => {
        let below = false;
        node.children?.forEach(child => {
          below = walk(child) || below;
        });
        const ref = this.items.identifyBy(node.item);
        if (below && !selected.has(ref)) {
          this.indeterminateRefs.add(ref);
        }
        return below || selected.has(ref);
      };
      this.roots.forEach(walk);
    }
    return this.indeterminateRefs.has(this.items.identifyBy(item));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.loads.forEach(sub => sub.unsubscribe());
  }

  private adopt(
    items: T[],
    parent: DatagridTreeNode<T> | null,
    previous: Map<any, DatagridTreeNode<T>>
  ): DatagridTreeNode<T>[] {
    const level = parent ? parent.level + 1 : 1;
    return items.map(item => {
      const ref = this.items.identifyBy(item);
      const node = new DatagridTreeNode(item, parent, level, !this.isExpandable || this.isExpandable(item));
      const old = previous.get(ref);
      // A node that was already loaded keeps its children; an expanded one that wasn't fetches them now.
      if (old?.children) {
        node.children = this.adopt(
          old.children.map(child => child.item),
          node,
          previous
        );
        node.total = old.total;
      }
      node.expanded = node.expandable && this.expandedRefs.has(ref);
      this.nodes.set(ref, node);
      if (node.expanded && !node.children) {
        this.load(node, 0);
      }
      return node;
    });
  }

  private load(node: DatagridTreeNode<T>, skip: number) {
    const result = this.getChildren ? this.getChildren(node.item, skip) : null;
    const source: Observable<ClrDatagridTreeChildren<T>> | null = isObservable(result)
      ? result
      : result instanceof Promise
        ? new Observable(subscriber => {
            result.then(
              value => {
                subscriber.next(value);
                subscriber.complete();
              },
              error => subscriber.error(error)
            );
          })
        : null;

    if (!source) {
      this.receive(node, result as ClrDatagridTreeChildren<T>, skip);
      return;
    }

    node.loading = true;
    this.loads.get(node)?.unsubscribe();
    this.loads.set(
      node,
      source.subscribe({
        next: value => {
          node.loading = false;
          this.receive(node, value, skip);
          this.update();
        },
        error: () => {
          node.loading = false;
          this.update();
        },
      })
    );
  }

  private receive(node: DatagridTreeNode<T>, value: ClrDatagridTreeChildren<T>, skip: number) {
    const chunk = Array.isArray(value) ? value : value?.items || [];
    const total = Array.isArray(value) || !value ? skip + chunk.length : value.total;
    const kept = skip > 0 && node.children ? node.children.slice(0, skip) : [];
    const added = this.adopt(chunk, node, new Map());
    node.children = kept.concat(added);
    node.total = total;
    // Children of a selected parent come in selected.
    if (this.cascadesSelection && added.length && this.selection.isSelected(node.item)) {
      this.setSelected([node.item], true);
    }
    // An item that turned out to have no children is no longer offered as expandable.
    if (node.total === 0) {
      node.expandable = false;
      node.expanded = false;
      this.expandedRefs.delete(this.items.identifyBy(node.item));
    }
  }

  private update() {
    const visible: T[] = [];
    const comparator = this.sort.comparator ? (a: T, b: T) => this.sort.compare(a, b) : null;
    const walk = (siblings: DatagridTreeNode<T>[]) => {
      const ordered = comparator ? siblings.slice().sort((a, b) => comparator(a.item, b.item)) : siblings;
      ordered.forEach((node, index) => {
        node.posInSet = index + 1;
        node.setSize = node.parent ? node.parent.total : ordered.length;
        visible.push(node.item);
        if (node.expanded && node.children) {
          walk(node.children);
        }
      });
    };
    walk(this.roots);
    this._visible = visible;
    this._change.next(visible);
  }
}
