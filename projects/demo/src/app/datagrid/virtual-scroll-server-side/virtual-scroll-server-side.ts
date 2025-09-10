/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ListRange } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ClrDatagridItemsTrackByFunction, ClrDatagridStateInterface } from '@clr/angular';
import { Observable } from 'rxjs';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { ColorFilter } from '../utils/color-filter';

@Component({
  selector: 'clr-datagrid-virtual-scroll-server-side-demo',
  providers: [Inventory],
  templateUrl: './virtual-scroll-server-side.html',
  styleUrls: ['../datagrid.demo.scss'],
  standalone: false,
})
export class DatagridVirtualScrollServerSideDemo implements OnInit {
  users: Observable<User[]>;
  currentPageSize = 100;
  _inventory = null;
  loading: boolean;
  loadingMoreItems = false;
  selected: User[] = [];

  constructor(
    inventory: Inventory,
    private cdr: ChangeDetectorRef
  ) {
    this._inventory = inventory;
    this._inventory.size = this.currentPageSize * 3;
    this._inventory.lazyLoadUsers(this._inventory.size);

    this.users = this._inventory.getAllUsersSubject();
  }

  trackItemById: ClrDatagridItemsTrackByFunction<User> = item => item?.id;

  ngOnInit(): void {
    this.users.subscribe(users => {
      // this.selected.push(users[0], users[7]);
      console.log(users[users.length - 1]);

      this.cdr.detectChanges();
    });
  }

  setExpanded($event, user: User) {
    user.expanded = $event;
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

  clrDgActionOverflowOpenChangeFn($event: boolean) {
    console.log('clrDgActionOverflowOpenChange event', $event);
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

  async refresh(state: ClrDatagridStateInterface) {
    const filters: { [key: string]: any[] } = {};
    this.loading = true;

    if (state.filters) {
      for (const filter of state.filters) {
        if (filter instanceof ColorFilter) {
          filters.color = filter.listSelected();
        } else {
          const { property, value } = filter;
          filters[property] = [value];
        }
      }
    }

    const result = await this._inventory
      .filter(filters)
      .sort(state.sort as { by: string; reverse: boolean })
      .fetch();

    this._inventory.getAllUsersSubject().next(result.users);
    this.loading = false;
  }
}
