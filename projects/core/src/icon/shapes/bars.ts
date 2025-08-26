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
    '<path d="M32 9H4C3.44772 9 3 8.55228 3 8C3 7.44772 3.44772 7 4 7H32C32.5523 7 33 7.44772 33 8C33 8.55228 32.5523 9 32 9Z"/><path d="M32 19H4C3.44772 19 3 18.5523 3 18C3 17.4477 3.44772 17 4 17H32C32.5523 17 33 17.4477 33 18C33 18.5523 32.5523 19 32 19Z"/><path d="M4 29H32C32.5523 29 33 28.5523 33 28C33 27.4477 32.5523 27 32 27H4C3.44772 27 3 27.4477 3 28C3 28.5523 3.44772 29 4 29Z"/>',
};

export const barsIconName = 'bars';
export const barsIcon: IconShapeTuple = [barsIconName, renderIcon(icon)];
