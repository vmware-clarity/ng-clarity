/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

import { colors, cpus, names, states, status, usedSpace } from './values';

export interface VmItem {
  // Type for dynamic access to specific properties
  [key: string]: any;
  id: number;
  name: string;
  state: string;
  status: string;
  usedSpace: string;
  cpus: string;
  creation: string;
  color: string;
}

@Injectable()
export class Inventory {
  size = 100;
  latency = 0;

  #allItems: VmItem[];
  #currentQuery: VmItem[];

  get allItems(): VmItem[] {
    return this.#allItems.slice();
  }

  reset() {
    this.#allItems = [];
    for (let i = 0; i < this.size; i++) {
      this.#allItems.push({
        id: i + 10000,
        name: this.getItem(i, names),
        state: this.getItem(i, states),
        status: this.getItem(i, status),
        color: this.getItem(i, colors),
        usedSpace: this.getItem(i, usedSpace) + ' GHz',
        cpus: this.getItem(i, cpus),
        creation: this.getRandomDate(),
      });
    }
  }

  filter(filters?: { [key: string]: string[] }): Inventory {
    this.checkCurrentQuery();
    if (filters) {
      for (const key in filters) {
        if (filters[key].length === 0) {
          continue;
        }

        let getFilterProperty = (user: VmItem) => '' + user[key];
        if (key === 'pokemon') {
          getFilterProperty = (user: VmItem) => user.pokemon;
        }

        const lowerCase = filters[key].map(value => value.toLowerCase());
        this.#currentQuery = this.#currentQuery.filter(user => {
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

  fetch$(skip = 0, limit: number = this.#currentQuery.length): Observable<FetchResult> {
    // Stringify and parse to mimic new object creation like a real HTTP request
    const items = JSON.stringify(this.#currentQuery.slice(skip, skip + limit));
    const result: FetchResult = { vms: JSON.parse(items), length: this.#currentQuery.length };
    this.#currentQuery = null;
    return from(this.fakeHttp(result));
  }

  private checkCurrentQuery() {
    if (!this.#currentQuery) {
      this.#currentQuery = this.allItems.slice();
    }
  }

  // Used by an iterator to pull an item out of an array in a repeatable way.
  private getItem<T>(num: number, array: T[]): T {
    return array[num % array.length];
  }

  private getRandomDate(startDate = new Date('January 1, 2000'), endDate = new Date('September 18, 2024')): string {
    const startMillis = startDate.getTime();
    const endMillis = endDate.getTime();
    const randomMillis = startMillis + Math.random() * (endMillis - startMillis);
    const randomDate = new Date(randomMillis);

    return randomDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private fakeHttp<T>(result: T): Promise<T> {
    return new Promise(resolve => {
      setTimeout(() => resolve(result), this.latency);
    });
  }
}

export interface FetchResult {
  vms: VmItem[];
  length: number;
}
