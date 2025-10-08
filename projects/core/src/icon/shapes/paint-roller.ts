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
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M29 10.75V4.75C29 3.65 28.1 2.75 27 2.75H6C4.9 2.75 4 3.65 4 4.75V10.75C4 11.85 4.9 12.75 6 12.75H27C28.1 12.75 29 11.85 29 10.75ZM6 4.75H27V10.75H6V4.75ZM31 6.75H30V13.04L16.7 17.29C16.27 17.43 15.98 17.84 16 18.29V19.75H14V32.75C14 33.85 14.9 34.75 16 34.75H18C19.1 34.75 20 33.85 20 32.75V19.75H18V19.02L31.3 14.75C31.73 14.61 32.02 14.2 32 13.75V7.75C32 7.2 31.55 6.75 31 6.75ZM18 32.75H16V21.75H18V32.75Z"/>',
  solid:
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M29 10.75V4.75C29 3.65 28.1 2.75 27 2.75H6C4.9 2.75 4 3.65 4 4.75V10.75C4 11.85 4.9 12.75 6 12.75H27C28.1 12.75 29 11.85 29 10.75ZM31 6.75H30V13.04L16.7 17.29C16.27 17.43 15.98 17.84 16 18.29V19.75H14V32.75C14 33.85 14.9 34.75 16 34.75H18C19.1 34.75 20 33.85 20 32.75V19.75H18V19.02L31.3 14.75C31.73 14.61 32.02 14.2 32 13.75V7.75C32 7.2 31.55 6.75 31 6.75Z"/>',
};

export const paintRollerIconName = 'paint-roller';
export const paintRollerIcon: IconShapeTuple = [paintRollerIconName, renderIcon(icon)];
