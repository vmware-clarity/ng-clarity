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

import { ClrDatagridTreeChildrenLoader, DatagridTreeService } from './providers/tree.service';

/**
 * Renders a tree as datagrid rows: the roots, and below every expanded row its children, indented.
 *
 * ```html
 * <clr-dg-row *clrDgTreeItems="let item of roots; children: getChildren; expandable: hasChildren" [clrDgItem]="item">
 * ```
 *
 * The roots are the current page, exactly like the items of a server-driven datagrid: sorting and
 * pagination go through `(clrDgRefresh)`. Children are fetched on expand, in chunks when the loader
 * returns them with a `total`.
 */
@Directive({
  selector: '[clrDgTreeItems][clrDgTreeItemsOf]',
  standalone: false,
})
export class ClrDatagridTreeItems<T> implements OnChanges, OnDestroy {
  @Input('clrDgTreeItemsOf') roots: T[];
  @Input('clrDgTreeItemsChildren') getChildren: ClrDatagridTreeChildrenLoader<T>;
  @Input('clrDgTreeItemsExpandable') expandable: (item: T) => boolean;

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

  // Applied together, once every input is set, so the roots are built with the final loader and predicate.
  ngOnChanges() {
    this.tree.getChildren = this.getChildren;
    this.tree.isExpandable = this.expandable;
    this.tree.setRoots(this.roots);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.tree.enabled = false;
  }
}
