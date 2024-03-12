/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component } from '@angular/core';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

@Component({
  selector: 'clr-datagridinfinite-scroll-demo',
  providers: [Inventory],
  templateUrl: './infinite-scroll.html',
  styleUrls: ['../datagrid.demo.scss'],
})
export class DatagridInfinteScrollDemo {
  users: User[];
  deleteIdColumn = false;
  hideNameColumn = false;
  shortFormat = true;
  conditionalSignpost = true;
  currentPageSize = 35;
  _inventory = null;
  loading = true;

  constructor(inventory: Inventory, private cdr: ChangeDetectorRef) {
    this._inventory = inventory;
    this._inventory.size = this.currentPageSize;
    this._inventory.reset();
    this.users = this._inventory.all;
    this.loading = false;
  }

  get idControlMessage() {
    return this.deleteIdColumn ? 'Add User Id Column' : 'Delete User Id Column';
  }

  get nameControlMessage() {
    return this.hideNameColumn ? 'Show Name Column' : 'Hide Name Column';
  }

  loadMore() {
    this.loading = true;
    this._inventory.size = this._inventory.size + this.currentPageSize;
    this.users = this.users.concat(this._inventory.addBySize(this.currentPageSize));
    console.log('this.users', this.users.length);

    setTimeout(() => {
      this.loading = false;
    }, 1000);

    // this.cdr.detectChanges();
  }

  toggleId() {
    this.deleteIdColumn = !this.deleteIdColumn;
  }

  toggleName() {
    this.hideNameColumn = !this.hideNameColumn;
  }
}
