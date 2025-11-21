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
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M28 2H8C6.89543 2 6 2.89543 6 4V32C6 33.1046 6.89543 34 8 34H28C29.1046 34 30 33.1046 30 32V4C30 2.89543 29.1046 2 28 2ZM25.67 8H12V11.67H10V7C10 6.44772 10.4477 6 11 6H25.67V8ZM18 16H16V18H20V14H18V16ZM16 22H18V20H20V24H16V22ZM12 26V28H10V30H14V26H12ZM16 28H18V26H20V30H16V28ZM22 28H24V26H26V30H22V28ZM24 22H22V24H26V20H24V22ZM10 24V22H12V20H14V24H10ZM22 16H24V14H26V18H22V16ZM12 14V16H10V18H14V14H12ZM8 4V32H28V4H8Z"/>',
  solid:
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M28 2H8C6.89543 2 6 2.89543 6 4V32C6 33.1046 6.89543 34 8 34H28C29.1046 34 30 33.1046 30 32V4C30 2.89543 29.1046 2 28 2ZM12 28H10V26H12V28ZM10 22H12V20H10V22ZM12 16H10V14H12V16ZM17 28H19V26H17V28ZM19 22H17V20H19V22ZM17 16H19V14H17V16ZM26 28H24V26H26V28ZM24 22H26V20H24V22ZM26 16H24V14H26V16ZM10 9H26V5H10V9Z"/>',
};

export const calculatorIconName = 'calculator';
export const calculatorIcon: IconShapeTuple = [calculatorIconName, renderIcon(icon)];
