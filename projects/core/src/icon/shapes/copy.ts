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
    '<path d="M26 4H28C28 2.9 27.1 2 26 2H6C4.9 2 4 2.9 4 4V28C4 29.1 4.9 30 6 30V4H26ZM30 6H10C8.9 6 8 6.9 8 8V32C8 33.1 8.9 34 10 34H30C31.1 34 32 33.1 32 32V8C32 6.9 31.1 6 30 6ZM10 32V8H30V32H10Z"/>',

  solid:
    '<path d="M31 6H9C8.45 6 8 6.45 8 7V33C8 33.55 8.45 34 9 34H31C31.55 34 32 33.55 32 33V7C32 6.45 31.55 6 31 6ZM26 4H28C28 2.9 27.1 2 26 2H6C4.9 2 4 2.9 4 4V28C4 29.1 4.9 30 6 30V4H26Z"/>',
};

export const copyIconName = 'copy';
export const copyIcon: IconShapeTuple = [copyIconName, renderIcon(icon)];
