/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import 'zone.js';
import 'zone.js/testing';

import { getTestBed, TestEnvironmentOptions } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// // Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
// declare let __karma__: any;

const testConfig: TestEnvironmentOptions = {
  // Enable more strict rules, which are disabled by default.
  // See: https://github.com/angular/angular/issues/36430
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
};

getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), testConfig);
