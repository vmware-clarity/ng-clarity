/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import 'zone.js';
import 'zone.js/testing';
import * as ngCore from '@angular/core';
import { getTestBed, TestBed, TestEnvironmentOptions } from '@angular/core/testing';
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

// Angular 21 changed TestBed's default change-detection scheduler to zoneless.
// Without Zone.js-based CD, fixture.detectChanges() runs an immediate verify-no-changes
// pass that throws NG0100 for components that mutate state in ngAfterViewInit /
// ngAfterContentInit lifecycle hooks.  Restoring Zone.js CD avoids this.
//
// provideZoneChangeDetection was introduced in Angular 17; guard with a runtime feature
// check so tests still pass for Angular 15–16 where the function does not exist.
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any, @typescript-eslint/no-var-requires
const _ngCore: Record<string, any> = ngCore;
const _provideZoneCD: (() => unknown) | undefined = _ngCore['provideZoneChangeDetection'];
if (typeof _provideZoneCD === 'function') {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TestBed.configureTestingModule({ providers: [_provideZoneCD() as any] });
  });
}
