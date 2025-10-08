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
    '<path d="M27 27H9C8.44772 27 8 26.5523 8 26C8 25.4477 8.44772 25 9 25H27C27.5523 25 28 25.4477 28 26C28 26.5523 27.5523 27 27 27Z"/>',
};

export const windowMinIconName = 'window-min';
export const windowMinIcon: IconShapeTuple = [windowMinIconName, renderIcon(icon)];
