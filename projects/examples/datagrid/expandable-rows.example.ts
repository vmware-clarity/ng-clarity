/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrCheckboxModule,
  ClrCommonFormsModule,
  ClrDatagridModule,
  ClrDatagridStringFilterInterface,
  ClrRadioModule,
} from '@clr/angular';

import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';

class DateFilter implements ClrDatagridStringFilterInterface<User> {
  accepts(user: User, search: string): boolean {
    const date = (user.creation as Date).toDateString();
    return date === search || date.toLowerCase().indexOf(search) >= 0;
  }
}

@Component({
  selector: 'clr-datagrid-expandable-rows-example',
  templateUrl: './expandable-rows.example.html',
  styleUrl: './expandable-rows.example.scss',
  providers: [Inventory],
  imports: [
    DatePipe,
    FormsModule,
    ClrCheckboxModule,
    ClrCommonFormsModule,
    ClrDatagridModule,
    ClrRadioModule,
  ],
})
export class DatagridExpandableRowsExample {
  users: User[];

  detail = 'default';
  replace = false;

  dateFilter = new DateFilter();

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}
