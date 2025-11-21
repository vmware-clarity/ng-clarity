/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { renderIcon } from '../icon.renderer';
import { IconShapeTuple } from '../interfaces/icon.interfaces';

const icon = {
  outline:
    '<path d="M33 18C33.55 18 34 17.55 34 17C34 16.45 33.55 16 33 16H28V8H33C33.55 8 34 7.55 34 7C34 6.45 33.55 6 33 6H8V3C8 2.45 7.55 2 7 2C6.45 2 6 2.45 6 3V6H3C2.45 6 2 6.45 2 7C2 7.55 2.45 8 3 8H6V33C6 33.55 6.45 34 7 34C7.55 34 8 33.55 8 33V28H16V33C16 33.55 16.45 34 17 34C17.55 34 18 33.55 18 33V28H26V33C26 33.55 26.45 34 27 34C27.55 34 28 33.55 28 33V28H33C33.55 28 34 27.55 34 27C34 26.45 33.55 26 33 26H28V18H33ZM16 26H8V18H16V26ZM16 16H8V8H16V16ZM26 26H18V18H26V26ZM26 16H18V8H26V16Z"/>',
};

export const tableIconName = 'table';
export const tableIcon: IconShapeTuple = [tableIconName, renderIcon(icon)];
