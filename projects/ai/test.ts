/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import 'zone.js';
import 'zone.js/testing';

import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

/**
 * ANGULAR 21 MIGRATION CONFIGURATION
 * * Why is this here?
 * In Angular 21, the `TestBed` no longer automatically links Zone.js to the Change Detection Scheduler.
 * Without this provider, `fixture.detectChanges()` runs disconnected from the Zone state, causing
 * `ExpressionChangedAfterItHasBeenCheckedError` (NG0100) in tests that were previously stable.
 * This module explicitly restores the Zone-based scheduler to fix those timing issues.
 */
@NgModule({
  providers: [provideZoneChangeDetection({ eventCoalescing: true })],
})
export class ZoneConfigModule {}

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment([BrowserTestingModule, ZoneConfigModule], platformBrowserTesting(), {
  teardown: { destroyAfterEach: false },
});
