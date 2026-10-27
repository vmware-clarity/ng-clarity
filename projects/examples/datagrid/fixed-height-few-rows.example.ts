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
  selector: 'clr-datagrid-fixed-height-few-rows-example',
  templateUrl: './fixed-height-few-rows.example.html',
  styleUrl: './fixed-height-few-rows.example.scss',
  providers: [Inventory],
  imports: [DatePipe, ClrDatagridModule],
})
export class DatagridFixedHeightFewRowsExample {
  users: User[];

  constructor(public inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all.slice(0, 2);
  }
}
