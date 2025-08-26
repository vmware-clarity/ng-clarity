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
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M7.89014 9H27.8901C28.9947 9 29.8901 9.89543 29.8901 11V25C29.8901 26.1046 28.9947 27 27.8901 27H7.89014C6.78557 27 5.89014 26.1046 5.89014 25V11C5.89014 9.89543 6.78557 9 7.89014 9ZM7.89014 11V25H27.8901V11H7.89014Z"/>',
};

export const windowMaxIconName = 'window-max';
export const windowMaxIcon: IconShapeTuple = [windowMaxIconName, renderIcon(icon)];
