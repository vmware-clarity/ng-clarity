/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DatagridLocalStorageService {
  readonly #localStorage: Storage;

  constructor() {
    this.#localStorage = window.localStorage;
  }

  getUserDataSync(key: string): unknown {
    return this.getData(key + this.getUsername());
  }

  setUserData(key: string, data: unknown): void {
    this.setData(key + this.getUsername(), data);
  }

  getData(key: string): unknown {
    let data = this.#localStorage?.getItem(key);
    if (data) {
      data = JSON.parse(data);
      return data;
    }
    return null;
  }

  setData(key: string, data: unknown): void {
    const dataString = JSON.stringify(data);
    if (this.#localStorage) {
      try {
        this.#localStorage.setItem(key, dataString);
      } catch (e) {
        console.log(e);
        // ignore case of mobile browser or safari incognito mode where localStorage is not fully supported
      }
    }
  }

  private getUsername(): Observable<string> {
    return of('administrator');
  }
}
