/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectorRef,
  Directive,
  DoCheck,
  inject,
  IterableDiffer,
  IterableDiffers,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrDatagrid } from './datagrid';
import { ClrDatagridRow } from './datagrid-row';
import { ClrDatagridTreeChildrenFunction } from './interfaces/tree-children-function.interface';
import { DatagridTreeService } from './providers/tree.service';
import { getTabbableItems } from './utils/key-navigation-grid.controller';

/**
 * The row and the cell that have the focus.
 */
export interface FocusedCell<T> {
  item: T;
  /** Among the cells keyboard navigation goes through. */
  cell: number;
  /** Among the tabbable elements of the cell, when one of them has the focus rather than the cell. */
  inner: number;
}

/**
 * What both tree directives share: they hand their inputs to the tree service and render the flat
 * list of rows it computes, each in its own way.
 */
@Directive()
export abstract class DatagridTreeRenderer<T> implements OnChanges, DoCheck, OnDestroy {
  protected tree = inject<DatagridTreeService<T>>(DatagridTreeService);
  protected datagrid = inject<ClrDatagrid<T>>(ClrDatagrid);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private differs = inject(IterableDiffers);
  private rootsDiffer: IterableDiffer<T> | undefined;
  private subscription: Subscription;

  abstract roots: T[];
  abstract getChildren: ClrDatagridTreeChildrenFunction<T>;
  abstract cascadeSelection: boolean;

  constructor() {
    this.tree.enabled.set(true);
    this.subscription = this.tree.change.subscribe(items => {
      const focus = this.focusedCell();
      // When the focus is elsewhere, the tab stop of the grid can still be in a row that goes away.
      this.render(items, focus, focus ? undefined : this.tabStopItem());
      // Children arrive asynchronously and change the toggles of the rows around them, so an OnPush
      // template that declares the rows has to be checked again.
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnChanges() {
    this.tree.configure(this.roots, this.getChildren, this.cascadeSelection);
    this.rootsDiffer = this.differs.find([]).create<T>();
    this.rootsDiffer.diff(this.roots || []);
  }

  // Roots pushed, removed or sorted in place are rendered too.
  ngDoCheck() {
    if (this.rootsDiffer?.diff(this.roots || [])) {
      this.tree.setRoots(this.roots);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.tree.enabled.set(false);
  }

  /**
   * The row of `item` if it is in `items`, or else its nearest ancestor that is: where the focus
   * goes when a collapse or a reload takes the row away.
   */
  protected nearestShown(item: T, items: T[]): T | undefined {
    const shown = new Set(items.map(shownItem => this.tree.identify(shownItem)));
    for (let node = this.tree.nodeFor(item); node; node = node.parent) {
      if (shown.has(this.tree.identify(node.item))) {
        return node.item;
      }
    }
    return undefined;
  }

  /**
   * Focuses a cell of the row of `item`, or its toggle when `cell` is not given, and the element of
   * the cell at `inner` if there is one. The row has to be rendered.
   */
  protected focus(item: T, cell?: number, inner = -1) {
    const target = this.cellOf(item, cell);
    if (target) {
      this.datagrid.keyNavigation.setActiveCell(target);
      this.datagrid.keyNavigation.focusElement(target, { preventScroll: true });
      getTabbableItems(target)[inner]?.focus({ preventScroll: true });
    }
  }

  /**
   * When the row of `item`, which had the tab stop of the grid, is no longer shown, gives the tab
   * stop to the toggle cell of the ancestor that is, without focusing it, or else back to the first
   * cell. The rows have to be rendered.
   */
  protected moveTabStop(item: T, items: T[]) {
    const target = this.nearestShown(item, items);
    if (target === item) {
      return;
    }
    const cell = target === undefined ? undefined : this.cellOf(target);
    if (cell) {
      this.datagrid.keyNavigation.setActiveCell(cell);
    } else {
      this.datagrid.keyNavigation.resetKeyGrid();
    }
  }

  /**
   * Whether the focus is still in the grid, or was lost with a row the grid took away: otherwise the
   * user has moved it elsewhere, and it stays there.
   */
  protected focusInGrid() {
    return this.datagrid._focusLost() || !!this.datagrid._focusedElement();
  }

  protected rowOf(item: T): ClrDatagridRow<T> | undefined {
    const ref = this.tree.identify(item);
    return this.datagrid.rows.find(row => this.tree.identify(row.item) === ref);
  }

  protected indexOf(items: T[], item: T) {
    const ref = this.tree.identify(item);
    return items.findIndex(candidate => this.tree.identify(candidate) === ref);
  }

  // The item of the row that has the tab stop of the grid, if a row has it.
  private tabStopItem(): T | undefined {
    const tabStop = this.datagrid.el.nativeElement.querySelector('[role=row][aria-level] [tabindex="0"]');
    return tabStop ? this.datagrid.rows?.find(row => row.el.nativeElement.contains(tabStop))?.item : undefined;
  }

  private focusedCell(): FocusedCell<T> | null {
    const active = this.datagrid._focusedElement();
    const row = active && this.datagrid.rows?.find(candidate => candidate.el.nativeElement.contains(active));
    if (!row) {
      return null;
    }
    const cells = this.cells(row.el.nativeElement);
    const cell = cells.findIndex(candidate => candidate.contains(active));
    return {
      item: row.item,
      cell,
      inner: cell < 0 ? -1 : getTabbableItems(cells[cell]).indexOf(active),
    };
  }

  private cellOf(item: T, cell?: number): HTMLElement | undefined {
    const element = this.rowOf(item)?.el.nativeElement;
    return cell === undefined
      ? element?.querySelector<HTMLElement>('.datagrid-tree-toggle')?.closest<HTMLElement>('[role=gridcell]')
      : this.cells(element)[cell];
  }

  private cells(row: HTMLElement | undefined): HTMLElement[] {
    return row ? Array.from(row.querySelectorAll<HTMLElement>(this.datagrid.keyNavigation.config.keyGridCells)) : [];
  }

  /**
   * Renders the rows of `items`. `focus` is where the focus was in the rows before, if anywhere;
   * otherwise `tabStop` is the item of the row that had the tab stop, if any.
   */
  protected abstract render(items: T[], focus: FocusedCell<T> | null, tabStop: T | undefined): void;
}
