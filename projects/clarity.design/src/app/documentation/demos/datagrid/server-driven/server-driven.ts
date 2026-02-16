/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';

import { EXAMPLES } from './examples';
import { FetchResult, Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { CommonFiles } from '../utils/stackblitz-common-data';

@Component({
  selector: 'clr-datagrid-server-driven-demo',
  providers: [Inventory],
  templateUrl: 'server-driven.html',
  styleUrl: '../datagrid.demo.scss',
  standalone: false,
})
export class DatagridServerDrivenDemo {
  examples = EXAMPLES;
  commonFiles = CommonFiles;
  users: User[] | undefined;
  loading = true;
  totalUserCount = 103;

  constructor(private inventory: Inventory) {
    this.inventory.size = this.totalUserCount;
    this.inventory.latency = 500;
    this.inventory.reset();
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
