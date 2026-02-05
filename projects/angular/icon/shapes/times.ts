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
    '<path d="M19.4696 17.9732L27.7596 9.70542C28.0994 9.30972 28.0765 8.71987 27.7071 8.35148C27.3378 7.9831 26.7463 7.96032 26.3496 8.29919L18.0596 16.567L9.76958 8.28922C9.37745 7.89814 8.7417 7.89814 8.34958 8.28922C7.95745 8.68029 7.95745 9.31434 8.34958 9.70542L16.6496 17.9732L8.34958 26.241C8.0642 26.4848 7.93989 26.8675 8.02777 27.2318C8.11564 27.5961 8.40086 27.8806 8.76616 27.9682C9.13146 28.0559 9.51519 27.9319 9.75958 27.6473L18.0596 19.3795L26.3496 27.6473C26.7463 27.9861 27.3378 27.9634 27.7071 27.595C28.0765 27.2266 28.0994 26.6367 27.7596 26.241L19.4696 17.9732Z"/>',
};

export const timesIconName = 'times';
export const timesIcon: IconShapeTuple = [timesIconName, renderIcon(icon)];
