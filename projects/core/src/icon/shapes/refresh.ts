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
    '<path d="M22 13C22 13.55 22.45 14 23 14H34V3C34 2.45 33.55 2 33 2C32.45 2 32 2.45 32 3V10.25C29.21 5.23 23.86 2 18 2C9.18 2 2 9.18 2 18C2 26.82 9.18 34 18 34C24.82 34 30.9 29.67 33.13 23.22C33.31 22.7 33.03 22.13 32.51 21.95C31.99 21.77 31.42 22.05 31.24 22.57C29.29 28.21 23.97 32 18 32C10.28 32 4 25.72 4 18C4 10.28 10.28 4 18 4C23.42 4 28.35 7.17 30.65 12H23C22.45 12 22 12.45 22 13Z"/>',
};

export const refreshIconName = 'refresh';
export const refreshIcon: IconShapeTuple = [refreshIconName, renderIcon(icon)];
