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
  users: User[] = [];

  selectedUsers: User[] = [];
  selectionUsers: User[] = [];
  @ViewChild('datagrid') datagrid: ClrDatagrid;
  private started: boolean;

  constructor(public inventory: Inventory, private cdr: ChangeDetectorRef) {
    // this.users = Array(this.totalRows);
  }

  refresh(state: ClrDatagridStateInterface) {
    console.log('refresh', state);
  }

  renderUserRangeChange($event: ListRange) {
    this.users = this.datagrid.virtualScroll.cdkVirtualForOf as User[];
    console.log($event);
    if (!this.userRange) {
      this.userRange = {
        start: $event.start,
        end: $event.end,
      };
    }

    if (!this.started) {
      console.log(this.userRange);
      // this.started = true;
      this.userRange = {
        start: $event.start,
        end: $event.end > this.totalRows ? this.totalRows : $event.end,
      };

      console.log(this.userRange);
      // this.userRange = $event
      setTimeout(() => {
        // $event.start = Math.floor($event.start / 2);
        const generatedData = this.inventory.addBySize(this.userRange.end - this.userRange.start, this.userRange.start);

        this.userRange.end = this.userRange.start + generatedData.length;
        console.log(generatedData);
        console.log(this.users);

        this.datagrid.virtualScroll.clearItems();
        this.cdr.detectChanges();

        this.datagrid.virtualScroll.updateListRange(this.userRange, generatedData);
        this.cdr.detectChanges();
        this.started = false;
      }, 500);
    } else {
      console.log('ala');
    }
  }

  jumpTo(index: number) {
    this.datagrid.virtualScroll.clearItems();
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
