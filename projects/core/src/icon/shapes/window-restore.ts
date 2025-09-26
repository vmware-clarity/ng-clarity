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
    '<path d="M14 8H28C29.1046 8 30 8.89543 30 10V20C30 21.1046 29.1046 22 28 22H26V20H28V10H14V12H12V10C12 8.89543 12.8954 8 14 8Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M22 14H8C6.89543 14 6 14.8954 6 16V26C6 27.1046 6.89543 28 8 28H22C23.1046 28 24 27.1046 24 26V16C24 14.8954 23.1046 14 22 14ZM8 26V16H22V26H8Z"/>',
};

export const windowRestoreIconName = 'window-restore';
export const windowRestoreIcon: IconShapeTuple = [windowRestoreIconName, renderIcon(icon)];
