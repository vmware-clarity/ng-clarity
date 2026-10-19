/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrDatagridFilterInterface, ClrDatagridSortOrder } from '@clr/angular';
import { Subject } from 'rxjs';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

/**
 * A minimal filter to reproduce a bug: reopening the filter through `clrDgFilterOpen` after a menu
 * session (Filter Column, then an outside click) shows nothing, because the popover origin the menu
 * set is torn down along with it.
 */
class NameFilter implements ClrDatagridFilterInterface<User> {
  value = '';
  changes = new Subject<string>();

  isActive(): boolean {
    return !!this.value;
  }

  accepts(user: User): boolean {
    return user.name.toLowerCase().includes(this.value.toLowerCase());
  }
}

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
  copied = 'nothing yet';

  nameFilter = new NameFilter();
  filterOpen = false;

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

  copyColumn(label: string, field: string) {
    this.copied = `${label}: ${this.users.map(user => user[field]).join(', ')}`;
  }
}
