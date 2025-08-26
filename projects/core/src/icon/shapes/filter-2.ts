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
    '<path d="M33 11H3C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H33C33.5523 13 34 12.5523 34 12C34 11.4477 33.5523 11 33 11Z"/><path d="M28 17H8C7.44772 17 7 17.4477 7 18C7 18.5523 7.44772 19 8 19H28C28.5523 19 29 18.5523 29 18C29 17.4477 28.5523 17 28 17Z"/><path d="M13 23H23C23.5523 23 24 23.4477 24 24C24 24.5523 23.5523 25 23 25H13C12.4477 25 12 24.5523 12 24C12 23.4477 12.4477 23 13 23Z"/>',
};

export const filter2IconName = 'filter-2';
export const filter2Icon: IconShapeTuple = [filter2IconName, renderIcon(icon)];
