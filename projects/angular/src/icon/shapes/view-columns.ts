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
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M31 5H5C3.89543 5 3 5.89543 3 7V29C3 30.1046 3.89543 31 5 31H31C32.1046 31 33 30.1046 33 29V7C33 5.89543 32.1046 5 31 5ZM13 29H5V7H13V29ZM15 29H23V7H15V29Z"/>',
};

export const viewColumnsIconName = 'view-columns';
export const viewColumnsIcon: IconShapeTuple = [viewColumnsIconName, renderIcon(icon)];
