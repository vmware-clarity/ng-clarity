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
    '<path d="M12 27.25C12 27.8 12.45 28.25 13 28.25H30V26.25H13C12.45 26.25 12 26.7 12 27.25ZM6 21.25C6 21.8 6.45 22.25 7 22.25H30V20.25H7C6.45 20.25 6 20.7 6 21.25ZM7 8.25C6.45 8.25 6 8.7 6 9.25C6 9.8 6.45 10.25 7 10.25H30V8.25H7ZM12 15.25C12 15.8 12.45 16.25 13 16.25H30V14.25H13C12.45 14.25 12 14.7 12 15.25Z"/>',
};

export const alignRightIconName = 'align-right';
export const alignRightIcon: IconShapeTuple = [alignRightIconName, renderIcon(icon)];
