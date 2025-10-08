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
    '<path d="M26 17H10C9.44772 17 9 17.4477 9 18C9 18.5523 9.44772 19 10 19H26C26.5523 19 27 18.5523 27 18C27 17.4477 26.5523 17 26 17Z"/>',
};

export const minusIconName = 'minus';
export const minusIcon: IconShapeTuple = [minusIconName, renderIcon(icon)];
