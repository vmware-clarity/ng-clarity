/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
  standalone: false,
})
export class DatagridDetailDemo implements AfterViewInit {
  users: User[];
  selection: User[] = [];
  singleSelection: User;
  state: any = null;
  stateEvent: any = null;
  private _preState: any = null;

  constructor(inventory: Inventory, private cdr: ChangeDetectorRef) {
    inventory.size = 103;
    inventory.reset();
    this.users = inventory.all;
  }

  get preState() {
    return this._preState;
  }
  set preState(value: any) {
    this._preState = value;
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    // We must set it here, or the extra columns are not removed on initialization
    this.preState = this.users[0];
  }
}
