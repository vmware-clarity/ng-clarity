/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgForOf, NgForOfContext } from '@angular/common';
import {
  Directive,
  Input,
  IterableDiffers,
  OnChanges,
  OnDestroy,
  TemplateRef,
  TrackByFunction,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrDatagridVirtualScrollDirective } from './datagrid-virtual-scroll.directive';
import { ClrDatagridTreeChildrenLoader, ClrDatagridTreeSelection, DatagridTreeService } from './providers/tree.service';

/**
 * Renders a tree as datagrid rows: the roots, and below every expanded row its children, indented.
 *
 * ```html
 * <clr-dg-row *clrDgTreeItems="let item of roots; children: getChildren; expandable: hasChildren" [clrDgItem]="item">
 * ```
 *
 * The roots are the current page, exactly like the items of a server-driven datagrid: sorting and
 * pagination go through `(clrDgRefresh)`. Children are fetched the first time their parent is expanded.
 */
@Directive({
  selector: '[clrDgTreeItems][clrDgTreeItemsOf]',
  standalone: false,
})
export class ClrDatagridTreeItems<T> implements OnChanges, OnDestroy {
  @Input('clrDgTreeItemsOf') roots: T[];
  @Input('clrDgTreeItemsChildren') getChildren: ClrDatagridTreeChildrenLoader<T>;
  @Input('clrDgTreeItemsExpandable') expandable: (item: T) => boolean;
  /** What selecting a row selects: the row only (default), or the row with its descendants. */
  @Input('clrDgTreeItemsSelects') selects: ClrDatagridTreeSelection;

  private iterableProxy: NgForOf<T>;
  private subscription: Subscription;

  constructor(
    template: TemplateRef<NgForOfContext<T>>,
    differs: IterableDiffers,
    private tree: DatagridTreeService<T>,
    vcr: ViewContainerRef
  ) {
    tree.enabled = true;
    this.iterableProxy = new NgForOf<T>(vcr, template, differs);
    this.subscription = tree.change.subscribe(items => {
      this.iterableProxy.ngForOf = items;
      this.iterableProxy.ngDoCheck();
    });
  }

  @Input('clrDgTreeItemsTrackBy')
  set trackBy(value: TrackByFunction<T>) {
    this.iterableProxy.ngForTrackBy = value;
  }

  static ngTemplateContextGuard<T>(_dir: ClrDatagridTreeItems<T>, _ctx: unknown): _ctx is NgForOfContext<T> {
    return true;
  }

  ngOnChanges() {
    this.tree.configure(this.roots, this.getChildren, this.expandable, this.selects);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.tree.enabled = false;
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
export class ClrDatagridVirtualTree<T> implements OnChanges, OnDestroy {
  @Input('clrVirtualTreeOf') roots: T[];
  @Input('clrVirtualTreeChildren') getChildren: ClrDatagridTreeChildrenLoader<T>;
  @Input('clrVirtualTreeExpandable') expandable: (item: T) => boolean;
  @Input('clrVirtualTreeSelects') selects: ClrDatagridTreeSelection;

  private subscription: Subscription;

  constructor(
    private tree: DatagridTreeService<T>,
    virtualScroll: ClrDatagridVirtualScrollDirective<T>
  ) {
    tree.enabled = true;
    // The whole flat list is one data range, so the virtual scroll neither sorts nor pages it.
    this.subscription = tree.change.subscribe(items => {
      virtualScroll.dataRange = { total: items.length, skip: 0, data: items };
    });
  }

  ngOnChanges() {
    this.tree.configure(this.roots, this.getChildren, this.expandable, this.selects);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.tree.enabled = false;
  }
}
