/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { renderIcon } from '../icon.renderer';
import { IconShapeTuple } from '../interfaces/icon.interfaces';

const icon = {
  outline:
    '<path d="M29 24C27.41 24 26 24.76 25.09 25.93L11.81 19.29C11.92 18.88 12 18.45 12 18C12 17.55 11.92 17.13 11.81 16.71L25.09 10.07C26.01 11.23 27.41 12 29 12C31.76 12 34 9.76 34 7C34 4.24 31.76 2 29 2C26.24 2 24 4.24 24 7C24 7.45 24.08 7.87 24.19 8.29L10.91 14.93C9.99 13.77 8.59 13 7 13C4.24 13 2 15.24 2 18C2 20.76 4.24 23 7 23C8.59 23 10 22.24 10.91 21.07L24.19 27.71C24.08 28.12 24 28.55 24 29C24 31.76 26.24 34 29 34C31.76 34 34 31.76 34 29C34 26.24 31.76 24 29 24ZM29 4C30.65 4 32 5.35 32 7C32 8.65 30.65 10 29 10C27.35 10 26 8.65 26 7C26 5.35 27.35 4 29 4ZM7 21C5.35 21 4 19.65 4 18C4 16.35 5.35 15 7 15C8.65 15 10 16.35 10 18C10 19.65 8.65 21 7 21ZM29 32C27.35 32 26 30.65 26 29C26 27.35 27.35 26 29 26C30.65 26 32 27.35 32 29C32 30.65 30.65 32 29 32Z"/>',
  solid:
    '<path d="M29 24C27.41 24 26 24.76 25.09 25.93L11.81 19.29C11.92 18.88 12 18.45 12 18C12 17.55 11.92 17.13 11.81 16.71L25.09 10.07C26.01 11.23 27.41 12 29 12C31.76 12 34 9.76 34 7C34 4.24 31.76 2 29 2C26.24 2 24 4.24 24 7C24 7.45 24.08 7.87 24.19 8.29L10.91 14.93C9.99 13.77 8.59 13 7 13C4.24 13 2 15.24 2 18C2 20.76 4.24 23 7 23C8.59 23 10 22.24 10.91 21.07L24.19 27.71C24.08 28.12 24 28.55 24 29C24 31.76 26.24 34 29 34C31.76 34 34 31.76 34 29C34 26.24 31.76 24 29 24Z"/>',
};

export const shareIconName = 'share';
export const shareIcon: IconShapeTuple = [shareIconName, renderIcon(icon)];
