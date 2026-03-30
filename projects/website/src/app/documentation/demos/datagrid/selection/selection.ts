/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClrAlertModule, ClrDatagridModule } from '@clr/angular';

import { EXAMPLES } from './examples';
import { CodeSnippetComponent } from '../../../../shared/code-snippet/code-snippet.component';
import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';
import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { CommonFiles } from '../utils/stackblitz-common-data';

@Component({
  selector: 'clr-datagrid-selection-demo',
  providers: [Inventory],
  templateUrl: 'selection.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [ClrDatagridModule, StackblitzExampleComponent, ClrAlertModule, CodeSnippetComponent, DatePipe],
})
export class DatagridSelectionDemo {
  commonFiles = CommonFiles;
  examples = EXAMPLES;

  users: User[];
  selected: User[] = [];
  rowSelected: User[] = [];
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

  trackUserItemById(user: User) {
    return user.id;
  }
}
