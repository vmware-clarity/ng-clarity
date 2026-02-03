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
    '<path d="M15.0312 24H5.03125C4.48125 24 4.03125 24.45 4.03125 25C4.03125 25.55 4.48125 26 5.03125 26H15.0312C15.5813 26 16.0312 25.55 16.0312 25C16.0312 24.45 15.5813 24 15.0312 24ZM27.0312 8H5.03125C4.48125 8 4.03125 8.45 4.03125 9C4.03125 9.55 4.48125 10 5.03125 10H27.0312C27.5812 10 28.0312 9.55 28.0312 9C28.0312 8.45 27.5812 8 27.0312 8ZM21.0312 16H5.03125C4.48125 16 4.03125 16.45 4.03125 17C4.03125 17.55 4.48125 18 5.03125 18H21.0312C21.5812 18 22.0312 17.55 22.0312 17C22.0312 16.45 21.5812 16 21.0312 16Z"/>',
};

export const sortByIconName = 'sort-by';
export const sortByIcon: IconShapeTuple = [sortByIconName, renderIcon(icon)];
