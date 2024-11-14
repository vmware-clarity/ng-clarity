/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { InjectionToken } from '@angular/core';

let nbTabsComponent = 0;

export const TABS_ID = new InjectionToken<number>('TABS_ID');

export function tokenFactory() {
  return 'clr-tabs-' + nbTabsComponent++;
}

export const TABS_ID_PROVIDER = {
  provide: TABS_ID,
  useFactory: tokenFactory,
};
