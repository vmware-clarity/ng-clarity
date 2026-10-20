/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgForOf, NgForOfContext } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectorRef,
  Directive,
  inject,
  Injector,
  Input,
  IterableDiffers,
  OnChanges,
  OnDestroy,
  TemplateRef,
  TrackByFunction,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrDatagrid } from './datagrid';
import { ClrDatagridVirtualScrollDirective } from './datagrid-virtual-scroll.directive';
import { ClrDatagridTreeChildrenLoader, ClrDatagridTreeSelection, DatagridTreeService } from './providers/tree.service';

/**
 * The row and the cell that have the focus.
 */
interface FocusedCell<T> {
  item: T;
  /** Among the cells keyboard navigation goes through. */
  cell: number;
}

/**
 * What both tree directives share: they hand their inputs to the tree service and render the flat
 * list of rows it computes, each in its own way.
 */
@Directive()
abstract class DatagridTreeRenderer<T> implements OnChanges, OnDestroy {
  protected tree = inject<DatagridTreeService<T>>(DatagridTreeService);
  protected datagrid = inject<ClrDatagrid<T>>(ClrDatagrid);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private subscription: Subscription;

  abstract roots: T[];
  abstract getChildren: ClrDatagridTreeChildrenLoader<T>;
  abstract expandable: (item: T) => boolean;
  abstract selects: ClrDatagridTreeSelection;

  constructor() {
    this.tree.enabled = true;
    this.subscription = this.tree.change.subscribe(items => {
      this.render(items, this.focusedCell());
      // Children arrive asynchronously and change the toggles of the rows around them, so an OnPush
      // template that declares the rows has to be checked again.
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnChanges() {
    this.tree.configure(this.roots, this.getChildren, this.expandable, this.selects);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.tree.enabled = false;
  }

  /**
   * Where the focus goes when its row is no longer shown, because one of its ancestors was
   * collapsed: to that ancestor.
   */
  protected focusTarget(focus: FocusedCell<T>, items: T[]): T | undefined {
    const shown = new Set(items.map(item => this.tree.identify(item)));
    for (let node = this.tree.nodeFor(focus.item); node; node = node.parent) {
      if (shown.has(this.tree.identify(node.item))) {
        return node.item;
      }
    }
    return undefined;
  }

  /**
   * Focuses a cell of the row of `item`, or its toggle when `cell` is not given. The row has to be
   * rendered.
   */
  protected focus(item: T, cell?: number) {
    const ref = this.tree.identify(item);
    const row = this.datagrid.rows.find(candidate => this.tree.identify(candidate.item) === ref);
    const element = row?.el.nativeElement;
    const target =
      cell === undefined
        ? element?.querySelector<HTMLElement>('.datagrid-tree-toggle')?.closest<HTMLElement>('[role=gridcell]')
        : this.cells(element)[cell];
    if (target) {
      this.datagrid.keyNavigation.setActiveCell(target);
      this.datagrid.keyNavigation.focusElement(target, { preventScroll: true });
    }
  }

  private focusedCell(): FocusedCell<T> | null {
    const active = this.datagrid.el.nativeElement.ownerDocument.activeElement;
    const row = this.datagrid.rows?.find(candidate => candidate.el.nativeElement.contains(active));
    if (!row) {
      return null;
    }
    return { item: row.item, cell: this.cells(row.el.nativeElement).findIndex(cell => cell.contains(active)) };
  }

  private cells(row: HTMLElement | undefined): HTMLElement[] {
    return row ? Array.from(row.querySelectorAll<HTMLElement>(this.datagrid.keyNavigation.config.keyGridCells)) : [];
  }

  /**
   * Renders the rows of `items`. `focus` is where the focus was in the rows before, if anywhere.
   */
  protected abstract render(items: T[], focus: FocusedCell<T> | null): void;
}

/**
 * Renders a tree as datagrid rows: the roots, and below every expanded row its children, indented.
 *
 * ```html
 * <clr-dg-row *clrDgTreeItems="let item of roots; children: getChildren; expandable: hasChildren" [clrDgItem]="item">
 * ```
 *
 * The roots are the current page, exactly like the items of a server-driven datagrid: their order
 * and pagination go through `(clrDgRefresh)`, while children are sorted with the column comparator.
 * Children are fetched the first time their parent is expanded, and kept, also while their parent is
 * on another page, until `ClrDatagrid.reloadChildren()`.
 *
 * Rows are told apart with `[clrDgItemsIdentityFn]`. Give the datagrid one that is unique across the
 * tree and stable across refreshes: without it, a refresh that returns new objects closes every row
 * and drops the loaded children and the selection.
 */
@Directive({
  selector: '[clrDgTreeItems][clrDgTreeItemsOf]',
  standalone: false,
})
export class ClrDatagridTreeItems<T> extends DatagridTreeRenderer<T> {
  @Input('clrDgTreeItemsOf') roots: T[];
  @Input('clrDgTreeItemsChildren') getChildren: ClrDatagridTreeChildrenLoader<T>;
  @Input('clrDgTreeItemsExpandable') expandable: (item: T) => boolean;
  /** What selecting a row selects: the row only (default), or the row with its descendants. */
  @Input('clrDgTreeItemsSelects') selects: ClrDatagridTreeSelection;

  private iterableProxy = new NgForOf<T>(
    inject(ViewContainerRef),
    inject<TemplateRef<NgForOfContext<T>>>(TemplateRef),
    inject(IterableDiffers)
  );

  constructor() {
    super();
    // Rows are tracked by identity by default, so a refresh that returns new objects keeps the rows,
    // and with them the focus, instead of rendering them again.
    this.trackBy = undefined;
  }

  /** Defaults to the identity of the datagrid, `[clrDgItemsIdentityFn]`. */
  @Input('clrDgTreeItemsTrackBy')
  set trackBy(value: TrackByFunction<T> | undefined) {
    this.iterableProxy.ngForTrackBy = value || ((_index, item) => this.tree.identify(item));
  }

  static ngTemplateContextGuard<T>(_dir: ClrDatagridTreeItems<T>, _ctx: unknown): _ctx is NgForOfContext<T> {
    return true;
  }

  protected render(items: T[], focus: FocusedCell<T> | null) {
    this.iterableProxy.ngForOf = items;
    this.iterableProxy.ngDoCheck();
    // The rows of a collapsed subtree go away, so the focus they had goes to the collapsed row.
    const target = focus ? this.focusTarget(focus, items) : undefined;
    if (target !== undefined && target !== focus.item) {
      this.focus(target);
    }
  }
}

/**
 * Renders a tree in a virtual scroll datagrid: the virtual scroll renders the rows of the expanded
 * tree, flattened, as if they were one long list.
 *
 * ```html
 * <ng-template ClrVirtualScroll let-item [clrVirtualTreeOf]="roots" [clrVirtualTreeChildren]="getChildren">
 *   <clr-dg-row [clrDgItem]="item">...</clr-dg-row>
 * </ng-template>
 * ```
 */
@Directive({
  selector: '[ClrVirtualScroll][clrVirtualTreeOf],[clrVirtualScroll][clrVirtualTreeOf]',
  standalone: false,
})
export class ClrDatagridVirtualTree<T> extends DatagridTreeRenderer<T> {
  @Input('clrVirtualTreeOf') roots: T[];
  @Input('clrVirtualTreeChildren') getChildren: ClrDatagridTreeChildrenLoader<T>;
  @Input('clrVirtualTreeExpandable') expandable: (item: T) => boolean;
  @Input('clrVirtualTreeSelects') selects: ClrDatagridTreeSelection;

  private virtualScroll = inject<ClrDatagridVirtualScrollDirective<T>>(ClrDatagridVirtualScrollDirective);
  private injector = inject(Injector);
  private items: T[] = [];

  /**
   * The whole flat list is one data range, so the virtual scroll neither sorts nor pages it.
   *
   * The virtual scroll reuses its rows by position, so rows inserted or removed above the screen
   * would shift what is on it, and the focus would stay on a row that now shows another item. So the
   * focused row when it is on screen, or else the top row, keeps its place, and the focus moves with
   * its item.
   */
  protected render(items: T[], focus: FocusedCell<T> | null) {
    const viewport = this.datagrid.el.nativeElement.querySelector<HTMLElement>('.datagrid-content');
    const itemSize = this.virtualScroll.itemSize;
    const scrollTop = viewport?.scrollTop || 0;
    const first = Math.floor(scrollTop / itemSize);
    const last = Math.floor((scrollTop + (viewport?.clientHeight || 0)) / itemSize) - 1;
    const focused = focus ? this.indexOf(this.items, focus.item) : -1;
    const onScreen = focused >= first && focused <= last;
    const anchor = onScreen ? focus.item : this.items[first];

    this.items = items;
    this.virtualScroll.dataRange = { total: items.length, skip: 0, data: items };

    const target = focus ? this.focusTarget(focus, items) : undefined;
    const anchorAfter = anchor === undefined ? -1 : this.indexOf(items, onScreen ? target : anchor);
    const shift = anchorAfter < 0 ? 0 : anchorAfter - (onScreen ? focused : first);
    if (target !== undefined && this.datagrid.activeCellCoords) {
      const index = this.indexOf(items, target);
      this.datagrid.activeCellCoords = { ...this.datagrid.activeCellCoords, ariaRowIndex: String(index + 1) };
    }
    // After the rows have been rendered with the new data, which also sizes the scrolled content.
    afterNextRender(
      () => {
        if (shift && viewport) {
          viewport.scrollTop += shift * itemSize;
        }
        if (target !== undefined) {
          this.focusWhenRendered(target, target === focus.item ? focus.cell : undefined);
        }
      },
      { injector: this.injector }
    );
  }

  // Scrolling renders the rows it brings on screen on the next frame.
  private focusWhenRendered(item: T, cell: number | undefined, attempts = 3) {
    const ref = this.tree.identify(item);
    if (this.datagrid.rows.some(row => this.tree.identify(row.item) === ref) || !attempts) {
      this.focus(item, cell);
    } else {
      requestAnimationFrame(() => this.focusWhenRendered(item, cell, attempts - 1));
    }
  }

  private indexOf(items: T[], item: T) {
    const ref = this.tree.identify(item);
    return items.findIndex(candidate => this.tree.identify(candidate) === ref);
  }
}
