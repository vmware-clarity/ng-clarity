/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

@Component({
  providers: [Inventory],
  templateUrl: 'detail.html',
  styleUrls: ['../datagrid.demo.scss'],
})
export class DatagridDetailDemo implements AfterViewInit {
  users: User[];
  selection: User[] = [];
  singleSelection: User;
  state: any = null;
  preState: any = null;
  stateEvent: any = null;

  constructor(inventory: Inventory, private cdr: ChangeDetectorRef) {
    inventory.size = 103;
    inventory.reset();
    this.users = inventory.all;
  }

  ngAfterViewInit() {
    // We must set it here, or the extra columns are not removed on initialization
    this.preState = this.users[0];
    this.cdr.detectChanges();
  }
}
