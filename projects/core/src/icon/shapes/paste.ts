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
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M24 22V6C24 4.89543 23.1046 4 22 4H6C4.89543 4 4 4.89543 4 6V22C4 23.1046 4.89543 24 6 24H22C23.1046 24 24 23.1046 24 22ZM6 6H22V22H6V6Z"/><path d="M12 26H14V30H18V32H14C12.8954 32 12 31.1046 12 30V26Z"/><path d="M20 30H26V32H20V30Z"/><path d="M28 30H30V26H32V30C32 31.1046 31.1046 32 30 32H28V30Z"/><path d="M30 18H32V24H30V18Z"/><path d="M26 12H30C31.1046 12 32 12.8954 32 14V16H30V14H26V12Z"/>',
  solid:
    '<path d="M4 6C4 4.89543 4.89543 4 6 4H22C23.1046 4 24 4.89543 24 6V22C24 23.1046 23.1046 24 22 24H6C4.89543 24 4 23.1046 4 22V6Z"/><path d="M12 26H14V30H18V32H14C12.8954 32 12 31.1046 12 30V26Z"/><path d="M26 30H20V32H26V30Z"/><path d="M26 12H30C31.1046 12 32 12.8954 32 14V16H30V14H26V12Z"/><path d="M30 18H32V24H30V18Z"/><path d="M28 30H30V26H32V30C32 31.1046 31.1046 32 30 32H28V30Z"/>',
};

export const pasteIconName = 'paste';
export const pasteIcon: IconShapeTuple = [pasteIconName, renderIcon(icon)];
