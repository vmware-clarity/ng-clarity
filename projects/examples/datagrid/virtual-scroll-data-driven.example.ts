/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ListRange } from '@angular/cdk/collections';
import { DatePipe, JsonPipe } from '@angular/common';
import { ChangeDetectorRef, Component, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrCheckboxModule,
  ClrDatagrid,
  ClrDatagridItemsIdentityFunction,
  ClrDatagridModule,
  ClrDatagridStateInterface,
  ClrDropdownModule,
  ClrIcon,
  ClrNumberInputModule,
} from '@clr/angular';

import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';

@Component({
  selector: 'clr-datagrid-virtual-scroll-data-driven-example',
  templateUrl: './virtual-scroll-data-driven.example.html',
  styleUrl: './virtual-scroll-data-driven.example.scss',
  providers: [Inventory],
  imports: [
    DatePipe,
    JsonPipe,
    FormsModule,
    ClrCheckboxModule,
    ClrDatagridModule,
    ClrDropdownModule,
    ClrIcon,
    ClrNumberInputModule,
  ],
})
export class DatagridVirtualScrollDataDrivenExample {
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

  readonly datagrid = viewChild<ClrDatagrid>('datagrid');

  constructor(
    public inventory: Inventory,
    private cdr: ChangeDetectorRef
  ) {
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

  trackItemById: ClrDatagridItemsIdentityFunction<User> = (item: User) => item?.id;

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
    this.datagrid()?.virtualScroll.scrollToIndex(index, behaviour);
  }

  scrollDown(offset: number, behaviour: 'auto' | 'smooth' = 'smooth') {
    this.datagrid()?.virtualScroll.scrollDown(offset, behaviour);
  }

  scrollUp(offset: number, behaviour: 'auto' | 'smooth' = 'smooth') {
    this.datagrid()?.virtualScroll.scrollUp(offset, behaviour);
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
