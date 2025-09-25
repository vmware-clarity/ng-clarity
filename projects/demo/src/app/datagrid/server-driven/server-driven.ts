/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

@Component({
  selector: 'clr-datagrid-server-driven-demo',
  providers: [Inventory],
  templateUrl: 'server-driven.html',
  styleUrls: ['../datagrid.demo.scss'],
  standalone: false,
})
export class DatagridServerDrivenDemo {
  users: User[];
  total: number;
  loading = true;

  constructor(private inventory: Inventory) {
    inventory.size = 103;
    inventory.latency = 500;
    inventory.reset();
  }

  async refresh(state: ClrDatagridStateInterface<User>) {
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

    this.users = result.users;
    this.total = result.length;
    this.loading = false;
  }
}
