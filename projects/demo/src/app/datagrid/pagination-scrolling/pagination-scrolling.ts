/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

@Component({
  selector: 'clr-datagrid-pagination-test-demo',
  providers: [Inventory],
  templateUrl: 'pagination-scrolling.html',
  styleUrls: ['../datagrid.demo.scss'],
})
export class DatagridPaginationScrollingDemo {
  users: User[];

  constructor(inventory: Inventory) {
    inventory.size = 100;
    inventory.reset();
    this.users = inventory.all;
  }
}
