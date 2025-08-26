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
    '<path d="M6 16C4.9 16 4 16.9 4 18C4 19.1 4.9 20 6 20C7.1 20 8 19.1 8 18C8 16.9 7.1 16 6 16ZM6 8C4.9 8 4 8.9 4 10C4 11.1 4.9 12 6 12C7.1 12 8 11.1 8 10C8 8.9 7.1 8 6 8ZM6 24C4.9 24 4 24.9 4 26C4 27.1 4.9 28 6 28C7.1 28 8 27.1 8 26C8 24.9 7.1 24 6 24ZM31 25H10.02V27H31C31.55 27 32 26.55 32 26C32 25.45 31.55 25 31 25ZM31 17H10.02V19H31C31.55 19 32 18.55 32 18C32 17.45 31.55 17 31 17ZM31.98 10C31.98 9.45 31.53 9 30.98 9H10V11H30.98C31.53 11 31.98 10.55 31.98 10Z"/>',
};

export const bulletListIconName = 'bullet-list';
export const bulletListIcon: IconShapeTuple = [bulletListIconName, renderIcon(icon)];
