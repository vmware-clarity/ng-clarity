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
  selector: 'clr-datagrid-pinnable-columns-example',
  templateUrl: './pinnable-columns.example.html',
  styleUrl: './pinnable-columns.example.scss',
  providers: [Inventory],
  imports: [DatePipe, ClrDatagridModule],
})
export class DatagridPinnableColumnsExample {
  users: User[];

  idPinned = false;
  namePinned = false;

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }

  // Kept up to date by clrDgPinnedChange, which the two-way binding above uses under the hood.
  get pinnedColumns(): string {
    return [this.idPinned ? 'User ID' : null, this.namePinned ? 'Name' : null]
      .filter(Boolean)
      .join(', ');
  }
}
