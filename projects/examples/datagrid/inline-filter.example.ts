/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClrDatagridFilterInterface, ClrDatagridModule } from '@clr/angular';
import { Observable, Subject } from 'rxjs';

import { Inventory } from './inventory/inventory';
import INVENTORY_ITEMS from './inventory/inventory-items.json';
import { User } from './inventory/user';

class ColorFilter implements ClrDatagridFilterInterface<User> {
  allColors = INVENTORY_ITEMS.map((item: User) => item.color)
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort();
  selectedColors: { [color: string]: boolean } = {};
  nbColors = 0;

  private _changes = new Subject<any>();
  // We do not want to expose the Subject itself, but the Observable which is read-only
  get changes(): Observable<any> {
    return this._changes.asObservable();
  }

  listSelected(): string[] {
    const list: string[] = [];
    for (const color in this.selectedColors) {
      if (this.selectedColors[color]) {
        list.push(color);
      }
    }
    return list;
  }

  toggleColor(color: string) {
    this.selectedColors[color] = !this.selectedColors[color];
    if (this.selectedColors[color]) {
      this.nbColors++;
    } else {
      this.nbColors--;
    }
    this._changes.next(true);
  }

  accepts(user: User) {
    return this.nbColors === 0 || this.selectedColors[user.color];
  }

  isActive(): boolean {
    return this.nbColors > 0;
  }
}

@Component({
  selector: 'clr-datagrid-inline-filter-example',
  templateUrl: './inline-filter.example.html',
  styleUrl: './inline-filter.example.scss',
  providers: [Inventory],
  imports: [DatePipe, ClrDatagridModule],
})
export class DatagridInlineFilterExample {
  colorFilter = new ColorFilter();
  users: User[];

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}
