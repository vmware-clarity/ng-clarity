/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const EXAMPLE_CONTROLS = `
<div class="card">
  <div class="card-header">Datagrid controls</div>
  <div class="card-block">
    <div class="card-text">
      <clr-radio-container class="clr-mt-0px">
        <label>Row Size</label>
        <clr-radio-wrapper>
          <input
            type="radio"
            clrRadio
            name="row-size"
            value="default"
            [(ngModel)]="rowSize"
            [checked]="rowSize === 'default'"
          />
          <label>Default</label>
        </clr-radio-wrapper>
        <clr-radio-wrapper>
          <input
            type="radio"
            clrRadio
            name="row-size"
            value="compact"
            [(ngModel)]="rowSize"
            [checked]="rowSize === 'compact'"
          />
          <label>Compact</label>
        </clr-radio-wrapper>
      </clr-radio-container>
      <clr-radio-container>
        <label>Loading Method</label>
        <clr-radio-wrapper>
          <input
            type="radio"
            clrRadio
            name="loading-methods"
            value="server"
            [(ngModel)]="loadingMethod"
            [checked]="loadingMethod === 'server'"
          />
          <label>Server side</label>
        </clr-radio-wrapper>
        <clr-radio-wrapper>
          <input
            type="radio"
            clrRadio
            name="loading-methods"
            value="client"
            [(ngModel)]="loadingMethod"
            [checked]="loadingMethod === 'client'"
          />
          <label>Client side</label>
        </clr-radio-wrapper>
      </clr-radio-container>
    </div>
  </div>
  <div class="card-block" *ngIf="loadingMethod === 'server'">
    <h4 class="card-title">Server side loading</h4>
    <div class="card-text">
      <clr-number-input-container>
        <label>Row count per query</label>
        <input
          clrNumberInput
          id="rows-per-query"
          type="number"
          name="rows"
          [(ngModel)]="currentPageSize"
        />
      </clr-number-input-container>
    </div>
  </div>
  <div class="card-block" *ngIf="loadingMethod === 'client'">
    <h4 class="card-title">Client side loading</h4>
    <div class="card-text">
      <clr-number-input-container>
        <label>Total Rows to load</label>
        <input clrNumberInput id="total-rows" type="number" name="rows" [(ngModel)]="totalRows" />
      </clr-number-input-container>
    </div>
  </div>
  <div class="card-footer">
    <button class="btn" (click)="refreshPage()">Reload Datagrid</button>
  </div>
</div>
`;

const EXAMPLE_STATIC = `
<clr-datagrid
  style="height: 24rem"
  [clrDgLoading]="loading"
  [clrDgItemsTrackBy]="trackItemById"
  [clrLoadingMoreItems]="loadingMoreItems"
  [(clrDgSelected)]="selected"
  (clrDgRefresh)="refresh($event)"
  [class.datagrid-compact]="rowSize === 'compact'"
>
  <clr-dg-column [clrDgField]="'id'">
    <ng-container *clrDgHideableColumn="{ hidden: false }">User ID</ng-container>
  </clr-dg-column>
  <clr-dg-column [clrDgField]="'name'">
    <ng-container *clrDgHideableColumn="{ hidden: false }">Name</ng-container>
  </clr-dg-column>
  <clr-dg-column [clrDgField]="'creation'">
    <ng-container *clrDgHideableColumn="{ hidden: false }">Created At</ng-container>
  </clr-dg-column>
  <clr-dg-column [clrDgField]="'pokemon.name'">
    <ng-container *clrDgHideableColumn="{ hidden: false }">Pokemon</ng-container>
  </clr-dg-column>
  <clr-dg-column [clrDgField]="'color'">
    <ng-container *clrDgHideableColumn="{ hidden: false }">Color Used</ng-container>
    <clr-dg-filter [clrDgFilter]="colorFilter">
      <clr-datagrid-color-filter #colorFilter></clr-datagrid-color-filter>
    </clr-dg-filter>
  </clr-dg-column>
  <clr-dg-column [clrDgField]="'wins'" [clrDgColType]="'number'">
    <ng-container *clrDgHideableColumn="{ hidden: false }">Wins</ng-container>
  </clr-dg-column>

  <ng-template
    ClrVirtualScroll
    let-user
    [clrVirtualRowsOf]="users"
    (renderedRangeChange)="renderRangeChange($event)"
  >
    <clr-dg-row [clrDgItem]="user">
      <clr-dg-cell>{{ user.id }}</clr-dg-cell>
      <clr-dg-cell>{{ user.name }}</clr-dg-cell>
      <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
      <clr-dg-cell>{{ user.pokemon.name }}</clr-dg-cell>
      <clr-dg-cell>
        <span class="color-square" [style.backgroundColor]="user.color"></span>
      </clr-dg-cell>
      <clr-dg-cell>{{ user.wins }}</clr-dg-cell>

      <clr-dg-row-detail
        [clrIfExpanded]="user.expanded"
        (clrIfExpandedChange)="setExpanded($event, user)"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque in ante placerat mattis
        id sed quam. Proin rhoncus lacus et tempor dignissim. Vivamus sem quam, pellentesque aliquet
        suscipit eget, pellentesque sed arcu. Vivamus in dui lectus. Suspendisse cursus est ac nisl
        imperdiet viverra.
      </clr-dg-row-detail>
    </clr-dg-row>
  </ng-template>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

const EXAMPLE_ASYNC = `
<clr-datagrid
  *ngIf="{ users: users | async }; let data"
  [clrDgLoading]="loading"
  [clrDgItemsTrackBy]="trackItemById"
  [clrLoadingMoreItems]="loadingMoreItems"
  [(clrDgSelected)]="selected"
  (clrDgRefresh)="refresh($event)"
  [class.datagrid-compact]="rowSize === 'compact'"
  style="height: 24rem"
>
  <clr-dg-column [clrDgField]="'id'">
    <ng-container *clrDgHideableColumn="{ hidden: false }">User ID</ng-container>
  </clr-dg-column>
  <clr-dg-column [clrDgField]="'name'">
    <ng-container *clrDgHideableColumn="{ hidden: false }">Name</ng-container>
  </clr-dg-column>
  <clr-dg-column [clrDgField]="'creation'">
    <ng-container *clrDgHideableColumn="{ hidden: false }">Created At</ng-container>
  </clr-dg-column>
  <clr-dg-column [clrDgField]="'pokemon.name'">
    <ng-container *clrDgHideableColumn="{ hidden: false }">Pokemon</ng-container>
  </clr-dg-column>
  <clr-dg-column>
    <ng-container *clrDgHideableColumn="{ hidden: false }">Color Used</ng-container>
    <clr-dg-filter [clrDgFilter]="colorFilter">
      <clr-datagrid-color-filter #colorFilter></clr-datagrid-color-filter>
    </clr-dg-filter>
  </clr-dg-column>
  <clr-dg-column [clrDgField]="'wins'" [clrDgColType]="'number'">
    <ng-container *clrDgHideableColumn="{ hidden: false }">Wins</ng-container>
  </clr-dg-column>

  <ng-template
    *ngIf="data.users"
    ClrVirtualScroll
    let-user
    [clrVirtualRowsOf]="data.users"
    (renderedRangeChange)="renderRangeChange($event)"
  >
    <clr-dg-row [clrDgItem]="user">
      <clr-dg-action-overflow (clrDgActionOverflowOpenChange)="clrDgActionOverflowOpenChangeFn($event)">
        <button class="action-item">
          <cds-icon shape="note"></cds-icon>
          Edit
        </button>
        <button class="action-item">
          <cds-icon shape="trash"></cds-icon>
          Delete
        </button>
      </clr-dg-action-overflow>
      <clr-dg-cell>{{ user.id }}</clr-dg-cell>
      <clr-dg-cell>{{ user.name }}</clr-dg-cell>
      <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
      <clr-dg-cell>{{ user.pokemon.name }}</clr-dg-cell>
      <clr-dg-cell>
        <span class="color-square" [style.backgroundColor]="user.color"></span>
      </clr-dg-cell>
      <clr-dg-cell>{{ user.wins }}</clr-dg-cell>

      <clr-dg-row-detail
        [clrIfExpanded]="user.expanded"
        (clrIfExpandedChange)="setExpanded($event, user)"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque in ante placerat mattis
        id sed quam. Proin rhoncus lacus et tempor dignissim. Vivamus sem quam, pellentesque aliquet
        suscipit eget, pellentesque sed arcu. Vivamus in dui lectus. Suspendisse cursus est ac nisl
        imperdiet viverra.
      </clr-dg-row-detail>
    </clr-dg-row>
  </ng-template>

  <clr-dg-footer>{{ data.users?.length }} users</clr-dg-footer>
</clr-datagrid>
`;

const dataDrivenHtml = `
<div class="card">
  <div class="card-header">Datagrid controls</div>
  <div class="card-block">
    <h4 class="card-title">Data driven scroller</h4>
    <div class="card-text">
      <clr-number-input-container>
        <label>Total Rows to load</label>
        <input clrNumberInput id="data-total-rows" type="number" name="rows" [(ngModel)]="totalRows" />
      </clr-number-input-container>
      <clr-toggle-container>
        <label>Persist Items</label>
        <clr-toggle-wrapper>
          <input type="checkbox" clrToggle name="presistItems" [(ngModel)]="persistItems" />
          <label>{{ persistItems ? 'ON' : 'OFF' }}</label>
        </clr-toggle-wrapper>
      </clr-toggle-container>
    </div>
  </div>
  <div class="card-footer">
    <button class="btn" (click)="refreshPage()">Reload Datagrid</button>
  </div>
</div>

<clr-datagrid
  #datagrid
  [(clrDgSelected)]="selected"
  [clrDgItemsTrackBy]="trackItemById"
  (clrDgRefresh)="refresh($event)"
  class="datagrid-compact"
  style="height: 24rem"
>
  <clr-dg-column [clrDgField]="'id'">User ID</clr-dg-column>
  <clr-dg-column [clrDgField]="'name'">Name</clr-dg-column>
  <clr-dg-column [clrDgField]="'creation'">Creation date</clr-dg-column>
  <clr-dg-column [clrDgField]="'pokemon.name'">Pokemon</clr-dg-column>
  <clr-dg-column [clrDgField]="'color'">Favorite color</clr-dg-column>

  <ng-template
    clrVirtualScroll
    let-user
    let-index="index"
    [clrVirtualDataRange]="dataRange"
    [clrVirtualPersistItems]="persistItems"
    [clrVirtualRowsItemSize]="24"
    [clrVirtualRowsMinBufferPx]="200"
    [clrVirtualRowsMaxBufferPx]="400"
    [clrVirtualRowsTemplateCacheSize]="400"
    [clrVirtualRowsTrackBy]="rowByIndex"
    (renderedRangeChange)="renderUserRangeChange($event)"
  >
    <clr-dg-row [clrDgItem]="user" [clrDgSkeletonLoading]="!user">
      <clr-dg-cell>{{ user?.id }} index: {{ index }}</clr-dg-cell>
      <clr-dg-cell>{{ user?.name }}</clr-dg-cell>
      <clr-dg-cell>{{ user?.creation | date }}</clr-dg-cell>
      <clr-dg-cell>
        {{ user?.pokemon?.name }}
        <span class="badge badge-5">#{{ user?.pokemon?.number }}</span>
      </clr-dg-cell>
      <clr-dg-cell>
        <span class="color-square" [style.backgroundColor]="user?.color"></span>
      </clr-dg-cell>
    </clr-dg-row>
  </ng-template>

  <clr-dg-detail *clrIfDetail="let detail">
    <clr-dg-detail-header>{{ detail.name }}</clr-dg-detail-header>
    <clr-dg-detail-body>
      <pre>{{ detail | json }}</pre>
    </clr-dg-detail-body>
  </clr-dg-detail>

  <clr-dg-footer>
    <div class="footer-counters">
      Rows {{ (userRange.start || 0) + 1 }} - {{ userRange.end }} of {{ dataRange.total }}
    </div>
    <clr-dropdown>
      <button
        class="btn btn-sm btn-outline-neutral"
        clrDropdownTrigger
        aria-label="Dropdown demo button"
      >
        Snap Jump to
        <cds-icon shape="angle" direction="down"></cds-icon>
      </button>
      <clr-dropdown-menu *clrIfOpen [clrPosition]="'top-right'">
        <div *ngFor="let index of getIndexes(dataRange.total)" (click)="jumpTo(index)" clrDropdownItem>
          {{ index + 1 }}
        </div>
      </clr-dropdown-menu>
    </clr-dropdown>

    <button class="btn btn-sm btn-link-neutral footer-button" (click)="jumpTo(0, 'smooth')">
      <cds-icon shape="step-forward-2" direction="left"></cds-icon>
    </button>
    <button class="btn btn-sm btn-link-neutral footer-button" (click)="scrollUp(19)">
      <cds-icon shape="angle" direction="up"></cds-icon>
    </button>
    <button class="btn btn-sm btn-link-neutral footer-button" (click)="scrollDown(19)">
      <cds-icon shape="angle" direction="down"></cds-icon>
    </button>
    <button
      class="btn btn-sm btn-link-neutral footer-button"
      (click)="jumpTo(dataRange.total, 'smooth')"
    >
      <cds-icon shape="step-forward-2" direction="right"></cds-icon>
    </button>
  </clr-dg-footer>
</clr-datagrid>
`;

const asyncTs = `
import { CommonModule } from '@angular/common';
import { ListRange } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrCheckboxModule,
  ClrDatagridItemsTrackByFunction,
  ClrDatagridModule,
  ClrDatagridStateInterface,
  ClrFormsModule,
  ClrLoadingModule,
  ClrRadioModule,
  ClrIconModule,
} from '@clr/angular';
import { Observable, Subscription } from 'rxjs';

import { FetchResult, Inventory } from './inventory/inventory';
import { User } from './inventory/user';
import { ColorFilter } from './utils/color-filter';

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
    ClrIconModule,
    FormsModule,
    ColorFilter,
  ],
})
export class ExampleComponent implements OnInit, OnDestroy {
  // server side
  currentPageSize = 100;
  loadingMoreItems = false;

  // client side
  totalRows = 10000;
  loading = false;

  // other
  users: Observable<User[]>;
  loadingMethod = 'server';
  rowSize = 'default';
  selected: User[] = [];
  private subscribe: Subscription | undefined;

  constructor(public inventory: Inventory, private cdr: ChangeDetectorRef) {
    // server side at beginning
    this.inventory.size = this.currentPageSize * 3;
    this.inventory.lazyLoadUsers(this.inventory.size);
    this.users = this.inventory.getAllUsersSubject().asObservable();
  }

  trackItemById: ClrDatagridItemsTrackByFunction<User> = (item: User) => item?.id;

  ngOnInit(): void {
    this.subscribe = this.users.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  setExpanded($event: boolean, user: User) {
    user.expanded = $event;
  }

  loadMore($event: ListRange) {
    if (
      this.loadingMoreItems ||
      $event.end + this.currentPageSize < this.inventory.size - this.currentPageSize / 2
    ) {
      return;
    }

    this.loadingMoreItems = true;

    setTimeout(() => {
      this.inventory.size += this.currentPageSize;
      this.inventory.lazyLoadUsers(this.currentPageSize);
      this.loadingMoreItems = false;
      this.cdr.detectChanges();
    }, 2000);
  }

  renderRangeChange($event: ListRange) {
    if (this.loadingMethod === 'server') {
      this.loadMore($event);
    }
  }

  clrDgActionOverflowOpenChangeFn($event: boolean) {
    console.log('clrDgActionOverflowOpenChange event', $event);
  }

  refreshPage() {
    this.loading = true;
    this.inventory.all = [];
    this.inventory.generatedCount = 0;

    // imitate back end call
    setTimeout(() => {
      this.inventory.size = this.loadingMethod === 'server' ? this.currentPageSize * 3 : this.totalRows;

      this.inventory.lazyLoadUsers(this.inventory.size);

      this.loading = false;

      this.cdr.detectChanges();
    }, 2000);
  }

  refresh(state: ClrDatagridStateInterface) {
    const filters: { [key: string]: any[] } = {};
    this.loading = true;

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

    this.inventory
      .filter(filters)
      .sort(state.sort as { by: string; reverse: boolean })
      .fetch()
      .then((result: FetchResult) => {
        this.inventory.getAllUsersSubject().next(result.users);
        this.loading = false;

        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.subscribe?.unsubscribe();
  }
}
`;

const staticTs = `
import { CommonModule } from '@angular/common';
import { ListRange } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrCheckboxModule,
  ClrDatagridItemsTrackByFunction,
  ClrDatagridModule,
  ClrDatagridStateInterface,
  ClrFormsModule,
  ClrRadioModule,
} from '@clr/angular';
import { Observable, Subscription } from 'rxjs';

import { FetchResult, Inventory } from './inventory/inventory';
import { User } from './inventory/user';
import { ColorFilter } from './utils/color-filter';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  providers: [Inventory],
  imports: [
    CommonModule,
    ClrDatagridItemsTrackByFunction,
    ClrDatagridModule,
    ClrRadioModule,
    ClrCheckboxModule,
    ClrFormsModule,
    FormsModule,
    ColorFilter,
  ],
})
export class ExampleComponent implements OnDestroy {
  // server side
  currentPageSize = 100;
  loadingMoreItems = false;

  // client side
  totalRows = 10000;
  loading = false;

  // other
  users: User[];
  loadingMethod = 'server';
  rowSize = 'default';
  selected: User[] = [];
  private subscribe: Subscription | undefined;

  constructor(public inventory: Inventory, private cdr: ChangeDetectorRef) {
    // server side at beginning
    this.inventory.size = this.currentPageSize * 3;
    this.inventory.lazyLoadUsers(this.inventory.size);
    this.users = this.inventory.all;
  }

  trackItemById: ClrDatagridItemsTrackByFunction<User> = (item: User) => item?.id;

  setExpanded($event: boolean, user: User) {
    user.expanded = $event;
  }

  loadMore($event: ListRange) {
    if (
      this.loadingMoreItems ||
      $event.end + this.currentPageSize < this.inventory.size - this.currentPageSize / 2
    ) {
      return;
    }

    this.loadingMoreItems = true;

    setTimeout(() => {
      this.inventory.size += this.currentPageSize;
      this.inventory.lazyLoadUsers(this.currentPageSize);
      this.users = this.inventory.all;
      this.loadingMoreItems = false;
      this.cdr.detectChanges();
    }, 2000);
  }

  renderRangeChange($event: ListRange) {
    if (this.loadingMethod === 'server') {
      this.loadMore($event);
    }
  }

  clrDgActionOverflowOpenChangeFn($event: boolean) {
    console.log('clrDgActionOverflowOpenChange event', $event);
  }

  refreshPage() {
    this.loading = true;
    this.inventory.all = [];
    this.inventory.generatedCount = 0;

    // imitate back end call
    setTimeout(() => {
      this.inventory.size = this.loadingMethod === 'server' ? this.currentPageSize * 3 : this.totalRows;

      this.inventory.lazyLoadUsers(this.inventory.size);
      this.users = this.inventory.all;

      this.loading = false;

      this.cdr.detectChanges();
    }, 2000);
  }

  refresh(state: ClrDatagridStateInterface) {
    const filters: { [key: string]: any[] } = {};
    this.loading = true;
    this.cdr.detectChanges();

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

    this.inventory
      .filter(filters)
      .sort(state.sort as { by: string; reverse: boolean })
      .fetch()
      .then((result: FetchResult) => {
        this.users = result.users;
        this.loading = false;

        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.subscribe?.unsubscribe();
  }
}
`;

const dataDrivenTs = `
import { CommonModule } from '@angular/common';
import { ListRange } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrCheckboxModule,
  ClrDatagrid,
  ClrDatagridItemsTrackByFunction,
  ClrDatagridModule,
  ClrDatagridStateInterface,
  ClrDropdownModule,
  ClrFormsModule,
} from '@clr/angular';
import { Observable, Subscription } from 'rxjs';

import { FetchResult, Inventory } from './inventory/inventory';
import { User } from './inventory/user';
import { ColorFilter } from './utils/color-filter';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  providers: [Inventory],
  imports: [
    CommonModule,
    ClrDatagridModule,
    ClrDropdownModule,
    ClrCheckboxModule,
    ClrFormsModule,
    FormsModule,
    ColorFilter,
  ],
})
export class ExampleComponent {
  // data driven
  _totalRows = 10000;
  persistItems = false;
  state: ClrDatagridStateInterface | undefined;
  dataRange: {
    total: number;
    skip: number;
    data: User[];
  };

  // other
  userRange: ListRange = {
    start: 0,
    end: 100,
  };
  selected: User[] = [];

  @ViewChild('datagrid') datagrid: ClrDatagrid | undefined;

  constructor(public inventory: Inventory, private cdr: ChangeDetectorRef) {
    inventory.size = this.totalRows;
    inventory.latency = 500;
    inventory.reset(false);

    this.dataRange = {
      total: this.totalRows,
      skip: 0,
      data: [],
    };
  }

  get totalRows() {
    return this._totalRows;
  }

  set totalRows(totalRows) {
    console.log(totalRows);

    this._totalRows = totalRows;
    this.inventory.size = totalRows;
    this.inventory.generatedCount = 0;
    this.inventory.reset(false);
    this.renderUserRangeChange(this.userRange).then(() => {
      // this.cdr.detectChanges();
    });
  }

  trackItemById: ClrDatagridItemsTrackByFunction<User> = (item: User) => item?.id;

  refreshPage() {
    this.totalRows = this._totalRows;
  }

  async refresh(state: ClrDatagridStateInterface) {
    console.log('refresh', state);
    this.state = state;
    const filters: { [prop: string]: any[] } = {};

    if (state.filters) {
      for (const filter of state.filters) {
        const { property, value } = filter;
        filters[property] = [value];
      }
    }

    const start = this.userRange.start;

    const result = await this.inventory
      .filter(filters)
      .sort(state.sort as { by: string; reverse: boolean })
      .fetch(start, this.userRange.end - start);

    this.dataRange = {
      total: result.length,
      data: result.users,
      skip: start,
    };

    this.cdr.detectChanges();
  }

  jumpTo(index: number, behaviour: 'auto' | 'smooth' = 'auto') {
    this.datagrid?.virtualScroll.scrollToIndex(index, behaviour);
  }

  scrollDown(offset: number, behaviour: 'auto' | 'smooth' = 'smooth') {
    this.datagrid?.virtualScroll.scrollDown(offset, behaviour);
  }

  scrollUp(offset: number, behaviour: 'auto' | 'smooth' = 'smooth') {
    this.datagrid?.virtualScroll.scrollUp(offset, behaviour);
  }

  rowByIndex(index: number, user: User) {
    return user?.id;
  }

  async renderUserRangeChange($event: ListRange) {
    console.log($event);

    this.userRange = {
      start: $event.start,
      end: $event.end,
    };

    if (this.state?.sort || this.state?.filters) {
      await this.refresh(this.state);
    } else {
      await this.getData($event);
    }
  }

  getIndexes(count: number) {
    const result = [];

    for (let i = 0; i < count; i++) {
      if (i % 1000 === 0) {
        result.push(i);
      }
    }

    return result;
  }

  private async getData($event: ListRange) {
    const result = await this.inventory.fetch($event.start, $event.end - $event.start);

    this.dataRange = {
      total: result.length,
      data: result.users,
      skip: $event.start,
    };

    this.cdr.detectChanges();
  }
}
`;

export const Examples = {
  dataDrivenHtml,
  staticHtml: EXAMPLE_CONTROLS + EXAMPLE_STATIC,
  asyncHtml: EXAMPLE_CONTROLS + EXAMPLE_ASYNC,
  dataDrivenTs,
  asyncTs,
  staticTs,
};
