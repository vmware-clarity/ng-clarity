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
    '<path d="M31.45 17.11L5.45 4.11002C5.14 3.95002 4.77 3.97002 4.47 4.15002C4.18 4.33002 4 4.65002 4 5.00002V31C4 31.35 4.18 31.67 4.47 31.85C4.63 31.95 4.81 32 5 32C5.15 32 5.31 31.96 5.45 31.89L31.45 18.89C31.79 18.72 32 18.37 32 18C32 17.63 31.79 17.28 31.45 17.11ZM6 29.38V6.62002L28.76 18L6 29.38Z"/>',
  solid:
    '<path d="M31.45 17.11L5.45 4.11002C5.14 3.95002 4.77 3.97002 4.47 4.15002C4.18 4.33002 4 4.65002 4 5.00002V31C4 31.35 4.18 31.67 4.47 31.85C4.63 31.95 4.81 32 5 32C5.15 32 5.31 31.96 5.45 31.89L31.45 18.89C31.79 18.72 32 18.37 32 18C32 17.63 31.79 17.28 31.45 17.11Z"/>',
};

export const playIconName = 'play';
export const playIcon: IconShapeTuple = [playIconName, renderIcon(icon)];
