/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ListRange } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ClrDatagrid, ClrDatagridStateInterface } from '@clr/angular';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

@Component({
  selector: 'clr-datagrid-virtual-scroll-empty-rows-demo',
  providers: [Inventory],
  templateUrl: './virtual-scroll-empty-rows.html',
  styleUrls: ['../datagrid.demo.scss'],
})
export class DatagridVirtualScrollEmptyRowsDemo {
  userRange: ListRange = {
    start: 0,
    end: 100,
  };

  _totalRows = 10000;
  persistItems = false;

  dataRange: {
    total: number;
    skip: number;
    data: User[];
  };

  _selectedUsers: User[] = [];
  @ViewChild('datagrid') datagrid: ClrDatagrid;
  state: ClrDatagridStateInterface<User>;

  constructor(public inventory: Inventory, private cdr: ChangeDetectorRef) {
    inventory.size = this.totalRows;
    inventory.latency = 500;
    inventory.reset();

    this.dataRange = {
      total: this.totalRows,
      skip: 0,
      data: [],
    };
  }

  get totalRows() {
    return this._totalRows;
  }

  set totalRows(totalRows) {
    this._totalRows = totalRows;
    this.inventory.size = totalRows;
    this.inventory.generatedCount = 0;
    this.inventory.reset();
    this.renderUserRangeChange(this.userRange).then(x => {
      console.log(x);
      // this.cdr.detectChanges();
    });
  }

  get selectedUsers() {
    return this._selectedUsers;
  }

  set selectedUsers(users) {
    console.log(users);
    this._selectedUsers = users;
    // this.cdr.detectChanges();
  }

  async refresh(state: ClrDatagridStateInterface<User>) {
    console.log('refresh', state);
    this.state = state;
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

  async renderUserRangeChange($event: ListRange) {
    console.log($event);

    this.userRange = {
      start: $event.start,
      end: $event.end,
    };

    if (this.state?.filters || this.state?.sort) {
      await this.refresh(this.state);
    } else {
      this.dataRange = await this.getData($event);
    }

    this.cdr.detectChanges();
  }

  jumpTo(index: number) {
    this.userRange = null;
    this.datagrid.virtualScroll.scrollToIndex(index, 'auto');
  }

  rowByIndex(index: number, user: User) {
    return user?.id;
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

    return {
      total: result.length,
      data: result.users,
      skip: $event.start,
    };
  }
}
