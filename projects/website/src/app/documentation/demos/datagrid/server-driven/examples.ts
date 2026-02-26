/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const stateInterface = `
interface ClrDatagridStateInterface<T = any> {
  page?: {
    from?: number;
    to?: number;
    size?: number;
    current?: number;
  };
  sort?: {
    by: string | ClrDatagridComparatorInterface<T>;
    reverse: boolean;
  };
  filters?: any[];
}
`;

const serverDrivenTS = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClrDatagridModule, ClrDatagridStateInterface } from '@clr/angular';
import { FetchResult, Inventory } from './inventory/inventory';
import { User } from './inventory/user';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  providers: [Inventory],
  imports: [CommonModule, ClrDatagridModule],
})
export class ExampleComponent {
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
`;

const serverDrivenHTML = `
<clr-datagrid (clrDgRefresh)="refresh($event)" [clrDgLoading]="loading">
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column [clrDgField]="'name'">Name</clr-dg-column>
  <clr-dg-column [clrDgField]="'creation'">Creation date</clr-dg-column>
  <clr-dg-column [clrDgField]="'pokemon'">Pokemon</clr-dg-column>
  <clr-dg-column [clrDgField]="'color'">Favorite color</clr-dg-column>

  <clr-dg-row *ngFor="let user of users">
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
    <clr-dg-cell>{{ user.pokemon.name }}</clr-dg-cell>
    <clr-dg-cell>
      <span class="color-square" [style.backgroundColor]="user.color"></span>
    </clr-dg-cell>
  </clr-dg-row>

  <clr-dg-footer>
    <clr-dg-pagination #pagination [clrDgPageSize]="10" [clrDgTotalItems]="totalUserCount">
      <clr-dg-page-size [clrPageSizeOptions]="[10, 20, 50, 100]">Users per page</clr-dg-page-size>
      {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of
      {{ pagination.totalItems }} users
    </clr-dg-pagination>
  </clr-dg-footer>
</clr-datagrid>
`;

export const EXAMPLES = {
  stateInterface,
  serverDrivenTS,
  serverDrivenHTML,
};
