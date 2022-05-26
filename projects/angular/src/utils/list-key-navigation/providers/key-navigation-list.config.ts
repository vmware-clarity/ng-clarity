/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { InjectionToken, ValueProvider } from '@angular/core';

export const CLR_LIST_KEY_NAVIGATION_CONFIG = new InjectionToken('ClrListKeyNavigationConfig');

export const CLR_LIST_KEY_NAVIGATION_COFNIG_PROVIDER: ValueProvider = {
  provide: CLR_LIST_KEY_NAVIGATION_CONFIG,
  useValue: {
    keyListItems: 'keyListItems',
    layout: 'vertical',
    manageFocus: true,
    manageTabindex: true,
    loop: false,
    dir: null,
  },
};
