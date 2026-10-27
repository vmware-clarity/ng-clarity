/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import INVENTORY_ITEMS from './inventory-items.json';
import { User } from './user';
import { COLORS, NAMES, POKEMONS } from './values';

@Injectable()
export class Inventory {
  size = 100;
  generatedCount = 0;
  latency = 0;

  private _all: User[] = [];
  private _currentQuery: User[] | undefined;
  private allVirtualScrollUsers = new BehaviorSubject<User[]>(this.all);

  get all(): User[] {
    return this._all;
  }
  set all(value) {
    this._all = value;
  }

  getAllUsersSubject() {
    return this.allVirtualScrollUsers;
  }

  reset(useInventory: boolean = true) {
    if (useInventory) {
      this._all = INVENTORY_ITEMS.slice(0, this.size).map((user: User) => ({
        ...user,
        creation: new Date(user.creation),
      }));
    } else {
      this._all = [];
      this._all = this._all.concat(this.createUsers());
    }
  }

  createUsers(size = this.size, startCount = this.generatedCount) {
    const newData: User[] = [];

    for (let i = 0; i < size; i++) {
      newData.push({
        wins: Math.floor(Math.random() * 100),
        id: startCount + i,
        name: this.getItem(i, NAMES),
        creation: new Date(Date.now() * Math.random()),
        color: this.getItem(i, COLORS),
        pokemon: this.getItem(i, POKEMONS),
        expanded: false,
      });
    }

    this.generatedCount += size;

    return newData;
  }

  lazyLoadUsers(size = this.size) {
    this.all = [...this._all, ...this.createUsers(size)];

    this.allVirtualScrollUsers.next(this.all);
  }

  filter(filters: { [key: string]: string[] }): Inventory {
    this._checkCurrentQuery();
    if (filters) {
      for (const key in filters) {
        if (filters[key].length === 0) {
          continue;
        }

        let getFilterProperty = (user: User) => '' + user[key];
        if (key === 'pokemon') {
          getFilterProperty = (user: User) => user.pokemon.name;
        }

        const lowerCase = filters[key].map(value => value.toLowerCase());
        this._currentQuery = this._currentQuery?.filter(user => {
          for (const value of lowerCase) {
            if (getFilterProperty(user).toLowerCase().indexOf(value) >= 0) {
              return true;
            }
          }
          return false;
        });
      }
    }
    return this;
  }

  sort(sort: { by: string; reverse: boolean } | undefined): Inventory {
    this._checkCurrentQuery();
    if (sort && sort.by) {
      let getSortProperty = (user: User) => user[sort.by];
      if (sort.by === 'pokemon') {
        getSortProperty = (user: User) => user.pokemon.number;
      }

      this._currentQuery?.sort((a, b) => {
        let comp = 0;
        const propA = getSortProperty(a),
          propB = getSortProperty(b);
        if (propA < propB) {
          comp = -1;
        } else if (propA > propB) {
          comp = 1;
        }
        if (sort.reverse) {
          comp = -comp;
        }
        return comp;
      });
    }
    return this;
  }

  fetch(skip = 0, limit: number = this._currentQuery?.length || 0): Promise<FetchResult> {
    this._checkCurrentQuery();
    // Stringify and parse to mimic new object creation like a real HTTP request
    const items = JSON.stringify(this._currentQuery?.slice(skip, skip + limit));
    const result: FetchResult = { users: JSON.parse(items), length: this._currentQuery?.length || 0 };
    this._currentQuery = undefined;
    return this._fakeHttp(result);
  }

  // Used by an iterator to pull an item out of an array in a repeatable way.
  private getItem<T>(num: number, array: T[]): T {
    return array[num % array.length];
  }

  private _checkCurrentQuery() {
    if (!this._currentQuery) {
      this._currentQuery = this._all.slice();
    }
  }

  private _fakeHttp<T>(result: T): Promise<T> {
    return new Promise(resolve => {
      setTimeout(() => resolve(result), this.latency);
    });
  }
}

export interface FetchResult {
  users: User[];
  length: number;
}
