/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, TrackByFunction } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

@Component({
  selector: 'clr-datagrid-selection-single-demo',
  providers: [Inventory],
  templateUrl: 'selection-single.html',
  styleUrls: ['../datagrid.demo.scss'],
  standalone: false,
})
export class DatagridSelectionSingleDemo {
  users: User[];
  singleSelected: User;

  trackByIndexUsers: User[];
  trackByIndexSingleSelected: User;

  trackByIdUsers: User[];
  trackByIdSingleSelected: User;

  trackByIdServerUsers: User[];
  trackByIdServerSingleSelected: User;

  loading = true;
  total: number = 0;

  constructor(private inventory: Inventory) {
    inventory.size = 100;
    inventory.latency = 500;
    inventory.reset();
    this.users = this.trackByIndexUsers = this.trackByIdUsers = inventory.all;
  }

  trackByIndex: TrackByFunction<User> = index => index;
  trackById: TrackByFunction<User> = (_index, item) => item.id;

  async refresh(state: ClrDatagridStateInterface) {
    // this.loading = true;
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

    setTimeout(() => {
      this.trackByIdServerUsers = result.users;
      this.total = result.length;
      this.loading = false;
    });
  }
}
