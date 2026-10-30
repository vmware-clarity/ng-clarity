/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { afterNextRender, booleanAttribute, Directive, inject, Injector, Input } from '@angular/core';

import { DatagridTreeRenderer, FocusedCell } from './datagrid-tree-renderer';
import { ClrDatagridVirtualScrollDirective } from './datagrid-virtual-scroll.directive';
import { ClrDatagridTreeChildrenFunction } from './interfaces/tree-children-function.interface';

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
 */
@Directive({
  selector: '[ClrVirtualScroll][clrVirtualTreeOf],[clrVirtualScroll][clrVirtualTreeOf]',
  standalone: false,
})
export class ClrDatagridVirtualTree<T> extends DatagridTreeRenderer<T> {
  @Input('clrVirtualTreeOf') roots: T[];
  @Input('clrVirtualTreeGetChildren') getChildren: ClrDatagridTreeChildrenFunction<T>;
  /** Like `clrDgTreeItemsCascadeSelection`. */
  @Input({ alias: 'clrVirtualTreeCascadeSelection', transform: booleanAttribute }) cascadeSelection = false;

  private virtualScroll = inject<ClrDatagridVirtualScrollDirective<T>>(ClrDatagridVirtualScrollDirective);
  private injector = inject(Injector);
  /** The rows rendered last, to find where the focused or top row was. */
  private shownItems: T[] = [];
  private frame: number | undefined;

  override ngOnDestroy() {
    super.ngOnDestroy();
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
