/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, TrackByFunction } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';

import { FetchResult, Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

@Component({
  selector: 'clr-datagrid-selection-demo',
  providers: [Inventory],
  templateUrl: 'selection.html',
  styleUrls: ['../datagrid.demo.scss'],
})
export class DatagridSelectionDemo {
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

  constructor(private inventory: Inventory) {
    this.inventory.size = this.total;
    this.inventory.latency = 500;
    this.inventory.reset();
    this.clientNoTrackByUsers = this.clientTrackByIndexUsers = this.clientTrackByIdUsers = this.inventory.all;
  }

  trackByIndex: TrackByFunction<User> = index => index;
  trackById: TrackByFunction<User> = (_index, item) => item.id;

  refresh(state: ClrDatagridStateInterface) {
    this.loading = true;
    const filters: { [prop: string]: any[] } = {};
    if (state.filters) {
      for (const filter of state.filters) {
        const { property, value } = filter;
        filters[property] = [value];
      }
    }
    this.inventory
      .filter(filters)
      .sort(state.sort as { by: string; reverse: boolean })
      .fetch(state.page.size * (state.page.current - 1), state.page.size)
      .then((result: FetchResult) => {
        this.serverTrackByIdUsers = result.users;
        this.loading = false;
      });
  }
}
