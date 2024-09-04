/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { pxToRem, updateElementStyles } from './css.js';
import { isNilOrEmpty, isNumericString, isString } from './identity.js';

export function isTshirtSize(size: string) {
  return ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'].indexOf(size) > -1;
}

export function updateEquilateralSizeStyles(el: HTMLElement, size: string) {
  if (!isString(size) || isNilOrEmpty(size) || isTshirtSize(size)) {
    updateElementStyles(el, ['width', ''], ['height', '']);
  } else if (isNumericString(size)) {
    const val = pxToRem(parseInt(size));
    updateElementStyles(el, ['width', val], ['height', val]);
  }
}
