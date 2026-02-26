/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrCheckboxModule,
  ClrCommonFormsModule,
  ClrDatagridModule,
  ClrDatagridStateInterface,
  ClrNumberInputModule,
  ClrPopoverHostDirective,
  ClrSelectModule,
  ClrStopEscapePropagationDirective,
} from '@clr/angular';

import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';
import { FetchResult, Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { ColorFilter } from '../utils/color-filter';
import { PokemonComparator } from '../utils/pokemon-comparator';
import { PokemonFilter } from '../utils/pokemon-filter';
import { CommonFiles } from '../utils/stackblitz-common-data';

const exampleHtml = `
<form clrForm (ngSubmit)="reset()">
  <clr-number-input-container>
    <label>Number of users</label>
    <input
      type="number"
      name="number-of-users"
      clrNumberInput
      [(ngModel)]="options.totalUsers"
      max="200"
    />
  </clr-number-input-container>

  <clr-select-container>
    <label>Rows per page</label>
    <select clrSelect name="rows-per-page" [(ngModel)]="options.pageSize">
      <option value="0">No pagination</option>
      <option value="10">10</option>
      <option value="25">25</option>
      <option value="100">100</option>
    </select>
  </clr-select-container>

  <clr-checkbox-wrapper>
    <input type="checkbox" name="selectable" clrCheckbox [(ngModel)]="options.selectable" />
    <label>Selectable</label>
  </clr-checkbox-wrapper>

  <clr-checkbox-wrapper>
    <input type="checkbox" name="multi-line-text" clrCheckbox [(ngModel)]="options.loremIpsum" />
    <label>Multi-line text</label>
  </clr-checkbox-wrapper>

  <clr-checkbox-wrapper>
    <input type="checkbox" name="server-driven" clrCheckbox [(ngModel)]="options.server" />
    <label>Server-driven</label>
  </clr-checkbox-wrapper>

  <clr-select-container *ngIf="options.server">
    <label>Latency</label>
    <select clrSelect name="latency" [(ngModel)]="options.latency">
      <option value="0">0 ms</option>
      <option value="100">100ms</option>
      <option value="200">200ms</option>
      <option value="500">500ms</option>
      <option value="1000">1s</option>
      <option value="2000">2s</option>
    </select>
  </clr-select-container>

  <button type="submit" class="btn btn-primary">Apply</button>
</form>

<div *ngIf="!resetting">
  <div *ngIf="selected" class="card card-block">
    <p class="card-text username-list">
      Selected users:
      <em *ngIf="selected.length == 0">No user selected.</em>
      <span class="username" *ngFor="let user of selected">{{ user.name }}</span>
    </p>
  </div>

  <clr-datagrid
    *ngIf="!isServerDriven && users"
    [(clrDgSelected)]="selected"
    [clrDgItemsIdentityFn]="trackUserItemById"
  >
    <clr-dg-column>User ID</clr-dg-column>
    <clr-dg-column [clrDgField]="'name'">Name</clr-dg-column>
    <clr-dg-column [clrDgField]="'creation'">Creation date</clr-dg-column>
    <clr-dg-column [clrDgSortBy]="pokemonComparator">
      Pokemon
      <clr-dg-string-filter [clrDgStringFilter]="pokemonFilter"></clr-dg-string-filter>
    </clr-dg-column>
    <clr-dg-column [clrDgField]="'color'">
      Favorite color
      <clr-dg-filter [clrDgFilter]="colorFilter">
        <clr-datagrid-color-filter #colorFilter class="color-filter"></clr-datagrid-color-filter>
      </clr-dg-filter>
    </clr-dg-column>
    <clr-dg-column *ngIf="loremIpsumColumn">Multi-line text</clr-dg-column>

    <clr-dg-placeholder>No users found</clr-dg-placeholder>
    <clr-dg-row *clrDgItems="let user of users" [clrDgItem]="user">
      <clr-dg-cell>{{ user.id }}</clr-dg-cell>
      <clr-dg-cell>{{ user.name }}</clr-dg-cell>
      <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
      <clr-dg-cell>{{ user.pokemon.name }}</clr-dg-cell>
      <clr-dg-cell>
        <span class="color-square" [style.backgroundColor]="user.color"></span>
      </clr-dg-cell>
      <clr-dg-cell class="lorem-ipsum" *ngIf="loremIpsumColumn">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tortor tellus, tincidunt eget
        mauris molestie, ullamcorper facilisis lacus. Vivamus sagittis suscipit libero, et tristique
        justo consectetur eget.
      </clr-dg-cell>
    </clr-dg-row>

    <clr-dg-footer>
      {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of
      {{ pagination.totalItems }} users
      <clr-dg-pagination #pagination [clrDgPageSize]="currentPageSize"></clr-dg-pagination>
    </clr-dg-footer>
  </clr-datagrid>

  <clr-datagrid
    *ngIf="isServerDriven"
    [(clrDgSelected)]="selected"
    (clrDgRefresh)="refresh($event)"
    [clrDgLoading]="loading"
    [clrDgItemsIdentityFn]="trackUserItemById"
  >
    <clr-dg-column>User ID</clr-dg-column>
    <clr-dg-column [clrDgField]="'name'">Name</clr-dg-column>
    <clr-dg-column [clrDgField]="'creation'">Creation date</clr-dg-column>
    <clr-dg-column [clrDgField]="'pokemon'">Pokemon</clr-dg-column>
    <clr-dg-column [clrDgField]="'color'">
      Favorite color
      <clr-dg-filter [clrDgFilter]="colorFilter">
        <clr-datagrid-color-filter #colorFilter class="color-filter"></clr-datagrid-color-filter>
      </clr-dg-filter>
    </clr-dg-column>
    <clr-dg-column *ngIf="loremIpsumColumn">Multi-line text</clr-dg-column>

    <clr-dg-placeholder>No users found</clr-dg-placeholder>
    <clr-dg-row *ngFor="let user of users" [clrDgItem]="user">
      <clr-dg-cell>{{ user.id }}</clr-dg-cell>
      <clr-dg-cell>{{ user.name }}</clr-dg-cell>
      <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
      <clr-dg-cell>{{ user.pokemon.name }}</clr-dg-cell>
      <clr-dg-cell>
        <span class="color-square" [style.backgroundColor]="user.color"></span>
      </clr-dg-cell>
      <clr-dg-cell class="lorem-ipsum" *ngIf="loremIpsumColumn">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tortor tellus, tincidunt eget
        mauris molestie, ullamcorper facilisis lacus. Vivamus sagittis suscipit libero, et tristique
        justo consectetur eget.
      </clr-dg-cell>
    </clr-dg-row>

    <clr-dg-footer>
      {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of {{ total }} users
      <clr-dg-pagination
        #pagination
        [clrDgPageSize]="currentPageSize"
        [clrDgTotalItems]="total"
      ></clr-dg-pagination>
    </clr-dg-footer>
  </clr-datagrid>
</div>
`;

const exampleTs = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrCheckboxModule,
  ClrDatagridModule,
  ClrDatagridStateInterface,
  ClrFormsModule,
  ClrLoadingModule,
  ClrRadioModule,
  ClrIcon,
} from '@clr/angular';

import { FetchResult, Inventory } from './inventory/inventory';
import { User } from './inventory/user';
import { ColorFilter } from './utils/color-filter';
import { PokemonComparator } from './utils/pokemon-comparator';
import { PokemonFilter } from './utils/pokemon-filter';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  providers: [Inventory],
  imports: [
    CommonModule,
    ClrDatagridModule,
    ClrRadioModule,
    ClrCheckboxModule,
    ClrFormsModule,
    ClrLoadingModule,
    ClrIcon,
    FormsModule,
    ColorFilter,
  ],
})
export class ExampleComponent {
  options = {
    totalUsers: 103,
    pageSize: '10',
    selectable: true,
    loremIpsum: false,

    server: false,
    latency: '500',
  };

  resetting = true;
  currentPageSize = +this.options.pageSize;
  users: User[] | undefined;
  selected: User[] | undefined;
  loremIpsumColumn: boolean | undefined;
  // Server-driven specific
  isServerDriven = false;
  loading = true;
  total = 0;

  pokemonComparator = new PokemonComparator();
  pokemonFilter = new PokemonFilter();

  constructor(private inventory: Inventory) {
    this.reset();
  }

  reset() {
    this.resetting = true;
    this.loading = true;

    // Timeout hack to make sure we completely reset the datagrid
    setTimeout(() => {
      this.inventory.size = this.options.totalUsers;
      this.currentPageSize = Number.parseInt(this.options.pageSize, 10);
      this.selected = this.options.selectable ? [] : undefined;
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

  refresh(state: ClrDatagridStateInterface) {
    if (!this.isServerDriven) {
      return;
    }
    this.loading = true;
    const filters: { [key: string]: any[] } = {};
    if (state.filters) {
      for (const filter of state.filters) {
        if (filter instanceof ColorFilter) {
          filters.color = (<ColorFilter>filter).listSelected();
        } else {
          const { property, value } = <{ property: string; value: string }>filter;
          filters[property] = [value];
        }
      }
    }
    this.inventory
      .filter(filters)
      .sort(<{ by: string; reverse: boolean }>state.sort)
      .fetch(
        state.page &&
          state.page.size &&
          state.page.current &&
          state.page.size * (state.page.current - 1),
        state.page && state.page.size
      )
      .then((result: FetchResult) => {
        this.users = result.users;
        this.total = result.length;
        this.loading = false;
      });
  }

  trackUserItemById(user: User) {
    return user.id;
  }
}
`;

@Component({
  selector: 'clr-datagrid-full-demo',
  providers: [Inventory],
  templateUrl: './full.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [
    FormsModule,
    ClrCommonFormsModule,
    ClrNumberInputModule,
    ClrSelectModule,
    ClrCheckboxModule,
    ClrDatagridModule,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ColorFilter,
    StackblitzExampleComponent,
    DatePipe,
  ],
})
export class DatagridFullDemo {
  exampleHtml = exampleHtml;
  exampleTs = exampleTs;
  commonFiles = CommonFiles;

  additionalFiles = {
    ...CommonFiles.additionalFiles,
    'utils/color-filter.ts': '',
    'utils/pokemon-filter.ts': '',
    'utils/pokemon-comparator.ts': '',
  };

  options = {
    totalUsers: 103,
    pageSize: '10',
    selectable: true,
    loremIpsum: false,

    server: false,
    latency: '500',
  };

  resetting = true;
  currentPageSize = +this.options.pageSize;
  users: User[] | undefined;
  selected: User[] | undefined;
  loremIpsumColumn: boolean | undefined;
  // Server-driven specific
  isServerDriven = false;
  loading = true;
  total = 0;

  pokemonComparator = new PokemonComparator();
  pokemonFilter = new PokemonFilter();

  constructor(private inventory: Inventory) {
    this.reset();
  }

  reset() {
    this.resetting = true;
    this.loading = true;

    // Timeout hack to make sure we completely reset the datagrid
    setTimeout(() => {
      this.inventory.size = this.options.totalUsers;
      this.currentPageSize = Number.parseInt(this.options.pageSize, 10);
      this.selected = this.options.selectable ? [] : undefined;
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

  refresh(state: ClrDatagridStateInterface) {
    if (!this.isServerDriven) {
      return;
    }
    this.loading = true;
    const filters: { [key: string]: any[] } = {};
    if (state.filters) {
      for (const filter of state.filters) {
        if (filter instanceof ColorFilter) {
          filters.color = (<ColorFilter>filter).listSelected();
        } else {
          const { property, value } = <{ property: string; value: string }>filter;
          filters[property] = [value];
        }
      }
    }
    this.inventory
      .filter(filters)
      .sort(<{ by: string; reverse: boolean }>state.sort)
      .fetch(
        state.page && state.page.size && state.page.current && state.page.size * (state.page.current - 1),
        state.page && state.page.size
      )
      .then((result: FetchResult) => {
        this.users = result.users;
        this.total = result.length;
        this.loading = false;
      });
  }

  trackUserItemById(user: User) {
    return user.id;
  }
}
