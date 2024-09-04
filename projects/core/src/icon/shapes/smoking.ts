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
    '<path d="M30 15C29.45 15 29 14.55 29 14C29 12.3 29.66 11.39 30.19 10.66C30.66 10.01 31 9.55 31 8.5C31 7.45 30.66 6.98 30.19 6.34C29.66 5.61 29 4.7 29 3C29 2.45 29.45 2 30 2C30.55 2 31 2.45 31 3C31 4.05 31.34 4.52 31.81 5.16C32.34 5.89 33 6.8 33 8.5C33 10.2 32.34 11.11 31.81 11.84C31.34 12.49 31 12.95 31 14C31 14.55 30.55 15 30 15Z"/><path d="M8 23C7.45 23 7 22.55 7 22V18C7 17.45 7.45 17 8 17C8.55 17 9 17.45 9 18V22C9 22.55 8.55 23 8 23Z"/><path d="M23.13 19H30V21H25.13L27.13 23H31C31.55 23 32 22.55 32 22V18C32 17.45 31.55 17 31 17H21.13L23.13 19Z"/><path d="M26.21 21H4V19H23.88L21.88 17H3C2.45 17 2 17.45 2 18V22C2 22.55 2.45 23 3 23H28.21L26.21 21Z"/>',
  solid:
    '<path d="M30 15C29.45 15 29 14.55 29 14C29 12.3 29.66 11.39 30.19 10.66C30.66 10.01 31 9.55 31 8.5C31 7.45 30.66 6.98 30.19 6.34C29.66 5.61 29 4.7 29 3C29 2.45 29.45 2 30 2C30.55 2 31 2.45 31 3C31 4.05 31.34 4.52 31.81 5.16C32.34 5.89 33 6.8 33 8.5C33 10.2 32.34 11.11 31.81 11.84C31.34 12.49 31 12.95 31 14C31 14.55 30.55 15 30 15Z"/><path d="M8 23C7.45 23 7 22.55 7 22V18C7 17.45 7.45 17 8 17C8.55 17 9 17.45 9 18V22C9 22.55 8.55 23 8 23Z"/><path d="M23.13 19H30V21H25.13L27.13 23H31C31.55 23 32 22.55 32 22V18C32 17.45 31.55 17 31 17H21.13L23.13 19Z"/><path d="M26.21 21H4V19H23.88L21.88 17H3C2.45 17 2 17.45 2 18V22C2 22.55 2.45 23 3 23H28.21L26.21 21Z"/><path d="M31 18H8V22H31V18Z"/>',
};

export const smokingIconName = 'smoking';
export const smokingIcon: IconShapeTuple = [smokingIconName, renderIcon(icon)];
