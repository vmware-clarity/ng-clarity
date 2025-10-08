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
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M21 32H6C4.9 32 4 31.1 4 30V6C4 4.9 4.9 4 6 4H21C22.1 4 23 4.9 23 6V14H21V6H6V30H23C23 31.1 22.1 32 21 32ZM25.22 15.81C25.59 15.72 25.97 15.85 26.21 16.13L32 21.92L26.22 27.71C25.82 28.05 25.23 28.03 24.86 27.66C24.49 27.29 24.47 26.7 24.81 26.3L28.18 23H15C14.45 23 14 22.55 14 22C14 21.45 14.45 21 15 21H28.18L24.8 17.54C24.51 17.3 24.39 16.91 24.48 16.55C24.57 16.18 24.85 15.9 25.22 15.81Z"/>',
  solid:
    '<path d="M14 22C14 21.45 14.45 21 15 21H23V6C23 4.9 22.1 4 21 4H6C4.9 4 4 4.9 4 6V30C4 31.1 4.9 32 6 32H21C22.1 32 23 31.1 23 30V23H15C14.45 23 14 22.55 14 22ZM26.21 16.13C25.97 15.84 25.58 15.72 25.22 15.81C24.86 15.9 24.57 16.18 24.48 16.55C24.39 16.92 24.52 17.3 24.8 17.54L28.18 21H23V23H28.18L24.81 26.3C24.47 26.7 24.49 27.29 24.86 27.66C25.23 28.03 25.82 28.05 26.22 27.71L32 21.92L26.21 16.13Z"/>',
};

export const logoutIconName = 'logout';
export const logoutIcon: IconShapeTuple = [logoutIconName, renderIcon(icon)];
