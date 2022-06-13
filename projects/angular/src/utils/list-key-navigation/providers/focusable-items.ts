/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { InjectionToken, ValueProvider } from '@angular/core';

export const FOCUSABLE_ELEMENT_SELECTORS = new InjectionToken('FocusableElements');

export const FOCUSABLE_ELEMENT_SELECTORS_PROVIDER: ValueProvider = {
  provide: FOCUSABLE_ELEMENT_SELECTORS,
  useValue: [
    'a[href]',
    'area[href]',
    'input:not([disabled])',
    'button:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'iframe',
    'object',
    'embed',
    '*[tabindex]', // -1 tabindex is a focusable element and needed for keyboard navigation
    '*[contenteditable=true]',
    '[role=button]:not([disabled])',
  ],
};
