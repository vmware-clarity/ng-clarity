/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js';
import 'zone.js/testing';
import 'jasmine-expect';
import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

document.body.setAttribute('cds-theme', '');

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

/**
 * Clarity animates with native CSS animations and transitions. They are switched off for the test runs, so that
 * specs can assert on the layout right after a change detection instead of waiting for a transition to complete
 * (Angular's `TestBed` already disables its `animate.enter` / `animate.leave` and the Clarity animation callbacks).
 */
const noAnimationsStyle = document.createElement('style');
noAnimationsStyle.textContent = `*, *::before, *::after { animation: none !important; transition: none !important; }`;
document.head.appendChild(noAnimationsStyle);

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment([BrowserTestingModule, ZoneConfigModule], platformBrowserTesting(), {
  teardown: { destroyAfterEach: false },
});
