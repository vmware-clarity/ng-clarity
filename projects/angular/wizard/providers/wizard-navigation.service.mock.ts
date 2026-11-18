/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { signal } from '@angular/core';

import { MockPage } from '../wizard-page.mock';

// Signal-backed like WizardNavigationService, so OnPush views refresh when a spec changes it.
export class NavServiceMock {
  private readonly _currentPage = signal<MockPage>(undefined);
  private readonly _currentPageIsLast = signal(false);
  private readonly _currentPageIsFirst = signal(false);
  private readonly _wizardStopNavigation = signal(false);
  private readonly _wizardDisableStepnav = signal(false);

  get currentPage(): MockPage {
    return this._currentPage();
  }
  set currentPage(value: MockPage) {
    this._currentPage.set(value);
  }

  get currentPageIsLast(): boolean {
    return this._currentPageIsLast();
  }
  set currentPageIsLast(value: boolean) {
    this._currentPageIsLast.set(value);
  }

  get currentPageIsFirst(): boolean {
    return this._currentPageIsFirst();
  }
  set currentPageIsFirst(value: boolean) {
    this._currentPageIsFirst.set(value);
  }

  get wizardStopNavigation(): boolean {
    return this._wizardStopNavigation();
  }
  set wizardStopNavigation(value: boolean) {
    this._wizardStopNavigation.set(value);
  }

  get wizardDisableStepnav(): boolean {
    return this._wizardDisableStepnav();
  }
  set wizardDisableStepnav(value: boolean) {
    this._wizardDisableStepnav.set(value);
  }
}
