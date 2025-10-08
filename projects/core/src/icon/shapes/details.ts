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
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M4 6H32C33.1046 6 34 6.89543 34 8V28C34 29.1046 33.1046 30 32 30H4C2.89543 30 2 29.1046 2 28V8C2 6.89543 2.89543 6 4 6ZM9 18H27C27.5523 18 28 17.5523 28 17C28 16.4477 27.5523 16 27 16H9C8.44772 16 8 16.4477 8 17C8 17.5523 8.44772 18 9 18ZM9 22H19C19.5523 22 20 21.5523 20 21C20 20.4477 19.5523 20 19 20H9C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22ZM32 28H4V8H32V28ZM27 14H9C8.44772 14 8 13.5523 8 13C8 12.4477 8.44772 12 9 12H27C27.5523 12 28 12.4477 28 13C28 13.5523 27.5523 14 27 14Z"/>',
  solid:
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M4 6H32C33.1046 6 34 6.89543 34 8V28C34 29.1046 33.1046 30 32 30H4C2.89543 30 2 29.1046 2 28V8C2 6.89543 2.89543 6 4 6ZM9 22H19C19.5523 22 20 21.5523 20 21C20 20.4477 19.5523 20 19 20H9C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22ZM27 18H9C8.44772 18 8 17.5523 8 17C8 16.4477 8.44772 16 9 16H27C27.5523 16 28 16.4477 28 17C28 17.5523 27.5523 18 27 18ZM9 14H27C27.5523 14 28 13.5523 28 13C28 12.4477 27.5523 12 27 12H9C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14Z"/>',
};

export const detailsIconName = 'details';
export const detailsIcon: IconShapeTuple = [detailsIconName, renderIcon(icon)];
