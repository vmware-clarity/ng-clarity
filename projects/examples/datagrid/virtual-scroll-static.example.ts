/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ListRange } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrDatagridItemsIdentityFunction,
  ClrDatagridModule,
  ClrDatagridStateInterface,
  ClrNumberInputModule,
  ClrRadioModule,
} from '@clr/angular';

import { FetchResult, Inventory } from './inventory/inventory';
import { User } from './inventory/user';
import { ColorFilter } from './utils/color-filter';

@Component({
  selector: 'clr-datagrid-virtual-scroll-static-example',
  templateUrl: './virtual-scroll-static.example.html',
  styleUrl: './virtual-scroll-static.example.scss',
  providers: [Inventory],
  imports: [
    DatePipe,
    FormsModule,
    ClrDatagridModule,
    ClrNumberInputModule,
    ClrRadioModule,
    ColorFilter,
  ],
})
export class DatagridVirtualScrollStaticExample {
  // server side
  currentPageSize = 100;
  loadingMoreItems = false;

  // client side
  totalRows = 10000;
  loading = false;

  // other
  users: User[];
  loadingMethod = 'server';
  rowSize = 'default';
  selected: User[] = [];

  constructor(
    public inventory: Inventory,
    private cdr: ChangeDetectorRef
  ) {
    // server side at beginning
    inventory.size = this.currentPageSize * 3;
    inventory.lazyLoadUsers(inventory.size);
    this.users = inventory.all;
  }

  trackItemById: ClrDatagridItemsIdentityFunction<User> = (item: User) => item?.id;

  setExpanded($event: boolean, user: User) {
    user.expanded = $event;
  }

  loadMore($event: ListRange) {
    if (
      this.loadingMoreItems ||
      $event.end + this.currentPageSize < this.inventory.size - this.currentPageSize / 2
    ) {
      return;
    }

    this.loadingMoreItems = true;

    setTimeout(() => {
      this.inventory.size += this.currentPageSize;
      this.inventory.lazyLoadUsers(this.currentPageSize);
      this.users = this.inventory.all;
      this.loadingMoreItems = false;
      this.cdr.detectChanges();
    }, 2000);
  }

  renderRangeChange($event: ListRange) {
    if (this.loadingMethod === 'server') {
      this.loadMore($event);
    }
  }

  refreshPage() {
    this.loading = true;
    this.inventory.all = [];
    this.inventory.generatedCount = 0;

    // imitate back end call
    setTimeout(() => {
      this.inventory.size = this.loadingMethod === 'server' ? this.currentPageSize * 3 : this.totalRows;

      this.inventory.lazyLoadUsers(this.inventory.size);
      this.users = this.inventory.all;

      this.loading = false;

      this.cdr.detectChanges();
    }, 2000);
  }

  refresh(state: ClrDatagridStateInterface) {
    const filters: { [key: string]: any[] } = {};
    this.loading = true;
    this.cdr.detectChanges();

    if (state.filters) {
      for (const filter of state.filters) {
        if (filter instanceof ColorFilter) {
          filters.color = filter.listSelected();
        } else {
          const { property, value } = filter;
          filters[property] = [value];
        }
      }
    }

    this.inventory
      .filter(filters)
      .sort(state.sort as { by: string; reverse: boolean })
      .fetch()
      .then((result: FetchResult) => {
        this.users = result.users;
        this.loading = false;

        this.cdr.detectChanges();
      });
  }
}
