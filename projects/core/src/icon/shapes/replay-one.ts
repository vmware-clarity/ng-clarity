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
    '<path d="M17.99 6L7.76 6.08L10.2 3.68C10.59 3.3 10.59 2.67 10.2 2.29C9.81 1.91 9.18 1.91 8.79 2.29L4 7L8.79 11.71C8.99 11.9 9.24 12 9.5 12C9.76 12 10.01 11.9 10.21 11.71C10.6 11.33 10.6 10.7 10.21 10.32L7.93 8.08L18 8C24.62 8 30 13.38 30 20C30 26.62 24.62 32 18 32C11.38 32 6 26.62 6 20C6 19.45 5.55 19 5 19C4.45 19 4 19.45 4 20C4 27.72 10.28 34 18 34C25.72 34 32 27.72 32 20C32 12.28 25.72 6 17.99 6ZM17.99 28C18.54 28 18.99 27.55 18.99 27V13C18.99 12.65 18.81 12.33 18.52 12.15C18.23 11.97 17.86 11.95 17.55 12.11L13.55 14.11C13.06 14.36 12.86 14.96 13.1 15.45C13.35 15.94 13.95 16.14 14.44 15.9L16.99 14.62V27C16.99 27.55 17.44 28 17.99 28Z"/>',
};

export const replayOneIconName = 'replay-one';
export const replayOneIcon: IconShapeTuple = [replayOneIconName, renderIcon(icon)];
