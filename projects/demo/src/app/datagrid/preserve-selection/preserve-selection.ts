/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, TrackByFunction } from '@angular/core';
import { ClrDatagridItemsTrackByFunction, ClrDatagridStateInterface } from '@clr/angular';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

@Component({
  selector: 'clr-datagrid-preserve-selection-demo',
  providers: [Inventory],
  templateUrl: 'preserve-selection.html',
  styleUrls: ['../datagrid.demo.scss'],
})
export class DatagridPreserveSelectionDemo {
  users: User[];
  selected: User[] = [];
  clientNoTrackByUsers: User[];
  clientNoTrackBySelected: User[] = [];
  clientTrackByIndexUsers: User[];
  clientTrackByIndexSelected: User[] = [];
  clientTrackByIdUsers: User[];
  clientTrackByIdSelected: User[] = [];
  serverTrackByIdUsers: User[];
  serverTrackByIdSelected: User[] = [];
  total = 100;
  loading = true;

  currentPageSize = 10;
  nameFilter = '';
  nameFilterNoTrackBy: string;
  nameFilterTrackByIndex = '';
  nameFilterTrackById = '';
  nameFilterServerTrackBy = '';
  preserveFilteringNoTrackBy = false;
  preserveFilteringTrackByIndex = false;
  preserveFilteringTrackByIdUsers = false;
  preserveFilteringServerTrackBy = false;

  backUpUsers: User[] = [];

  constructor(private inventory: Inventory) {
    inventory.size = this.total;
    inventory.latency = 500;
    inventory.reset();
    this.users = this.clientNoTrackByUsers = this.clientTrackByIndexUsers = this.clientTrackByIdUsers = inventory.all;
  }

  trackByIndex: TrackByFunction<User> = index => index;
  trackById: TrackByFunction<User> = (_index, item) => item.id;
  trackItemById: ClrDatagridItemsTrackByFunction<User> = item => item.id;

  async refresh(state: ClrDatagridStateInterface) {
    this.loading = true;
    const filters: { [prop: string]: any[] } = {};
    if (state.filters) {
      for (const filter of state.filters) {
        const { property, value } = filter;
        filters[property] = [value];
      }
    }

    const result = await this.inventory
      .filter(filters)
      .sort(state.sort as { by: string; reverse: boolean })
      .fetch(state.page.size * (state.page.current - 1), state.page.size);

    this.serverTrackByIdUsers = result.users;
    this.loading = false;
  }

  updateInventorySize(): void {
    if (this.users.length === 100) {
      this.backUpUsers = this.users.slice();
      this.users = this.backUpUsers.slice(0, 80);
    } else {
      this.users = this.backUpUsers;
      this.backUpUsers = [];
    }
  }
}
