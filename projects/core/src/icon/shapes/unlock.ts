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
    '<path d="M13 23.72V28H15V23.72C15.6 23.37 16 22.74 16 22C16 20.9 15.1 20 14 20C12.9 20 12 20.9 12 22C12 22.74 12.4 23.38 13 23.72ZM26 2C21.59 2 18 5.59 18 10V14H2V30.9C2 32.61 3.39 34 5.1 34H22.9C24.61 34 26 32.61 26 30.9V14H20V10C20 6.69 22.69 4 26 4C29.31 4 32 6.69 32 10V16H34V10C34 5.59 30.41 2 26 2ZM24 16V30.9C24 31.51 23.51 32 22.9 32H5.1C4.49 32 4 31.51 4 30.9V16H24Z"/>',
  solid:
    '<path d="M26 2C21.59 2 18 5.59 18 10V14H2V30.9C2 32.61 3.39 34 5.1 34H22.9C24.61 34 26 32.61 26 30.9V14H20V10C20 6.69 22.69 4 26 4C29.31 4 32 6.69 32 10V16H34V10C34 5.59 30.41 2 26 2ZM15.2 23.84V28.2H12.8V23.84C12.2 23.45 11.8 22.77 11.8 22C11.8 20.79 12.79 19.8 14 19.8C15.21 19.8 16.2 20.79 16.2 22C16.2 22.77 15.8 23.45 15.2 23.84Z"/>',
};

export const unlockIconName = 'unlock';
export const unlockIcon: IconShapeTuple = [unlockIconName, renderIcon(icon)];
