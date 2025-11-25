/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Subject } from 'rxjs';

const stateUpdates = new Subject<any>();
(stateUpdates as any).listener = document.addEventListener('CDS_STATE_UPDATE', (e: any) => stateUpdates.next(e.detail));

export interface CDSGlobal {
  _isStateProxied: boolean;
  _state: Readonly<CDSState>;
  getDetails: () => any;
  logDetails: () => void;
}

export interface CDSState {
  iconRegistry: Readonly<Record<string, unknown>>;
}

declare global {
  interface Window {
    CDS: CDSGlobal;
  }
}

export class GlobalStateService {
  static stateUpdates = stateUpdates.asObservable();

  static get state(): CDSState {
    this.setupCDSGlobal();
    return window.CDS._state as CDSState;
  }

  static getValue(key: keyof CDSState) {
    return GlobalStateService.state[key];
  }

  static setValue(key: keyof CDSState, val: CDSState[keyof CDSState]) {
    GlobalStateService.state[key] = val as any;
  }

  static log() {
    console.log(JSON.stringify(GlobalStateService.state, null, 2));
  }

  static setupCDSGlobal() {
    // eslint-disable-next-line eqeqeq
    if (window != null) {
      this.initializeCDSGlobal();
      this.intializeCDSStateProxy();
    }
  }

  static initializeCDSGlobal() {
    window.CDS = window.CDS || {
      _isStateProxied: false,
      _state: {
        iconRegistry: {},
      },
      getDetails: this.getDetails,
      logDetails: this.logDetails,
    };
  }

  static intializeCDSStateProxy() {
    if (!window.CDS._isStateProxied) {
      window.CDS._isStateProxied = true;
      window.CDS._state = new Proxy(window.CDS._state, {
        set: (target: any, key: string, value) => {
          const detail = { key, prev: (window.CDS._state as any)[key], current: value };
          target[key] = value;
          document.dispatchEvent(new CustomEvent('CDS_STATE_UPDATE', { detail }));
          return true;
        },
      });
    }
  }

  static getDetails() {
    return {
      state: {
        ...window.CDS._state,
        iconRegistry: Object.keys(window.CDS._state.iconRegistry),
      },
    };
  }

  static logDetails() {
    console.log(JSON.stringify(this.getDetails(), null, 2));
  }
}
