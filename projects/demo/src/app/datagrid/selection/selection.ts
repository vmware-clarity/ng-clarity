/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, TrackByFunction } from '@angular/core';
import { ClrDatagridItemsIdentityFunction, ClrDatagridStateInterface } from '@clr/angular';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

@Component({
  selector: 'clr-datagrid-selection-demo',
  providers: [Inventory],
  templateUrl: 'selection.html',
  styleUrls: ['../datagrid.demo.scss'],
  standalone: false,
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
    inventory.size = this.total;
    inventory.latency = 500;
    inventory.reset();
    this.clientNoTrackByUsers = this.clientTrackByIndexUsers = this.clientTrackByIdUsers = inventory.all;
  }

  ngOnInit() {}

  trackByIndex: TrackByFunction<User> = index => index;
  trackById: TrackByFunction<User> = (_index, item) => item.id;
  identityFn: ClrDatagridItemsIdentityFunction<User> = item => item.id;

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

  selectItems() {
    const selectedUsers = [
      { ...this.clientNoTrackByUsers[1] },
      { ...this.clientNoTrackByUsers[2] },
      { ...this.clientNoTrackByUsers[3] },
    ];
    this.clientNoTrackBySelected.push(...selectedUsers);
    this.clientTrackByIndexSelected = selectedUsers;
    this.clientTrackByIdSelected = selectedUsers;
    this.serverTrackByIdSelected = selectedUsers;
  }
}
