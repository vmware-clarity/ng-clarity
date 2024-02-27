/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component } from '@angular/core';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

@Component({
  selector: 'clr-datagrid-hide-show-demo',
  providers: [Inventory],
  templateUrl: './hide-show.html',
  styleUrls: ['../datagrid.demo.scss'],
})
export class DatagridHideShowDemo {
  users: User[];
  deleteIdColumn = false;
  hideNameColumn = false;
  shortFormat = true;
  conditionalSignpost = true;
  currentPageSize = 35;
  _inventory = null;

  constructor(inventory: Inventory, private cdr: ChangeDetectorRef) {
    this._inventory = inventory;
    this._inventory.size = this.currentPageSize;
    this._inventory.reset();
    this.users = this._inventory.all;
  }

  get idControlMessage() {
    return this.deleteIdColumn ? 'Add User Id Column' : 'Delete User Id Column';
  }

  get nameControlMessage() {
    return this.hideNameColumn ? 'Show Name Column' : 'Hide Name Column';
  }

  loadMore() {
    this._inventory.size = this._inventory.size + this.currentPageSize;
    this.users = this.users.concat(this._inventory.addBySize(this.currentPageSize));
    console.log('this.users', this.users.length);

    // this.cdr.detectChanges();
  }

  toggleId() {
    this.deleteIdColumn = !this.deleteIdColumn;
  }

  toggleName() {
    this.hideNameColumn = !this.hideNameColumn;
  }
}
