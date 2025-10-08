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
    '<path d="M6 18C6 12.13 10.2 7.15 15.98 6.17C16.65 6.06 17.33 6 18 6C21.45 6 24.66 7.48 26.92 10H21C20.45 10 20 10.45 20 11C20 11.55 20.45 12 21 12H30V3C30 2.45 29.55 2 29 2C28.45 2 28 2.45 28 3V8.24C25.39 5.56 21.82 4 18 4C17.21 4 16.42 4.07 15.64 4.2C8.9 5.34 4 11.15 4 18C4 18.39 4.02 18.77 4.05 19.15C4.09 19.67 4.53 20.07 5.05 20.07C5.08 20.07 5.1 20.07 5.13 20.07C5.68 20.03 6.09 19.54 6.05 18.99C6.02 18.66 6.01 18.34 6.01 18H6ZM31.96 16.95C31.92 16.4 31.44 15.99 30.89 16.03C30.34 16.07 29.93 16.55 29.97 17.1C29.99 17.4 30 17.7 30 18C30 24.62 24.62 30 18 30C14.55 30 11.33 28.52 9.07 26H15C15.55 26 16 25.55 16 25C16 24.45 15.55 24 15 24H6V33C6 33.55 6.45 34 7 34C7.55 34 8 33.55 8 33V27.76C10.61 30.44 14.18 32 18 32C25.72 32 32 25.72 32 18C32 17.65 31.99 17.29 31.96 16.95Z"/>',
};

export const syncIconName = 'sync';
export const syncIcon: IconShapeTuple = [syncIconName, renderIcon(icon)];
