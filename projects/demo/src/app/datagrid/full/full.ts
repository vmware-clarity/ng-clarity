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
import { ColorFilter } from '../utils/color-filter';
import { PokemonComparator } from '../utils/pokemon-comparator';
import { PokemonFilter } from '../utils/pokemon-filter';

@Component({
  selector: 'clr-datagrid-full-demo',
  providers: [Inventory],
  templateUrl: './full.html',
  styleUrls: ['../datagrid.demo.scss'],
})
export class DatagridFullDemo {
  options = {
    totalUsers: 103,
    pageSize: '10',
    selectable: true,
    loremIpsum: false,

    server: true,
    latency: '500',
    nameFilter: 'd',
    loadRowActionsDynamically: false,
  };

  resetting = true;
  currentPageSize: number;
  users: User[];
  selected: User[];
  loremIpsumColumn: boolean;
  // Server-driven specific
  isServerDriven = false;
  loading = true;
  total: number;
  rowActions: string[] = ['Edit', 'Delete'];
  rowActionsLoading = false;

  pokemonComparator = new PokemonComparator();
  pokemonFilter = new PokemonFilter();

  constructor(private inventory: Inventory) {
    this.reset();
  }

  trackById: TrackByFunction<User> = (_index, item) => item.id;
  trackByFn: ClrDatagridItemsTrackByFunction<User> = item => item.id;

  loadDynamicRowActions() {
    if (!this.options.loadRowActionsDynamically) {
      return;
    }
    this.rowActionsLoading = true;
    setTimeout(() => {
      this.rowActions = [
        'Edit',
        'Delete',
        'Dynamic Action 1',
        'Dynamic Action 2',
        'Dynamic Action 3',
        'Dynamic Action 3',
      ];
      this.rowActionsLoading = false;
    }, 2000);
  }

  reset() {
    this.resetting = true;
    this.loading = true;

    // Timeout hack to make sure we completely reset the datagrid
    setTimeout(() => {
      this.inventory.size = this.options.totalUsers;
      this.currentPageSize = Number.parseInt(this.options.pageSize, 10);
      this.selected = this.options.selectable ? [] : null;
      this.loremIpsumColumn = this.options.loremIpsum;
      this.isServerDriven = this.options.server;
      this.inventory.latency = Number.parseInt(this.options.latency, 10);

      this.inventory.reset();
      if (this.isServerDriven) {
        this.users = [];
      } else {
        this.users = this.inventory.all;
      }
      this.resetting = false;
    });
  }

  async refresh(state: ClrDatagridStateInterface) {
    if (!this.isServerDriven) {
      return;
    }
    this.loading = true;
    const filters: { [key: string]: any[] } = {};
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

    const result = await this.inventory
      .filter(filters)
      .sort(state.sort as { by: string; reverse: boolean })
      .fetch(state.page && state.page.from, state.page && state.page.size);

    this.users = result.users;
    this.total = result.length;
    this.loading = false;
  }

  clrDgActionOverflowOpenChangeFn(opened: boolean) {
    console.log('clrDgActionOverflowOpenChange event', opened);
  }
}
