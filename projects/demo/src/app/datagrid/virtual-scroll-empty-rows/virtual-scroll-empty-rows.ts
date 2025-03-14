/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ListRange } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component } from '@angular/core';

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
  users: User[];

  selectedUsers: User[] = [];

  constructor(public inventory: Inventory, private cdr: ChangeDetectorRef) {
    this.users = Array(this.totalRows);
  }

  renderUserRangeChange($event: ListRange) {
    this.userRange = $event;
    console.log($event);
    const generatedData = this.inventory.addBySize(($event.end - $event.start) * 3, $event.start);

    for (let i = 0; i < generatedData.length; i++) {
      this.users[generatedData[i].id] = generatedData[i];
    }

    setTimeout(() => {
      this.users = [...this.users];
      this.cdr.detectChanges();
    }, 2000);
  }

  rowByIndex(index: number) {
    return index;
  }

  getIndexes(rows: any[]) {
    const result = [];

    for (let i = 0; i < rows.length; i++) {
      if (i % 1000 === 0) {
        result.push(i);
      }
    }

    return result;
  }
}
