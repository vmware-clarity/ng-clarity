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
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M13 4H30C31.1 4 32 4.9 32 6V30C32 31.1 31.1 32 30 32H13C11.9 32 11 31.1 11 30V22.01H13V30H30V6H11C11 4.9 11.9 4 13 4ZM15.8 19.45C15.71 19.08 15.84 18.7 16.12 18.46L19.5 15H5C4.45 15 4 14.55 4 14C4 13.45 4.45 13 5 13H19.5L16.13 9.7C15.79 9.3 15.81 8.71 16.18 8.34C16.55 7.97 17.14 7.95 17.54 8.29L23.32 14.08L17.53 19.87C17.29 20.16 16.9 20.28 16.54 20.19C16.17 20.1 15.89 19.82 15.8 19.45Z"/>',
  solid:
    '<path d="M30 4H13C11.9 4 11 4.9 11 6V12.95H19.5L16.13 9.65C15.79 9.25 15.81 8.66 16.18 8.29C16.55 7.92 17.14 7.9 17.54 8.24L23.32 14.03L17.53 19.82C17.29 20.11 16.9 20.23 16.54 20.14C16.18 20.05 15.89 19.77 15.8 19.4C15.71 19.03 15.84 18.65 16.12 18.41L19.5 14.95H11V13H5C4.45 13 4 13.45 4 14C4 14.55 4.45 15 5 15H11V30C11 31.1 11.9 32 13 32H30C31.1 32 32 31.1 32 30V6C32 4.9 31.1 4 30 4Z"/>',
};

export const loginIconName = 'login';
export const loginIcon: IconShapeTuple = [loginIconName, renderIcon(icon)];
