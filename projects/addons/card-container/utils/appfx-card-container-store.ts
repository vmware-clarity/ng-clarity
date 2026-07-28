/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Observable, of } from 'rxjs';

import { AppfxCardSettings, AppfxContainerPersistenceStore } from '../appfx-card-container.interface';

/**
 * Handles storing and retrieving of preferences of the container
 * like order, hidden properties of card
 */
export class AppfxCardContainerStore {
  private readonly localStorage: LocalStorage | undefined;

  constructor() {
    this.localStorage = this.getLocalStorage(window);
  }

  getLocalStore(key: string): AppfxContainerPersistenceStore {
    const retrieve = (): Observable<AppfxCardSettings[]> => {
      return this.getData(key);
    };

    const save = (cards: AppfxCardSettings[]): void => {
      this.setData(key, cards);
    };

    return {
      retrieve,
      save,
    };
  }

  private getLocalStorage(window: any): LocalStorage | undefined {
    try {
      if (window.localStorage) {
        return window.localStorage;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (ignored) {
      // ignored
    }
    return undefined;
  }

  /**
   * Retrieving data from the local storage.
   * @param key the key to the local storage data
   * @returns the object being saved in the local storage,
   *         Note that the stored data is converted through angular.fromJson()
   */
  private getData(key: string): Observable<AppfxCardSettings[]> {
    if (this.localStorage) {
      let data: any = this.localStorage.getItem(key);
      if (data) {
        data = JSON.parse(data);
        return of(data);
      }
    }
    return of([]);
  }

  /**
   * Setting data into the local storage.
   * @param key the key to the local storage data
   * @param data to be stored
   */
  private setData(key: string, cards: AppfxCardSettings[]) {
    const data = JSON.stringify(cards);
    if (this.localStorage) {
      try {
        this.localStorage.setItem(key, data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (ignored) {
        // ignored
      }
    }
  }
}

interface LocalStorage {
  getItem(key: string): string;

  setItem(key: string, data: string): void;
}
