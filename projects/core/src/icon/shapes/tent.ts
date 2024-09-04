/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { renderIcon } from '../icon.renderer.js';
import { IconShapeTuple } from '../interfaces/icon.interfaces.js';

const icon = {
  outline:
    '<path d="M4.56004 32C4.39004 32 4.21004 31.96 4.05004 31.86C3.58004 31.58 3.42004 30.96 3.70004 30.49L19.14 4.48998C19.42 4.01998 20.04 3.85998 20.51 4.13998C20.98 4.41998 21.14 5.03998 20.86 5.50998L5.42004 31.51C5.23004 31.82 4.90004 32 4.56004 32Z"/><path d="M31.44 32C31.1 32 30.77 31.83 30.58 31.51L15.14 5.50998C14.86 5.02998 15.02 4.41998 15.49 4.13998C15.96 3.85998 16.58 4.00998 16.86 4.48998L32.3 30.49C32.58 30.97 32.42 31.58 31.95 31.86C31.79 31.95 31.61 32 31.44 32Z"/><path d="M33 32H3C2.45 32 2 31.55 2 31C2 30.45 2.45 30 3 30H33C33.55 30 34 30.45 34 31C34 31.55 33.55 32 33 32Z"/><path d="M14.54 28L18 22L21.46 28H23.77L18.86 19.5C18.5 18.88 17.48 18.88 17.13 19.5L12.22 28H14.53H14.54Z"/>',
  solid:
    '<path d="M33 30H32.01L19.16 8.36998L20.86 5.50998C21.14 5.02998 20.98 4.41998 20.51 4.13998C20.04 3.85998 19.42 4.01998 19.14 4.48998L18 6.40998L16.86 4.48998C16.58 4.01998 15.96 3.85998 15.49 4.13998C15.02 4.41998 14.86 5.03998 15.14 5.50998L16.84 8.36998L3.99 30H3C2.45 30 2 30.45 2 31C2 31.55 2.45 32 3 32H33C33.55 32 34 31.55 34 31C34 30.45 33.55 30 33 30ZM21.46 28L18 22L14.54 28H12.23L17.14 19.5C17.5 18.88 18.52 18.88 18.87 19.5L23.78 28H21.47H21.46Z"/>',
};

export const tentIconName = 'tent';
export const tentIcon: IconShapeTuple = [tentIconName, renderIcon(icon)];
