/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { Inventory } from '../datagrid/inventory/inventory';
import { User } from '../datagrid/inventory/user';

@Component({
  selector: 'clr-modal-tabs-angular',
  styleUrls: ['./tabs.demo.scss'],
  providers: [Inventory],
  templateUrl: './tabs-angular.demo.html',
})
export class TabsAngularDemo {
  layout = 'vertical';
  inOverflow = false;

  users: User[];

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}
