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
  userRange: ListRange;
  totalRows = 10000;
  appendItems = true;
  _users: User[] = [];

  selectedUsers: User[] = [];
  @ViewChild('datagrid') datagrid: ClrDatagrid;

  constructor(public inventory: Inventory, private cdr: ChangeDetectorRef) {
    inventory.size = this.totalRows;
    inventory.latency = 1000;
    inventory.reset();
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

    this.datagrid.virtualScroll.updateItemRange($event.start, result.users);
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
