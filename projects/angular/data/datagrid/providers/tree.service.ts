/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, OnDestroy } from '@angular/core';
import { from, isObservable, Observable, Subject, Subscription } from 'rxjs';
import { finalize, take } from 'rxjs/operators';

import { Items } from './items';
import { Page } from './page';
import { Selection } from './selection';
import { Sort } from './sort';
import { SelectionType } from '../enums/selection-type';

/**
 * What selecting a row of a tree selects, in multi-selection:
 * - `self` (default): only the row itself, like any datagrid row.
 * - `descendants`: the row and all of its loaded descendants; a parent is selected when all of its
 *   children are and indeterminate when only some are, like the tree view.
 *
 * Single selection always selects one row, whatever this says.
 */
export type ClrDatagridTreeSelection = 'self' | 'descendants';

export type ClrDatagridTreeChildren<T> = T[] | null | undefined;

/**
 * Fetches the children of `item`. Called when a row is expanded for the first time, and again after
 * `ClrDatagrid.reloadChildren()`. Only the first value of an Observable is used.
 */
export type ClrDatagridTreeChildrenLoader<T> = (
  item: T
) => ClrDatagridTreeChildren<T> | PromiseLike<ClrDatagridTreeChildren<T>> | Observable<ClrDatagridTreeChildren<T>>;

export interface ClrDatagridTreeExpandedChange<T> {
  item: T;
  expanded: boolean;
}

export interface ClrDatagridTreeLoadError<T> {
  item: T;
  error: unknown;
}

export class DatagridTreeNode<T> {
  expanded = false;
  /** Children are being fetched. */
  loading = false;
  /** `null` until the children are fetched for the first time. */
  children: DatagridTreeNode<T>[] | null = null;
  /** Position among its siblings, 1-based, for `aria-posinset`. */
  posInSet = 1;
  setSize = 1;

  constructor(
    public item: T,
    public parent: DatagridTreeNode<T> | null,
    public level: number,
    public expandable: boolean
  ) {}
}

/**
 * Holds the tree behind a tree datagrid and flattens it into the list of rows on display: every
 * root, followed by the descendants of the expanded ones, depth-first.
 *
 * The rest of the datagrid only ever sees that flat list, which is what keeps selection, actions,
 * the detail pane, pagination and pinned columns working unchanged: to them a child row is a row
 * like any other.
 *
 * Rows are told apart by `Items.identifyBy` (`clrDgItemsIdentityFn`), so identities have to be
 * unique across the whole tree, and stable across refreshes for rows to stay open.
 */
@Injectable()
export class DatagridTreeService<T = any> implements OnDestroy {
  enabled = false;
  getChildren: ClrDatagridTreeChildrenLoader<T>;
  /** Whether an item can have children. By default every item can, until it turns out to have none. */
  isExpandable: (item: T) => boolean;
  selects: ClrDatagridTreeSelection = 'self';

  readonly expandedChange = new Subject<ClrDatagridTreeExpandedChange<T>>();
  readonly loadError = new Subject<ClrDatagridTreeLoadError<T>>();

  private roots: DatagridTreeNode<T>[] = [];
  private nodes = new Map<any, DatagridTreeNode<T>>();
  /** Expanded state outlives the nodes, so a new page or a data refresh keeps rows open. */
  private expandedRefs = new Set<any>();
  /** Items whose children came back empty; they stay leaves when the roots are replaced. */
  private leafRefs = new Set<any>();
  /** Child requests in flight, by item. The answer goes to whichever node has the item by then. */
  private loads = new Map<any, Subscription>();
  private _visible: T[] = [];
  private _change = new Subject<T[]>();
  private subscriptions: Subscription[] = [];
  /** Refs of the rows with some, but not all, descendants selected; rebuilt when the selection or the tree changes. */
  private indeterminateRefs = new Set<any>();
  private indeterminateFor: { selection: T[]; tree: T[] } | null = null;

  constructor(
    private items: Items<T>,
    private sort: Sort<T>,
    private selection: Selection<T>,
    private page: Page
  ) {
    this.subscriptions.push(
      sort.change.subscribe(() => this.update()),
      selection.change.subscribe(() => (this.indeterminateFor = null))
    );
  }

  get change(): Observable<T[]> {
    return this._change.asObservable();
  }

  /**
   * With `descendants`, multi-selection works like in the tree view: a row's selection reaches all
   * of its loaded descendants, and a parent is selected when all of its children are.
   */
  get cascadesSelection(): boolean {
    return this.enabled && this.selects === 'descendants' && this.selection.selectionType === SelectionType.Multi;
  }

  /**
   * Applies the inputs of the directive that renders the tree, all at once, so the roots are built
   * with the final loader and predicate.
   */
  configure(
    roots: T[],
    getChildren: ClrDatagridTreeChildrenLoader<T>,
    isExpandable: (item: T) => boolean,
    selects: ClrDatagridTreeSelection
  ) {
    this.getChildren = getChildren;
    this.isExpandable = isExpandable;
    this.selects = selects || 'self';
    this.setRoots(roots);
  }

  setRoots(items: T[]) {
    const previous = this.nodes;
    this.nodes = new Map();
    this.roots = this.adopt(items || [], null, previous);
    // Requests for rows that are gone are of no use anymore.
    this.loads.forEach((load, ref) => {
      if (!this.nodes.has(ref)) {
        load.unsubscribe();
      }
    });
    this.update();
  }

  nodeFor(item: T): DatagridTreeNode<T> | undefined {
    return this.nodes.get(this.items.identifyBy(item));
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
        this.load(node);
      }
    } else {
      this.expandedRefs.delete(ref);
    }
    this.expandedChange.next({ item: node.item, expanded });
    this.update();
  }

  /**
   * Forgets the loaded children of `item`, or of the whole tree, so they are fetched again the next
   * time they are needed. Open rows fetch right away, from the top, so rows under a collapsed
   * parent wait until the parent is opened.
   */
  reload(item?: T) {
    const targets = item ? [this.nodeFor(item)].filter(Boolean) : this.roots;
    targets.forEach(node => {
      this.forget(node);
      if (node.expanded) {
        this.load(node);
      }
    });
    this.update();
  }

  /**
   * Selects or deselects `items` with all their loaded descendants, then settles their ancestors:
   * a parent is selected only when all of its children are.
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
        set(parent, allChildren);
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
    if (this.indeterminateFor?.selection !== this.selection.current || this.indeterminateFor?.tree !== this._visible) {
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
    this._change.complete();
    this.expandedChange.complete();
    this.loadError.complete();
  }

  private adopt(
    items: T[],
    parent: DatagridTreeNode<T> | null,
    previous: Map<any, DatagridTreeNode<T>>
  ): DatagridTreeNode<T>[] {
    const level = parent ? parent.level + 1 : 1;
    return items.map(item => {
      const ref = this.items.identifyBy(item);
      const expandable = !this.leafRefs.has(ref) && (!this.isExpandable || this.isExpandable(item));
      const node = new DatagridTreeNode(item, parent, level, expandable);
      const old = previous.get(ref);
      // A node that was already loaded keeps its children; an expanded one that wasn't fetches them now.
      if (old?.children) {
        node.children = this.adopt(
          old.children.map(child => child.item),
          node,
          previous
        );
      }
      node.expanded = node.expandable && this.expandedRefs.has(ref);
      node.loading = this.loads.has(ref);
      this.nodes.set(ref, node);
      if (node.expanded && !node.children) {
        this.load(node);
      }
      return node;
    });
  }

  /**
   * Drops the loaded descendants of `node`, and their requests in flight.
   */
  private forget(node: DatagridTreeNode<T>) {
    const ref = this.items.identifyBy(node.item);
    this.loads.get(ref)?.unsubscribe();
    node.loading = false;
    node.children?.forEach(child => {
      this.forget(child);
      this.nodes.delete(this.items.identifyBy(child.item));
    });
    node.children = null;
    this.leafRefs.delete(ref);
    node.expandable = !this.isExpandable || this.isExpandable(node.item);
  }

  private load(node: DatagridTreeNode<T>) {
    const ref = this.items.identifyBy(node.item);
    if (this.loads.has(ref)) {
      return;
    }
    const result = this.getChildren ? this.getChildren(node.item) : null;
    if (!isObservable(result) && typeof (result as PromiseLike<unknown>)?.then !== 'function') {
      this.receive(node, result as ClrDatagridTreeChildren<T>);
      return;
    }

    node.loading = true;
    const load = from(result as Observable<ClrDatagridTreeChildren<T>>)
      .pipe(
        take(1),
        finalize(() => this.loads.delete(ref))
      )
      .subscribe({
        next: value => {
          const current = this.nodes.get(ref);
          if (current) {
            this.receive(current, value);
            this.update();
          }
        },
        error: error => this.fail(ref, node.item, error),
      });
    // A loader that answers synchronously is already done.
    if (!load.closed) {
      this.loads.set(ref, load);
    }
  }

  private receive(node: DatagridTreeNode<T>, value: ClrDatagridTreeChildren<T>) {
    node.loading = false;
    node.children = this.adopt(value || [], node, new Map());
    // Children of a selected parent come in selected.
    if (this.cascadesSelection && node.children.length && this.selection.isSelected(node.item)) {
      this.setSelected([node.item], true);
    }
    // An item that turned out to have no children is no longer offered as expandable.
    if (!node.children.length) {
      const ref = this.items.identifyBy(node.item);
      this.leafRefs.add(ref);
      node.expandable = false;
      if (node.expanded) {
        node.expanded = false;
        this.expandedRefs.delete(ref);
        this.expandedChange.next({ item: node.item, expanded: false });
      }
    }
  }

  /**
   * A failed request closes the row again, so it can be retried by opening it, and tells the app.
   */
  private fail(ref: any, item: T, error: unknown) {
    const node = this.nodes.get(ref);
    if (node) {
      node.loading = false;
      if (node.expanded) {
        node.expanded = false;
        this.expandedChange.next({ item: node.item, expanded: false });
      }
    }
    this.expandedRefs.delete(ref);
    this.loadError.next({ item: node?.item ?? item, error });
    this.update();
  }

  private update() {
    const visible: T[] = [];
    const comparator = this.sort.comparator ? (a: T, b: T) => this.sort.compare(a, b) : null;
    const walk = (siblings: DatagridTreeNode<T>[], parent: DatagridTreeNode<T> | null) => {
      // The roots come sorted from the server with the page; only children are sorted here.
      const ordered = comparator && parent ? siblings.slice().sort((a, b) => comparator(a.item, b.item)) : siblings;
      // Roots count across pages, so screen readers hear "3 of 23", not "3 of 10".
      const offset = parent ? 0 : Math.max(this.page.firstItem, 0);
      const size = parent ? ordered.length : Math.max(this.page.totalItems, ordered.length);
      ordered.forEach((node, index) => {
        node.posInSet = offset + index + 1;
        node.setSize = size;
        visible.push(node.item);
        if (node.expanded && node.children) {
          walk(node.children, node);
        }
      });
    };
    walk(this.roots, null);
    this._visible = visible;
    this._change.next(visible);
  }
}
