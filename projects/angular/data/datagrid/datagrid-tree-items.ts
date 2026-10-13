/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgForOf, NgForOfContext } from '@angular/common';
import {
  ChangeDetectorRef,
  Directive,
  inject,
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
 * What both tree directives share: they hand their inputs to the tree service and render the flat
 * list of rows it computes, each in its own way.
 */
@Directive()
abstract class DatagridTreeRenderer<T> implements OnChanges, OnDestroy {
  protected tree = inject<DatagridTreeService<T>>(DatagridTreeService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private subscription: Subscription;

  abstract roots: T[];
  abstract getChildren: ClrDatagridTreeChildrenLoader<T>;
  abstract expandable: (item: T) => boolean;
  abstract selects: ClrDatagridTreeSelection;

  constructor() {
    this.tree.enabled = true;
    this.subscription = this.tree.change.subscribe(items => {
      this.render(items);
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

  protected abstract render(items: T[]): void;
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
 * Children are fetched the first time their parent is expanded.
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

  @Input('clrDgTreeItemsTrackBy')
  set trackBy(value: TrackByFunction<T>) {
    this.iterableProxy.ngForTrackBy = value;
  }

  static ngTemplateContextGuard<T>(_dir: ClrDatagridTreeItems<T>, _ctx: unknown): _ctx is NgForOfContext<T> {
    return true;
  }

  protected render(items: T[]) {
    this.iterableProxy.ngForOf = items;
    this.iterableProxy.ngDoCheck();
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

  // The whole flat list is one data range, so the virtual scroll neither sorts nor pages it.
  protected render(items: T[]) {
    this.virtualScroll.dataRange = { total: items.length, skip: 0, data: items };
  }
}
