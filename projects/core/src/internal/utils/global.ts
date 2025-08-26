/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LogService } from '../services/log.service.js';
import { isBrowser } from './environment.js';
import { getAngularVersion } from './framework.js';
import { browserFeatures, FeatureSupportMatrix } from './supports.js';

export interface CDSGlobal {
  _version: string[];
  _react: { version: string }; // set by @cds/react
  _supports: FeatureSupportMatrix;
  _isStateProxied: boolean;
  _state: Readonly<CDSState>;
  getDetails: () => any;
  logDetails: () => void;
  environment: {
    /** Set to true for production env to disable dev time logging and tooling */
    production: boolean;
  };
}

export interface CDSState {
  layerElements: Readonly<HTMLElement[]>;
  elementRegistry: Readonly<{ [key: string]: any }>;
  iconRegistry: Readonly<Record<string, unknown>>;
}

declare global {
  interface Window {
    CDS: CDSGlobal;
  }
}

export function setupCDSGlobal() {
  if (isBrowser()) {
    initializeCDSGlobal();
    setRunningVersion();
    intializeCDSStateProxy();
  }
}

function intializeCDSStateProxy() {
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

function getDetails() {
  return {
    versions: window.CDS._version,
    environment: window.CDS.environment,
    userAgent: navigator.userAgent,
    supports: window.CDS._supports,
    angularVersion: getAngularVersion(false),
    state: {
      ...window.CDS._state,
      iconRegistry: Object.keys(window.CDS._state.iconRegistry),
    },
  };
}

function logDetails() {
  LogService.log(JSON.stringify(getDetails(), null, 2));
}

function initializeCDSGlobal() {
  window.CDS = window.CDS || {
    _version: [],
    _react: { version: undefined },
    _supports: browserFeatures.supports,
    _isStateProxied: false,
    _state: {
      layerElements: [],
      elementRegistry: {},
      iconRegistry: {},
    },
    environment: {
      production: false,
    },
    getDetails,
    logDetails,
  };
}

function setRunningVersion() {
  const loadedVersion = 'PACKAGE_VERSION';
  if (window.CDS._version.indexOf(loadedVersion) < 0) {
    window.CDS._version.push(loadedVersion);
    document.querySelector('body')?.setAttribute('cds-version', window.CDS._version.join(' '));
  }

  if (window.CDS._version.length > 1) {
    LogService.warn(
      'Running more than one version of Clarity can cause unexpected issues. Please ensure only one version is loaded.'
    );
  }
}
