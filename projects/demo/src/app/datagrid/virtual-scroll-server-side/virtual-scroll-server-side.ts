/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ListRange } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

@Component({
  selector: 'clr-datagrid-virtual-scroll-server-side-demo',
  providers: [Inventory],
  templateUrl: './virtual-scroll-server-side.html',
  styleUrls: ['../datagrid.demo.scss'],
})
export class DatagridVirtualScrollServerSideDemo implements OnInit {
  users: Observable<User[]>;
  currentPageSize = 100;
  _inventory = null;
  loading: boolean;
  loadingMoreItems = false;

  constructor(inventory: Inventory, private cdr: ChangeDetectorRef) {
    this._inventory = inventory;
    this._inventory.size = this.currentPageSize * 3;
    this._inventory.lazyLoadUsers(this._inventory.size);

    this.users = this._inventory.getAllUsersSubject();
  }

  ngOnInit(): void {
    this.users.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  loadMore($event: ListRange) {
    if (this.loadingMoreItems || $event.end + this.currentPageSize < this._inventory.size - this.currentPageSize / 2) {
      return;
    }

    this.loadingMoreItems = true;

    setTimeout(() => {
      this._inventory.size += this.currentPageSize;
      this._inventory.lazyLoadUsers(this.currentPageSize);
      this.loadingMoreItems = false;
      this.cdr.detectChanges();
    }, 2000);
  }

  renderRangeChange($event: ListRange) {
    console.log($event);
    this.loadMore($event);
  }

  refreshPage() {
    this.loadingMoreItems = true;
    this._inventory.all = [];

    setTimeout(() => {
      this._inventory.size = this.currentPageSize * 3;
      this._inventory.lazyLoadUsers(this._inventory.size);
      this.loadingMoreItems = false;

      this.cdr.detectChanges();
    }, 2000);
  }
}
