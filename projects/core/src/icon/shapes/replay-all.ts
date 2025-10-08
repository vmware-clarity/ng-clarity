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
    '<path d="M17.99 6L7.76 6.08L10.2 3.68C10.59 3.3 10.59 2.67 10.2 2.29C9.81 1.91 9.18 1.91 8.79 2.29L4 7L8.79 11.71C8.99 11.9 9.24 12 9.5 12C9.76 12 10.01 11.9 10.21 11.71C10.6 11.33 10.6 10.7 10.21 10.32L7.93 8.08L18 8C24.62 8 30 13.38 30 20C30 26.62 24.62 32 18 32C11.38 32 6 26.62 6 20C6 19.45 5.55 19 5 19C4.45 19 4 19.45 4 20C4 27.72 10.28 34 18 34C25.72 34 32 27.72 32 20C32 12.28 25.72 6 17.99 6ZM15 26C15.19 26 15.38 25.95 15.54 25.84L24 20.34C24.28 20.16 24.46 19.84 24.46 19.5C24.46 19.16 24.29 18.85 24 18.66L15.54 13.16C15.23 12.96 14.84 12.95 14.52 13.12C14.2 13.29 14 13.63 14 14V25C14 25.37 14.2 25.7 14.52 25.88C14.67 25.96 14.83 26 15 26ZM16 15.84L21.63 19.5L16 23.16V15.85V15.84Z"/>',
};

export const replayAllIconName = 'replay-all';
export const replayAllIcon: IconShapeTuple = [replayAllIconName, renderIcon(icon)];
