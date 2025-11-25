/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { renderIcon } from '../icon.renderer';
import { IconShapeTuple } from '../interfaces/icon.interfaces';

const icon = {
  outline:
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M6 6H22V10H24V6C24 4.89543 23.1046 4 22 4H6C4.89543 4 4 4.89543 4 6V22C4 23.1046 4.89543 24 6 24H10V22H6V6ZM30 12C31.1046 12 32 12.8954 32 14V30C32 31.1046 31.1046 32 30 32H14C12.8954 32 12 31.1046 12 30V14C12 12.8954 12.8954 12 14 12H30ZM23 23V28H21V23H16V21H21V16H23V21H28V23H23ZM14 30H30V14H14V30Z"/>',
  solid:
    '<path d="M24 6V10H12C10.8954 10 10 10.8954 10 12V24H6C4.89543 24 4 23.1046 4 22V6C4 4.89543 4.89543 4 6 4H22C23.1046 4 24 4.89543 24 6Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M32 14C32 12.8954 31.1046 12 30 12H14C12.8954 12 12 12.8954 12 14V30C12 31.1046 12.8954 32 14 32H30C31.1046 32 32 31.1046 32 30V14ZM28 23H23V28H21V23H16V21H21V16H23V21H28V23Z"/>',
};

export const cloneIconName = 'clone';
export const cloneIcon: IconShapeTuple = [cloneIconName, renderIcon(icon)];
