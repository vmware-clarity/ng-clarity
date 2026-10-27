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
import { ColorFilter } from './utils/color-filter-default';

@Component({
  selector: 'clr-datagrid-custom-filter-component-example',
  templateUrl: './custom-filter-component.example.html',
  styleUrl: './custom-filter-component.example.scss',
  providers: [Inventory],
  imports: [DatePipe, ClrDatagridModule, ColorFilter],
})
export class DatagridCustomFilterComponentExample {
  users: User[];

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}
