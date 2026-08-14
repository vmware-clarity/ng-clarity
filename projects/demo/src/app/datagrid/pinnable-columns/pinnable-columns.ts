/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

@Component({
  selector: 'clr-datagrid-pinnable-columns-demo',
  providers: [Inventory],
  templateUrl: 'pinnable-columns.html',
  styleUrls: ['../datagrid.demo.scss'],
  standalone: false,
})
export class DatagridPinnableColumnsDemo {
  users: User[];
  manyUsers: User[];
  selected: User[] = [];

  pinId = true;
  pinName = true;
  pinPokemon = false;
  pinColor = false;

  constructor(inventory: Inventory) {
    inventory.size = 100;
    inventory.reset();
    this.manyUsers = inventory.all;
    this.users = inventory.all.slice(0, 10);
  }
}
