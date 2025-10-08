/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { renderIcon } from '../icon.renderer.js';
import { IconShapeTuple } from '../interfaces/icon.interfaces.js';

const icon = {
  outline:
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M6 4H24V3C24 2.44772 23.5523 2 23 2H5C4.44772 2 4 2.44772 4 3V25C4 25.5523 4.44772 26 5 26H6V4ZM10 8H28V7C28 6.44772 27.5523 6 27 6H9C8.44772 6 8 6.44772 8 7V29C8 29.5523 8.44772 30 9 30H10V8ZM28 24H16V26H28V24ZM16 20H28V22H16V20ZM13 34H31C31.5523 34 32 33.5523 32 33V11C32 10.4477 31.5523 10 31 10H13C12.4477 10 12 10.4477 12 11V33C12 33.5523 12.4477 34 13 34ZM14 32H30V12H14V32ZM28 16H16V18H28V16Z"/>',
  solid:
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M6 4V26H5C4.44772 26 4 25.5523 4 25V3C4 2.44772 4.44772 2 5 2H23C23.5523 2 24 2.44772 24 3V4H6ZM10 8V30H9C8.44772 30 8 29.5523 8 29V7C8 6.44772 8.44772 6 9 6H27C27.5523 6 28 6.44772 28 7V8H10ZM31 10H13C12.4477 10 12 10.4477 12 11V33C12 33.5523 12.4477 34 13 34H31C31.5523 34 32 33.5523 32 33V11C32 10.4477 31.5523 10 31 10ZM16 26H28V24H16V26ZM28 22H16V20H28V22ZM16 18H28V16H16V18Z"/>',
};

export const fileGroupIconName = 'file-group';
export const fileGroupIcon: IconShapeTuple = [fileGroupIconName, renderIcon(icon)];
