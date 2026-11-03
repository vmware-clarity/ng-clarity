/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ListRange } from '@angular/cdk/collections';
import {
  afterNextRender,
  booleanAttribute,
  Directive,
  EventEmitter,
  inject,
  Injector,
  Input,
  NgZone,
  Output,
} from '@angular/core';
import { combineLatest } from 'rxjs';
import { auditTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

import { DatagridTreeRenderer, FocusedCell } from './datagrid-tree-renderer';
import { ClrDatagridVirtualScrollDirective } from './datagrid-virtual-scroll.directive';
import { ClrDatagridTreeChildrenFunction } from './interfaces/tree-children-function.interface';
import { ClrDatagridVirtualScrollRangeInterface } from './interfaces/virtual-scroll-data-range.interface';

/** How many frames the virtual scroll gets to render a row scrolled to, before focusing it anyway. */
const FRAMES_TO_RENDER = 3;

/**
 * Renders a tree in a virtual scroll datagrid: the virtual scroll renders the rows of the expanded
 * tree, flattened, as if they were one long list.
 *
 * ```html
 * <ng-template ClrVirtualScroll let-item [clrVirtualTreeOf]="roots" [clrVirtualTreeGetChildren]="getChildren">
 *   <clr-dg-row [clrDgItem]="item">...</clr-dg-row>
 * </ng-template>
 * ```
 *
 * The roots can also be loaded by range, like the rows of `clrVirtualDataRange`: the datagrid
 * reports the roots it renders, and the app gives it those it loads.
 *
 * ```html
 * <ng-template
 *   ClrVirtualScroll
 *   let-item
 *   [clrVirtualTreeDataRange]="rootsRange"
 *   [clrVirtualTreeGetChildren]="getChildren"
 *   (clrVirtualTreeRenderedRootsChange)="loadRoots($event)"
 * >
 *   <clr-dg-row [clrDgItem]="item" [clrDgSkeletonLoading]="!item">...</clr-dg-row>
 * </ng-template>
 * ```
 */
@Directive({
  selector:
    '[ClrVirtualScroll][clrVirtualTreeOf],[clrVirtualScroll][clrVirtualTreeOf],' +
    '[ClrVirtualScroll][clrVirtualTreeDataRange],[clrVirtualScroll][clrVirtualTreeDataRange]',
  standalone: false,
})
export class ClrDatagridVirtualTree<T> extends DatagridTreeRenderer<T> {
  @Input('clrVirtualTreeOf') roots: T[];
  @Input('clrVirtualTreeGetChildren') getChildren: ClrDatagridTreeChildrenFunction<T>;
  /** Like `clrDgTreeItemsCascadeSelection`. */
  @Input({ alias: 'clrVirtualTreeCascadeSelection', transform: booleanAttribute }) cascadeSelection = false;

  /**
   * The range of roots the rendered rows belong to, for the app to load those it hasn't yet, when it
   * gives the roots with `clrVirtualTreeDataRange`. The end is excluded.
   */
  @Output('clrVirtualTreeRenderedRootsChange') renderedRootsChange = new EventEmitter<ListRange>();

  private virtualScroll = inject<ClrDatagridVirtualScrollDirective<T>>(ClrDatagridVirtualScrollDirective);
  private injector = inject(Injector);
  private ngZone = inject(NgZone);
  /** The rows rendered last, to find where the focused or top row was. */
  private shownItems: T[] = [];
  private frame: number | undefined;
  private renderedRoots = combineLatest([this.virtualScroll.renderedRangeChange, this.tree.change])
    .pipe(
      // After the check in progress, as the app loads the roots in response.
      auditTime(0),
      map(([range]) => this.rootsOf(range)),
      filter(Boolean),
      distinctUntilChanged((previous, next) => previous.start === next.start && previous.end === next.end)
    )
    // The virtual scroll reports its range outside the Angular zone; the app loads the roots in it, so
    // that their arrival updates the view.
    .subscribe(range => this.ngZone.run(() => this.renderedRootsChange.emit(range)));

  /**
   * The roots loaded by range: `total` roots, of which `data` starts at `skip`. The rows of the roots
   * not loaded yet have no item. The roots loaded before are kept, so the expanded rows above keep
   * their place, until the total changes.
   */
  @Input('clrVirtualTreeDataRange')
  set dataRange(range: ClrDatagridVirtualScrollRangeInterface<T>) {
    if (!range) {
      return;
    }
    const roots = this.roots?.length === range.total ? this.roots : new Array<T>(range.total);
    // A root the range brings to another place has moved, after a sort for instance: it has to be
    // loaded again at its old one.
    const moved = new Set(range.data.map(item => this.tree.identify(item)));
    roots.forEach((root, index) => {
      if (moved.has(this.tree.identify(root))) {
        delete roots[index];
      }
    });
    range.data.forEach((item, index) => (roots[range.skip + index] = item));
    this.roots = roots;
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.renderedRoots.unsubscribe();
    if (this.frame !== undefined) {
      cancelAnimationFrame(this.frame);
    }
  }

  /**
   * The whole flat list is one data range, so the virtual scroll neither sorts nor pages it.
   *
   * The virtual scroll reuses its rows by position, so rows inserted or removed above the screen
   * would shift what is on it, and the focus would stay on a row that now shows another item. So the
   * focused row when it is on screen, or else the top row, keeps its place, and the focus moves with
   * its item.
   */
  protected render(items: T[], focus: FocusedCell<T> | null, tabStop: T | undefined) {
    const viewport = this.datagrid.el.nativeElement.querySelector<HTMLElement>('.datagrid-content');
    const itemSize = this.virtualScroll.itemSize;
    const scrollTop = viewport?.scrollTop || 0;
    const first = Math.floor(scrollTop / itemSize);
    // The last row that is fully on screen.
    const last = Math.floor((scrollTop + (viewport?.clientHeight || 0)) / itemSize) - 1;
    const focused = focus ? this.indexOf(this.shownItems, focus.item) : -1;
    const onScreen = focused >= first && focused <= last;
    const anchor = onScreen ? focus.item : this.shownItems[first];

    this.shownItems = items;
    this.virtualScroll.dataRange = { total: items.length, skip: 0, data: items };
    // New roots arrive in a change detection that has already checked the virtual scroll, so its
    // rows would show them only on the next one.
    this.virtualScroll.ngDoCheck();

    const target = focus ? this.nearestShown(focus.item, items) : undefined;
    // The focused row can be gone with all of its ancestors, after a reload or a new page of roots.
    const kept = onScreen ? target : anchor;
    const anchorAfter = kept === undefined ? -1 : this.indexOf(items, kept);
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
          const same = target === focus.item;
          this.focusWhenRendered(target, same ? focus.cell : undefined, same ? focus.inner : -1);
        } else if (tabStop !== undefined) {
          this.moveTabStop(tabStop, items);
        }
      },
      { injector: this.injector }
    );
  }

  private rootsOf(range: ListRange): ListRange | null {
    const end = Math.min(range.end, this.shownItems.length);
    return range.start < end ? { start: this.rootAt(range.start), end: this.rootAt(end - 1) + 1 } : null;
  }

  /**
   * The place among the roots of the root of the row at `index`. The rows without an item are roots
   * not loaded yet, so they follow the root of the closest row above that has one.
   */
  private rootAt(index: number): number {
    for (let row = index; row >= 0; row--) {
      const item = this.shownItems[row];
      if (item !== undefined) {
        let node = this.tree.nodeFor(item);
        while (node.parent) {
          node = node.parent;
        }
        return node.index + index - row;
      }
    }
    return index;
  }

  // Scrolling renders the rows it brings on screen on the next frame.
  private focusWhenRendered(item: T, cell: number | undefined, inner: number, attempts = FRAMES_TO_RENDER) {
    if (!this.focusInGrid()) {
      return;
    }
    if (this.rowOf(item) || !attempts) {
      this.focus(item, cell, inner);
    } else {
      this.frame = requestAnimationFrame(() => this.focusWhenRendered(item, cell, inner, attempts - 1));
    }
  }
}
