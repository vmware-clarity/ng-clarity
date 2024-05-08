/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

@Component({
  selector: 'clr-datagrid-resp-footer-demo',
  providers: [Inventory],
  templateUrl: './responsive-footer.html',
  styleUrls: ['../datagrid.demo.scss'],
})
export class DatagridResponsiveFooterDemo {
  users: User[];
  selected: User[] = [];
  static = false;
  compact = false;

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
    this.selected.push(this.users[0]);
  }
}
