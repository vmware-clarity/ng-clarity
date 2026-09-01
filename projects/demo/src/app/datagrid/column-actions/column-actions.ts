/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrDatagridSortOrder } from '@clr/angular';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

@Component({
  selector: 'clr-datagrid-column-actions-demo',
  providers: [Inventory],
  templateUrl: 'column-actions.html',
  styleUrls: ['../datagrid.demo.scss'],
  standalone: false,
})
export class DatagridColumnActionsDemo {
  users: User[];

  pinId = false;
  pinName = false;

  // Both the title button and the menu report through clrDgSortOrderChange, which is how the two
  // paths can be checked against each other.
  lastSort = 'none';

  exported: string[] = [];

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }

  reportSort(column: string, order: ClrDatagridSortOrder) {
    this.lastSort = `${column}: ${ClrDatagridSortOrder[order]}`;
  }

  export(column: string) {
    this.exported = [...this.exported, column];
  }
}
