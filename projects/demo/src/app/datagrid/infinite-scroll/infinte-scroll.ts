/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ListRange } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Observable } from 'rxjs';

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
  loading: boolean;
  readonly data: Observable<{
    users: User[];
    totalResults: number;
    loadedCount: number;
  }>;

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
    console.log('this.loading', this.loading);

    setTimeout(() => {
      this.loading = false;
      this._inventory.size = this._inventory.size + this.currentPageSize;
      this.users = this.users.concat(this._inventory.addBySize(this.currentPageSize));
      console.log('this.users', this.users.length);
      this.cdr.detectChanges();
    }, 1000);

    // this.cdr.detectChanges();
  }

  toggleId() {
    this.deleteIdColumn = !this.deleteIdColumn;
  }

  toggleName() {
    this.hideNameColumn = !this.hideNameColumn;
  }

  renderRangeChange($event: ListRange) {
    console.log($event);
    this.loadMore();
  }
}
