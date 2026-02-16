/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { EXAMPLES } from './examples';
import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { CommonFiles } from '../utils/stackblitz-common-data';

@Component({
  selector: 'clr-datagrid-selection-single-demo',
  providers: [Inventory],
  templateUrl: 'single-selection.html',
  styleUrl: '../datagrid.demo.scss',
  standalone: false,
})
export class DatagridSelectionSingleDemo {
  commonFiles = CommonFiles;
  examples = EXAMPLES;

  users: User[];
  singleSelected: User | undefined;
  rowSelected: User | undefined;
  lockedUsers: User[] = [];

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;

    this.lockedUsers = [...inventory.all];
  }

  unlockRows() {
    this.lockedUsers = this.lockedUsers.map(row => {
      delete row.locked;
      return row;
    });
  }

  lockRows() {
    this.lockedUsers = this.lockedUsers.map((user, index) => {
      // lock few rows
      if ([2, 3, 5, 9].includes(index)) {
        user.locked = true;
      }
      return user;
    });
  }
}
