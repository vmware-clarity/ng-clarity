/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ListRange } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClrDatagrid, ClrDatagridItemsIdentityFunction, ClrDatagridStateInterface } from '@clr/angular';
import { Observable, Subscription } from 'rxjs';

import { Examples } from './examples';
import { FetchResult, Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { ColorFilter } from '../utils/color-filter';
import { CommonFiles } from '../utils/stackblitz-common-data';

@Component({
  selector: 'clr-datagrid-virtual-scroll-demo',
  providers: [Inventory],
  templateUrl: './virtual-scroll.html',
  styleUrl: '../datagrid.demo.scss',
  standalone: false,
})
export class DatagridVirtualScrollDemo implements OnInit, OnDestroy {
  examples = Examples;
  commonFiles = CommonFiles;

  /* eslint-disable @typescript-eslint/no-var-requires */
  additionalFiles = {
    ...CommonFiles.additionalFiles,
    'utils/color-filter.ts': require('!raw-loader!../utils/color-filter').default,
  };
  /* eslint-enable @typescript-eslint/no-var-requires */

  // server side
  currentPageSize = 100;
  loadingMoreItems = false;

  // client side
  totalRows = 10000;
  loading = false;

  // data driven
  _totalDataDrivenRows = 10000;
  persistItems = false;
  dataDrivenState: ClrDatagridStateInterface | undefined;
  dataRange: {
    total: number;
    skip: number;
    data: User[];
  };

  // other
  userRange: ListRange = {
    start: 0,
    end: 100,
  };
  users: Observable<User[]>;
  loadingMethod = 'server';
  rowSize = 'default';
  selected: User[] = [];
  @ViewChild('datagrid') datagrid: ClrDatagrid | undefined;

  private subscribe: Subscription | undefined;

  constructor(public inventory: Inventory, private cdr: ChangeDetectorRef) {
    // server side at beginning
    this.inventory.size = this.currentPageSize * 3;
    this.inventory.latency = 500;
    this.inventory.lazyLoadUsers(this.inventory.size);
    this.users = this.inventory.getAllUsersSubject().asObservable();

    this.dataRange = {
      total: this.totalDataDrivenRows,
      skip: 0,
      data: [],
    };
  }

  get totalDataDrivenRows() {
    return this._totalDataDrivenRows;
  }

  set totalDataDrivenRows(totalRows) {
    console.log(totalRows);

    this._totalDataDrivenRows = totalRows;
    this.inventory.size = totalRows;
    this.inventory.generatedCount = 0;
    this.inventory.reset(false);
    this.renderUserRangeChange(this.userRange).then(() => {
      // this.cdr.detectChanges();
    });
  }

  trackItemById: ClrDatagridItemsIdentityFunction<User> = (item: User) => item?.id;

  ngOnInit(): void {
    this.subscribe = this.users.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.subscribe?.unsubscribe();
  }

  setExpanded($event: boolean, user: User) {
    user.expanded = $event;
  }

  loadMore($event: ListRange) {
    if (this.loadingMoreItems || $event.end + this.currentPageSize < this.inventory.size - this.currentPageSize / 2) {
      return;
    }

    this.loadingMoreItems = true;

    setTimeout(() => {
      this.inventory.size += this.currentPageSize;
      this.inventory.lazyLoadUsers(this.currentPageSize);
      this.loadingMoreItems = false;
      this.cdr.detectChanges();
    }, 2000);
  }

  renderRangeChange($event: ListRange) {
    if (this.loadingMethod === 'server') {
      this.loadMore($event);
    }
  }

  clrDgActionOverflowOpenChangeFn($event: boolean) {
    console.log('clrDgActionOverflowOpenChange event', $event);
  }

  refreshPage() {
    if (this.loadingMethod === 'data-driven') {
      this.totalDataDrivenRows = this._totalDataDrivenRows;

      return;
    }

    this.loading = true;
    this.inventory.all = [];
    this.inventory.generatedCount = 0;

    // imitate back end call
    setTimeout(() => {
      this.inventory.size = this.loadingMethod === 'server' ? this.currentPageSize * 3 : this.totalRows;

      this.inventory.lazyLoadUsers(this.inventory.size);

      this.loading = false;

      this.cdr.detectChanges();
    }, 2000);
  }

  refresh(state: ClrDatagridStateInterface) {
    const filters: { [key: string]: any[] } = {};
    this.loading = true;

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
        this.inventory.getAllUsersSubject().next(result.users);
        this.loading = false;

        this.cdr.detectChanges();
      });
  }

  async refreshDataDriven(state: ClrDatagridStateInterface<User>) {
    console.log('refreshDataDriven', state);
    this.dataDrivenState = state;
    const filters: { [prop: string]: any[] } = {};

    if (state.filters) {
      for (const filter of state.filters) {
        const { property, value } = filter;
        filters[property] = [value];
      }
    }

    const start = this.userRange.start;

    const result = await this.inventory
      .filter(filters)
      .sort(state.sort as { by: string; reverse: boolean })
      .fetch(start, this.userRange.end - start);

    this.dataRange = {
      total: result.length,
      data: result.users,
      skip: start,
    };

    this.cdr.detectChanges();
  }

  jumpTo(index: number, behaviour: 'auto' | 'smooth' = 'auto') {
    this.datagrid?.virtualScroll.scrollToIndex(index, behaviour);
  }

  scrollDown(offset: number, behaviour: 'auto' | 'smooth' = 'smooth') {
    this.datagrid?.virtualScroll.scrollDown(offset, behaviour);
  }

  scrollUp(offset: number, behaviour: 'auto' | 'smooth' = 'smooth') {
    this.datagrid?.virtualScroll.scrollUp(offset, behaviour);
  }

  rowByIndex(index: number, user: User) {
    return user?.id;
  }

  async renderUserRangeChange($event: ListRange) {
    console.log($event);

    this.userRange = {
      start: $event.start,
      end: $event.end,
    };

    if (this.dataDrivenState?.sort || this.dataDrivenState?.filters) {
      await this.refreshDataDriven(this.dataDrivenState);
    } else {
      await this.getData($event);
    }
  }

  getIndexes(count: number) {
    const result = [];

    for (let i = 0; i < count; i++) {
      if (i % 1000 === 0) {
        result.push(i);
      }
    }

    return result;
  }

  private async getData($event: ListRange) {
    const result = await this.inventory.fetch($event.start, $event.end - $event.start);

    this.dataRange = {
      total: result.length,
      data: result.users,
      skip: $event.start,
    };

    this.cdr.detectChanges();
  }
}
