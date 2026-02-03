/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Directive, EventEmitter, Host, Input, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { DatagridComponent } from '../../datagrid.component';

/**
 * Datagrid page directive which set the page which to be shown when the appfx datagrid is display.
 * Supports  setting of arbitrary grid page as current page and emits the new page
 * number when the page is change.
 * Supports this functionality for server side and client side grids.
 */
@Directive({
  selector: '[datagridPage]',
  standalone: false,
})
export class DatagridPageDirective implements AfterViewInit, OnDestroy {
  @Output() datagridPageChange = new EventEmitter<number>(false);

  private component: DatagridComponent<unknown>;

  private initCompleted = false;
  private initialPage: number;
  private subscription: Subscription;

  constructor(@Host() datagrid: DatagridComponent<unknown>) {
    this.component = datagrid;
  }

  @Input()
  set datagridPage(value: number) {
    if (this.initCompleted) {
      this.component.clrDatagridPagination.currentPage = value;
    } else {
      this.initialPage = value;
    }
  }

  ngAfterViewInit(): void {
    this.subscription = this.component.clrDatagridPagination.currentChanged.subscribe((page: number) =>
      this.datagridPageChange.emit(page)
    );
    if (this.initialPage > 1) {
      if (this.component.serverDrivenDatagrid) {
        this.component.clrDatagridPagination.currentPage = this.initialPage;
      } else {
        // Client side grids work with clarity smart iterators, which initially create all rows, then
        // destroy them and again create them.
        // This I think make the clarity grid to throw ExpressionChangedAfterItHasBeenCheckedError
        // error when this small timout is not set.
        setTimeout(() => {
          this.component.clrDatagridPagination.currentPage = this.initialPage;
        }, 0);
      }
    }
    this.initCompleted = true;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
