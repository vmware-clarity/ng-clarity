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
    '<path d="M29.9999 17H18.9999V6C18.9999 5.44772 18.5522 5 17.9999 5C17.4476 5 16.9999 5.44772 16.9999 6V17H5.99992C5.44764 17 4.99992 17.4477 4.99992 18C4.98994 18.263 5.09427 18.5174 5.286 18.6976C5.47773 18.8778 5.73809 18.9662 5.99992 18.94H16.9999V30C16.9999 30.5523 17.4476 31 17.9999 31C18.5522 31 18.9999 30.5523 18.9999 30V19H29.9999C30.5522 19 30.9999 18.5523 30.9999 18C30.9999 17.4477 30.5522 17 29.9999 17Z"/>',
};

export const plusIconName = 'plus';
export const plusIcon: IconShapeTuple = [plusIconName, renderIcon(icon)];
