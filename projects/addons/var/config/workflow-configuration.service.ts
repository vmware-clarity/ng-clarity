/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

@Injectable()
export class WorkflowConfigurationService {
  private readonly debugLocalStorageKey = 'appfx.debug';
  private readonly localStorage: LocalStorage | undefined;
  private debugValue: boolean;

  constructor() {
    this.localStorage = this.getLocalStorage(window);
    this.debugValue = this.getData(this.debugLocalStorageKey, false);
  }

  get debug(): boolean {
    return this.debugValue;
  }
  set debug(newValue: boolean) {
    this.debugValue = newValue;
  }

  private getData<T>(key: string, defaultValue: T): T {
    if (this.localStorage) {
      let data: any = this.localStorage.getItem(key);
      if (data) {
        data = JSON.parse(data);
        return <T>data;
      }
    }
    return defaultValue;
  }

  private getLocalStorage(window: any): LocalStorage | undefined {
    try {
      if (window.localStorage) {
        return window.localStorage;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_ignored) {
      // swallow exception
    }
    return undefined;
  }
}

interface LocalStorage {
  getItem(key: string): string;
}
