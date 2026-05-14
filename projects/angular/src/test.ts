/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import '@cds/core/icon/register';
import 'zone.js';
import 'zone.js/testing';
import 'jasmine-expect';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

document.body.setAttribute('cds-theme', '');

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
  teardown: { destroyAfterEach: false },
});

// Angular 21 changed TestBed's default change-detection scheduler to zoneless.
// Without Zone.js-based CD, fixture.detectChanges() runs an immediate verify-no-changes
// pass that throws NG0100 for components that mutate state in ngAfterViewInit /
// ngAfterContentInit lifecycle hooks.  Restoring Zone.js CD avoids this.
//
// provideZoneChangeDetection was introduced in Angular 17; guard with a runtime feature
// check so tests still pass for Angular 15–16 where the function does not exist.
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
const _ngCore: Record<string, any> = require('@angular/core');
const _provideZoneCD: (() => unknown) | undefined = _ngCore['provideZoneChangeDetection'];
if (typeof _provideZoneCD === 'function') {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TestBed.configureTestingModule({ providers: [_provideZoneCD() as any] });
  });
}
