/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { renderIcon } from '../icon.renderer';
import { IconShapeTuple } from '../interfaces/icon.interfaces';

const icon = {
  outline: '<path d="M18,30.66,7,24.33V11.67L18,5.34l11,6.33V24.33ZM9,23.18l9,5.17,9-5.17V12.82L18,7.65,9,12.82Z"/>',
};

export const nodeIconName = 'node';
export const nodeIcon: IconShapeTuple = [nodeIconName, renderIcon(icon)];
