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
    '<path d="M16 11C16 10.45 15.55 10 15 10H10V5C10 4.45 9.55 4 9 4C8.45 4 8 4.45 8 5V10H3C2.45 10 2 10.45 2 11C2 11.55 2.45 12 3 12H8V17C8 17.55 8.45 18 9 18C9.55 18 10 17.55 10 17V12H15C15.55 12 16 11.55 16 11ZM12 19C12 19.55 12.45 20 13 20H33C33.55 20 34 19.55 34 19C34 18.45 33.55 18 33 18H13C12.45 18 12 18.45 12 19ZM27 30H13C12.45 30 12 30.45 12 31C12 31.55 12.45 32 13 32H27C27.55 32 28 31.55 28 31C28 30.45 27.55 30 27 30ZM33 24H13C12.45 24 12 24.45 12 25C12 25.55 12.45 26 13 26H33C33.55 26 34 25.55 34 25C34 24.45 33.55 24 33 24Z"/>',
};

export const addTextIconName = 'add-text';
export const addTextIcon: IconShapeTuple = [addTextIconName, renderIcon(icon)];
