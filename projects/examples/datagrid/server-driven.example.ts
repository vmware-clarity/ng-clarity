/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClrDatagridModule, ClrDatagridStateInterface } from '@clr/angular';

import { FetchResult, Inventory } from './inventory/inventory';
import { User } from './inventory/user';

@Component({
  selector: 'clr-datagrid-server-driven-example',
  templateUrl: './server-driven.example.html',
  styleUrl: './server-driven.example.scss',
  providers: [Inventory],
  imports: [CommonModule, ClrDatagridModule],
})
export class DatagridServerDrivenExample {
  users: User[] | undefined;
  loading = true;
  totalUserCount = 103;

  constructor(private inventory: Inventory) {
    inventory.size = this.totalUserCount;
    inventory.latency = 500;
    inventory.reset();
  }

  refresh(state: ClrDatagridStateInterface) {
    this.loading = true;
    const filters: { [prop: string]: any[] } = {};
    if (state.filters) {
      for (const filter of state.filters) {
        const { property, value } = <{ property: string; value: string }>filter;
        filters[property] = [value];
      }
    }

    const pageSize = state.page?.size || 10;
    const currentPage = state.page?.current || 1;

    this.inventory
      .filter(filters)
      .sort(<{ by: string; reverse: boolean }>state.sort)
      .fetch(pageSize * (currentPage - 1), pageSize)
      .then((result: FetchResult) => {
        this.users = result.users;
        this.loading = false;
      });
  }
}
