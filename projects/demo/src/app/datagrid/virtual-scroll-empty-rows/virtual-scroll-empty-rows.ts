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
  useAPI = true;
  userRange: ListRange;
  _totalRows = 10000;
  persistItems = false;
  _users: User[] = [];

  dataRange: {
    total: number;
    skip: number;
    data: User[];
  };

  selectedUsers: User[] = [];
  @ViewChild('datagrid') datagrid: ClrDatagrid;

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
    this.renderUserRangeChange(this.userRange).then(() => {
      // this.cdr.detectChanges();
    });
  }

  get users() {
    return this._users;
  }

  set users(users) {
    this._users = users;
    this.cdr.detectChanges();
  }

  refresh(state: ClrDatagridStateInterface) {
    console.log('refresh', state);
  }

  async renderUserRangeChange($event: ListRange) {
    console.log($event);

    this.userRange = {
      start: $event.start,
      end: $event.end,
    };

    const result = await this.inventory.fetch($event.start, $event.end - $event.start);

    if (this.useAPI) {
      this.datagrid.virtualScroll.totalItems = result.length;
      this.datagrid.virtualScroll.updateItemRange($event.start, result.users);
    } else {
      this.dataRange = {
        total: result.length,
        data: result.users,
        skip: $event.start,
      };

      this.cdr.detectChanges();
    }
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
}
