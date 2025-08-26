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
    '<path d="M33.44 4.1C33.1 3.93 32.69 3.97 32.39 4.2L21 12.91V5C21 4.62 20.78 4.27 20.44 4.1C20.1 3.93 19.69 3.97 19.39 4.2L2.39 17.21C2.14 17.4 2 17.69 2 18C2 18.31 2.15 18.61 2.39 18.79L19.39 31.79C19.57 31.93 19.78 32 20 32C20.15 32 20.3 31.97 20.44 31.9C20.78 31.73 21 31.38 21 31V23.08L32.39 31.79C32.69 32.02 33.1 32.06 33.44 31.89C33.78 31.72 34 31.37 34 30.99V5C34 4.62 33.78 4.27 33.44 4.1ZM32 28.97L20.61 20.26C20.31 20.03 19.9 19.99 19.56 20.16C19.22 20.33 19 20.68 19 21.06V28.98L4.65 18L19 7.02V14.94C19 15.32 19.22 15.67 19.56 15.84C19.9 16.01 20.31 15.97 20.61 15.74L32 7.02V28.97Z"/>',
  solid:
    '<path d="M33.44 4.1C33.1 3.93 32.69 3.97 32.39 4.2L21 12.91V5C21 4.62 20.78 4.27 20.44 4.1C20.1 3.93 19.69 3.97 19.39 4.2L2.39 17.21C2.14 17.4 2 17.69 2 18C2 18.31 2.15 18.61 2.39 18.79L19.39 31.79C19.57 31.93 19.78 32 20 32C20.15 32 20.3 31.97 20.44 31.9C20.78 31.73 21 31.38 21 31V23.08L32.39 31.79C32.69 32.02 33.1 32.06 33.44 31.89C33.78 31.72 34 31.37 34 30.99V5C34 4.62 33.78 4.27 33.44 4.1Z"/>',
};

export const rewindIconName = 'rewind';
export const rewindIcon: IconShapeTuple = [rewindIconName, renderIcon(icon)];
