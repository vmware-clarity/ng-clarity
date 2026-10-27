/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrCheckboxModule, ClrDatagridModule } from '@clr/angular';

import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';

@Component({
  selector: 'clr-datagrid-select-all-disabled-example',
  templateUrl: './select-all-disabled.example.html',
  styleUrl: './select-all-disabled.example.scss',
  providers: [Inventory],
  imports: [DatePipe, FormsModule, ClrCheckboxModule, ClrDatagridModule],
})
export class DatagridSelectAllDisabledExample {
  users: User[];
  selected: User[] = [];
  selectAllDisabled = false;

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}
