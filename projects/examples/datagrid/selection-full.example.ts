/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClrDatagridModule } from '@clr/angular';

import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';

@Component({
  selector: 'clr-datagrid-selection-full-example',
  templateUrl: './selection-full.example.html',
  styleUrl: './selection-full.example.scss',
  providers: [Inventory],
  imports: [DatePipe, ClrDatagridModule],
})
export class DatagridSelectionFullExample {
  users: User[];
  selected: User[] = [];
  lockedUsers: User[] = [];

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;

    this.lockedUsers = [...inventory.all];
  }

  get findLocked() {
    return this.lockedUsers.filter(user => {
      return user.locked;
    });
  }

  selectionChanged(selected: User[]) {
    // The same array as `selected`, emitted every time the selection changes.
    console.log('Selection changed', selected);
  }

  unlockRows() {
    this.lockedUsers = this.lockedUsers.map(row => {
      row.locked = false;
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

  trackUserItemById(user: User) {
    return user.id;
  }
}
