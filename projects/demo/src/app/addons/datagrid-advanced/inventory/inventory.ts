/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

import { colors, cpus, events, names, priorities, states, status, usedSpace, users } from './values';

const oneDayMs = 24 * 60 * 60 * 1000;

export interface VmItem {
  // Type for dynamic access to specific properties
  [key: string]: any;
  id: number;
  name: string;
  state: string;
  status: string;
  priority: string;
  usedSpace: string;
  cpus: string;
  creation: string;
  modified: string;
  color: string;
  event: string;
  user: string;
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
        // Offset from status so the two columns do not always match.
        priority: this.getItem(Math.floor(i / 2), priorities),
        color: this.getItem(i, colors),
        usedSpace: this.getItem(i, usedSpace) + ' GHz',
        cpus: this.getItem(i, cpus),
        // Every 4th item was created in the last 60 days, about 3 per week starting today,
        // so Last day / week / month and time spans match rows.
        creation: i % 4 === 0 ? this.getRecentDate((i / 4) * 2.4) : this.getRandomDate(),
        // A date-time with seconds, 37 seconds apart going back from now, for filters with seconds.
        modified: this.getRecentDateTime(i * 37),
        event: this.getItem(i, events),
        user: this.getItem(i, users),
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

  private getRecentDateTime(secondsAgo: number): string {
    // Same date format as Created, plus the time with seconds, e.g. "November 13, 2026 01:23:15 PM".
    // Date.parse reads it back, which the demo's date filter relies on.
    const date = new Date(Date.now() - secondsAgo * 1000);
    const day = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `${day} ${time}`;
  }

  private getRecentDate(daysAgo: number): string {
    const date = new Date(Date.now() - daysAgo * oneDayMs);
    return this.getRandomDate(date, date);
  }

  private getRandomDate(startDate = new Date('January 1, 2000'), endDate = new Date()): string {
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
