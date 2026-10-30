/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgForOf, NgForOfContext } from '@angular/common';
import {
  booleanAttribute,
  Directive,
  inject,
  Input,
  IterableDiffers,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { DatagridTreeRenderer, FocusedCell } from './datagrid-tree-renderer';
import { ClrDatagridTreeChildrenFunction } from './interfaces/tree-children-function.interface';

/**
 * Renders a tree as datagrid rows: the roots, and below every expanded row its children, indented.
 *
 * ```html
 * <clr-dg-row *clrDgTreeItems="let item of roots; getChildren: getChildren" [clrDgItem]="item" [clrDgExpandable]="item.childCount > 0">
 * ```
 *
 * Like on a tree node, `[clrDgExpandable]` on the row says whether it can be expanded; without it,
 * every row offers the toggle until its children come back empty. `[(clrDgExpanded)]` on the row
 * binds whether it is expanded.
 *
 * The roots are the current page, exactly like the items of a server-driven datagrid: their order
 * and pagination go through `(clrDgRefresh)`, while children are sorted with the column comparator.
 * Children are fetched the first time their parent is expanded, and kept, also while their parent is
 * on another page, until `ClrDatagrid.reloadTreeChildren()`.
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
  @Input('clrDgTreeItemsGetChildren') getChildren: ClrDatagridTreeChildrenFunction<T>;
  /**
   * In multi-selection, selecting a row also selects its loaded descendants, and a parent is
   * selected when all of its children are, like in the tree view. Descendants that are not loaded
   * yet come in selected when they load.
   */
  @Input({ alias: 'clrDgTreeItemsCascadeSelection', transform: booleanAttribute }) cascadeSelection = false;

  private iterableProxy = new NgForOf<T>(
    inject(ViewContainerRef),
    inject<TemplateRef<NgForOfContext<T>>>(TemplateRef),
    inject(IterableDiffers)
  );

  constructor() {
    super();
    // Rows are tracked by the identity of the datagrid, so a refresh that returns new objects keeps
    // the rows, and with them the focus, instead of rendering them again.
    this.iterableProxy.ngForTrackBy = (_index, item) => this.tree.identify(item);
  }

  static ngTemplateContextGuard<T>(_dir: ClrDatagridTreeItems<T>, _ctx: unknown): _ctx is NgForOfContext<T> {
    return true;
  }

  protected render(items: T[], focus: FocusedCell<T> | null, tabStop: T | undefined) {
    this.iterableProxy.ngForOf = items;
    this.iterableProxy.ngDoCheck();
    // The rows of a collapsed subtree go away, so the focus they had goes to the collapsed row.
    if (focus) {
      const target = this.nearestShown(focus.item, items);
      if (target !== undefined && target !== focus.item) {
        this.focus(target);
      }
    } else if (tabStop !== undefined) {
      this.moveTabStop(tabStop, items);
    }
  }
}
