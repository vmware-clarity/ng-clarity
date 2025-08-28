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
  selector: 'clr-datagrid-pagination-demo',
  providers: [Inventory],
  templateUrl: 'pagination.html',
  styleUrls: ['../datagrid.demo.scss'],
  standalone: false,
})
export class DatagridPaginationDemo {
  users: User[];
  expanded: false;
  clrDgPageInputDisabled = false;

  constructor(inventory: Inventory) {
    inventory.size = 103;
    inventory.reset();
    this.users = inventory.all;
  }

  pageChange(pageNumber: number) {
    console.log(pageNumber);
  }

  toggleCurrentPageInput() {
    this.clrDgPageInputDisabled = !this.clrDgPageInputDisabled;
  }
}
