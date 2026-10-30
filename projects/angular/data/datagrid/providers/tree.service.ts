/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, NgZone, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import {
  animationFrameScheduler,
  asapScheduler,
  BehaviorSubject,
  from,
  isObservable,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import {
  auditTime,
  buffer,
  catchError,
  defaultIfEmpty,
  filter,
  map,
  mergeMap,
  share,
  take,
  takeUntil,
} from 'rxjs/operators';

import { Items } from './items';
import { Page } from './page';
import { Selection } from './selection';
import { Sort } from './sort';
import { cascadeSelection, DatagridTreeNode, descendants, flatten, indeterminateNodes } from './tree-node.model';
import { SelectionType } from '../enums/selection-type';
import { ColumnState } from '../interfaces/column-state.interface';
import { ClrDatagridTreeChildrenFunction } from '../interfaces/tree-children-function.interface';

type TreeChildren<T> = T[] | null | undefined;

/** A request for the children of a node. */
interface ChildrenRequest<T> {
  node: DatagridTreeNode<T>;
  children: Observable<TreeChildren<T>>;
}

/** The first children a loader returns, or `null` when it fails or ends without any. */
function firstChildren<T>(children: Observable<TreeChildren<T>>): Observable<T[] | null> {
  return children.pipe(
    take(1),
    map(value => value || []),
    defaultIfEmpty(null),
    catchError(() => of(null))
  );
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
  /** Whether the datagrid renders a tree, while a tree directive is in it. */
  readonly enabled = signal(false);
  getChildren: ClrDatagridTreeChildrenFunction<T>;
  /** Selecting a row also selects its loaded descendants, in multi-selection. */
  cascadeSelection = false;
  /** The columns marked with `clrDgTreeToggle`, which carry the toggle; the first column when none is. */
  readonly toggleColumns = new Set<BehaviorSubject<ColumnState>>();
  /** Rows expanded or collapsed, by the user or because their children came back empty or failed. */
  readonly expandedChange = new Subject<{ item: T; expanded: boolean }>();

  private roots: DatagridTreeNode<T>[] = [];
  /**
   * Every node by the identity of its item, also those of rows on other pages and of children
   * whose parent was reloaded, so open rows and fetched children come back with their rows.
   */
  private nodes = new Map<any, DatagridTreeNode<T>>();
  /**
   * Set by `expandAll()`, so rows that come in later (children as they load, other pages)
   * come in expanded too, like in the tree view. Cleared as soon as a row is collapsed.
   */
  private allExpanded = false;
  private _change = new Subject<T[]>();
  private requests = new Subject<ChildrenRequest<T>>();
  private cancelled = new Subject<object>();
  private subscriptions: Subscription[] = [];
  /** The indeterminate rows, for the selection they were found for. */
  private indeterminate: { selection: T[]; nodes: Set<DatagridTreeNode<T>> } | null = null;
  private zone = inject(NgZone);
  private inBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(
    private items: Items<T>,
    private sort: Sort<T>,
    private selection: Selection<T>,
    private page: Page
  ) {
    const results = this.requests.pipe(
      mergeMap(request =>
        firstChildren(request.children).pipe(
          map(children => ({ request, children })),
          takeUntil(this.cancelled.pipe(filter(cancelled => cancelled === request)))
        )
      ),
      share()
    );
    // In the browser, the results that come in during the same frame are applied together, inside
    // Angular, so the rows are rendered and checked once rather than once per result. On the server
    // they are applied as they come, so rendering waits for them.
    const frame = results.pipe(auditTime(0, this.inBrowser ? animationFrameScheduler : asapScheduler));
    this.subscriptions.push(
      sort.change.subscribe(() => this.update()),
      results.pipe(buffer(frame)).subscribe(batch =>
        this.zone.run(() => {
          batch.forEach(({ request, children }) => this.applyResult(request, children));
          this.update();
        })
      )
    );
  }

  get change(): Observable<T[]> {
    return this._change.asObservable();
  }

  /**
   * With `cascadeSelection`, multi-selection works like in the tree view: a row's selection reaches
   * all of its loaded descendants, and a parent is selected when all of its children are.
   */
  get cascading(): boolean {
    return this.enabled() && this.cascadeSelection && this.selection.selectionType === SelectionType.Multi;
  }

  /**
   * Applies the inputs of the directive that renders the tree, all at once, so the roots are built
   * with the final loader.
   */
  configure(roots: T[], getChildren: ClrDatagridTreeChildrenFunction<T>, cascadeSelection: boolean) {
    const cascaded = this.cascading;
    this.getChildren = getChildren;
    this.cascadeSelection = !!cascadeSelection;
    this.setRoots(roots);
    // Rows selected on their own until now take their descendants along, and their ancestors settle.
    if (this.cascading && !cascaded && this.selection.current?.length) {
      this.setSelected(this.selection.current || [], true);
    }
  }

  setRoots(items: T[]) {
    const previous = this.roots;
    this.roots = this.toNodes(items || [], null);
    this.loadOpen(this.roots);
    const kept = new Set(this.roots);
    previous
      .filter(root => !kept.has(root))
      .forEach(root => {
        // Requests for rows that are gone are of no use anymore; open rows fetch again when back.
        descendants(root).forEach(node => this.cancel(node));
        if (!root.expanded && !root.children) {
          this.nodes.delete(this.identify(root.item));
        }
      });
    this.update();
  }

  identify(item: T): any {
    return this.items.identifyBy(item);
  }

  /** The node of `item`, also when its row is on another page or a reload of its parent took it away. */
  nodeFor(item: T): DatagridTreeNode<T> | undefined {
    return this.nodes.get(this.identify(item));
  }

  /** Expands or collapses the row of `node`, and reports it unless the app itself asked for it. */
  setExpanded(node: DatagridTreeNode<T>, expanded: boolean, report = true) {
    if (!node.expandable || node.expanded === expanded) {
      return;
    }
    if (expanded) {
      this.expand(node, report);
    } else {
      this.allExpanded = false;
      this.collapse(node, report);
    }
    this.update();
  }

  /**
   * Called by a row once all its inputs are set, with what they say about its item: whether it can
   * have children, whether it can be selected, and whether it is expanded, when that input changed.
   * A row the virtual scroll reuses gets its new item before its other inputs, which still hold the
   * values of the previous item, so the row waits for all of them.
   */
  rowDeclared(item: T, { expandable, locked, expanded }: { expandable: boolean; locked: boolean; expanded?: boolean }) {
    const node = this.nodeFor(item);
    if (!node) {
      return;
    }
    node.locked = locked;
    this.setExpandable(node, expandable);
    if (expanded !== undefined) {
      this.setExpanded(node, expanded, false);
    }
    this.unselectIfLocked(node);
    // An open row without its children fetches them once it is shown, now that it has said whether
    // it can have any: expand all opened it while it was hidden, or its request was cancelled when
    // it went to another page.
    if (node.expanded && !node.children && !node.loading) {
      this.load(node);
      // A loader that returns or fails right away changes the rows on display.
      if (!node.loading) {
        this.update();
      }
    }
  }

  /**
   * Expands every row. Rows that come in later (children as they load, other pages) come in
   * expanded too, until a row is collapsed. Only the rows in `rendered` are reported and fetch their
   * children now; the others fetch them once their row is rendered.
   */
  expandAll(rendered: T[]) {
    this.allExpanded = true;
    const shown = new Set(rendered.map(item => this.identify(item)));
    this.treeNodes()
      .filter(node => node.expandable && !node.expanded)
      .forEach(node => {
        if (shown.has(this.identify(node.item))) {
          this.expand(node);
        } else {
          node.expanded = node.unseen = true;
        }
      });
    this.update();
  }

  /** Collapses every row, also those on other pages. */
  collapseAll() {
    this.allExpanded = false;
    this.treeNodes().forEach(node => this.collapse(node));
    this.nodes.forEach(node => (node.expanded = node.unseen = false));
    this.update();
  }

  /**
   * Forgets the loaded children of `item`, or of the whole tree, so they are fetched again the next
   * time they are needed. Open rows fetch right away, from the top, so rows under a collapsed
   * parent wait until the parent is opened.
   */
  reload(item?: T) {
    if (item === undefined) {
      // Children of rows on other pages are stale too.
      this.nodes.forEach(node => this.forget(node));
      this.roots.filter(root => root.expanded).forEach(root => this.load(root));
    } else {
      const node = this.nodeFor(item);
      if (node) {
        this.forget(node);
        // A row on another page fetches when it comes back.
        if (node.expanded && this.treeNodes().includes(node)) {
          this.load(node);
        }
      }
    }
    this.update();
  }

  /**
   * Selects or deselects `items` with all their loaded descendants, then settles their ancestors:
   * a parent is selected only when all of its children are.
   */
  setSelected(items: T[], selected: boolean) {
    const selection = new Map((this.selection.current || []).map(item => [this.identify(item), item]));
    const nodes = items.map(item => this.nodeFor(item)).filter(Boolean);
    cascadeSelection(selection, nodes, selected, item => this.identify(item));
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

  /**
   * The position of a row among its siblings, for `aria-posinset` and `aria-setsize`. Roots count
   * across pages, so screen readers hear "3 of 23", not "3 of 10". Read on every check, as the total
   * comes in after the roots.
   */
  posInSet(node: DatagridTreeNode<T>): number {
    // `firstItem` is -1 without pagination.
    return node.parent ? node.index + 1 : Math.max(this.page.firstItem, 0) + node.index + 1;
  }

  setSize(node: DatagridTreeNode<T>): number {
    // `totalItems` is 0 until the server says how many roots there are.
    return node.parent ? node.parent.children.length : Math.max(this.page.totalItems, this.roots.length);
  }

  isIndeterminate(item: T): boolean {
    if (this.indeterminate?.selection !== this.selection.current) {
      const selected = new Set((this.selection.current || []).map(selectedItem => this.identify(selectedItem)));
      this.indeterminate = {
        selection: this.selection.current,
        nodes: indeterminateNodes(this.roots, node => selected.has(this.identify(node.item))),
      };
    }
    return this.indeterminate.nodes.has(this.nodeFor(item));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this._change.complete();
    this.expandedChange.complete();
  }

  /**
   * An item that was selected along with its parent but can't be selected leaves the selection,
   * after the check in progress.
   */
  private unselectIfLocked(node: DatagridTreeNode<T>) {
    if (!node.selectedWithParent) {
      return;
    }
    node.selectedWithParent = false;
    if (node.locked) {
      const ref = this.identify(node.item);
      queueMicrotask(() => {
        this.selection.current = (this.selection.current || []).filter(selected => this.identify(selected) !== ref);
      });
    }
  }

  /**
   * Says whether the row of `node` can be expanded. One that can still stops offering the toggle
   * when its children come back empty.
   */
  private setExpandable(node: DatagridTreeNode<T>, expandable: boolean) {
    if (node.mayHaveChildren === expandable) {
      return;
    }
    node.mayHaveChildren = expandable;
    if (!node.expandable && node.expanded) {
      this.collapse(node);
      // A row expand all opened says it has no children: there are no rows to take away.
      if (node.children?.length) {
        this.update();
      }
    }
  }

  private toNodes(items: T[], parent: DatagridTreeNode<T> | null): DatagridTreeNode<T>[] {
    const level = parent ? parent.level + 1 : 1;
    return items.map(item => {
      const ref = this.identify(item);
      const node = this.nodes.get(ref) || new DatagridTreeNode(item, parent, level);
      // The item can be a new object for the same row.
      node.item = item;
      node.parent = parent;
      node.level = level;
      this.nodes.set(ref, node);
      if (this.allExpanded && node.expandable && !node.expanded) {
        node.expanded = node.unseen = true;
      }
      return node;
    });
  }

  /**
   * Fetches the children of the open rows among `nodes`, once they are in the tree: a loader that
   * returns right away settles the selection of their ancestors.
   */
  private loadOpen(nodes: DatagridTreeNode<T>[]) {
    nodes.filter(node => node.expanded && !node.children && !node.unseen).forEach(node => this.load(node));
  }

  /** The nodes of the current roots and their loaded descendants. */
  private treeNodes(): DatagridTreeNode<T>[] {
    return this.roots.flatMap(root => descendants(root));
  }

  private cancel(node: DatagridTreeNode<T>) {
    if (node.request) {
      this.cancelled.next(node.request);
      node.request = null;
    }
  }

  /**
   * Drops the loaded descendants of `node`, and their requests in flight. Their nodes stay, so they
   * come back open if they were.
   */
  private forget(node: DatagridTreeNode<T>) {
    descendants(node).forEach(descendant => {
      this.cancel(descendant);
      descendant.children = null;
    });
  }

  /** Asks the loader for the children of `node`: an array is set right away, the rest is awaited. */
  private load(node: DatagridTreeNode<T>) {
    if (node.loading) {
      return;
    }
    let children: ReturnType<ClrDatagridTreeChildrenFunction<T>>;
    try {
      children = this.getChildren ? this.outsideAngular(() => this.getChildren(node.item)) : null;
    } catch {
      // A loader that throws fails like a request that fails.
      this.collapse(node);
      return;
    }
    if (isObservable(children) || typeof (children as PromiseLike<unknown>)?.then === 'function') {
      const request = { node, children: from(children as Observable<TreeChildren<T>>) };
      node.request = request;
      this.outsideAngular(() => this.requests.next(request));
    } else {
      this.setChildren(node, children as TreeChildren<T>);
    }
  }

  /**
   * Loaders run outside Angular in the browser, so that they and their results don't run change
   * detection on their own: the results are applied together.
   */
  private outsideAngular<R>(fn: () => R): R {
    return this.inBrowser ? this.zone.runOutsideAngular(fn) : fn();
  }

  /**
   * Sets the children a loader returned. A failed request closes the row again, so it can be
   * retried by opening it; the app hears of the error from its own loader. A result that came in
   * before its request was cancelled, in the same frame, is dropped.
   */
  private applyResult(request: ChildrenRequest<T>, children: T[] | null) {
    const node = request.node;
    if (node.request !== request) {
      return;
    }
    node.request = null;
    if (children) {
      this.setChildren(node, children);
    } else {
      this.collapse(node);
    }
  }

  private setChildren(node: DatagridTreeNode<T>, children: TreeChildren<T>) {
    node.children = this.toNodes([...(children || [])], node);
    this.loadOpen(node.children);
    // Children of a selected parent come in selected. Their rows haven't said yet whether they can
    // be selected, so the ones that can't are taken out again once they are rendered.
    if (this.cascading && node.children.length && this.selection.isSelected(node.item)) {
      const unselected = descendants(node).filter(descendant => !this.selection.isSelected(descendant.item));
      this.setSelected([node.item], true);
      unselected.forEach(descendant => (descendant.selectedWithParent = this.selection.isSelected(descendant.item)));
    }
    // An item that turned out to have no children is no longer offered as expandable.
    if (!node.children.length) {
      this.collapse(node);
    }
  }

  private expand(node: DatagridTreeNode<T>, report = true) {
    node.expanded = true;
    node.unseen = false;
    // Before loading, as a loader that returns or fails right away collapses the row again.
    if (report) {
      this.expandedChange.next({ item: node.item, expanded: true });
    }
    if (!node.children) {
      this.load(node);
    }
  }

  // A row nobody heard open is not reported closed either.
  private collapse(node: DatagridTreeNode<T>, report = !node.unseen) {
    if (!node.expanded) {
      return;
    }
    node.expanded = false;
    node.unseen = false;
    if (report) {
      this.expandedChange.next({ item: node.item, expanded: false });
    }
  }

  private update() {
    const visible = flatten(this.roots, this.sort.comparator ? (a, b) => this.sort.compare(a, b) : null);
    // The tree changed under the selection.
    this.indeterminate = null;
    this._change.next(visible);
  }
}
