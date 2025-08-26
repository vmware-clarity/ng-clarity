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
    '<path d="M33 4H27C26.45 4 26 4.45 26 5V31C26 31.55 26.45 32 27 32H33C33.55 32 34 31.55 34 31V5C34 4.45 33.55 4 33 4ZM32 30H28V6H32V30ZM23.54 17.16L3.54 4.16C3.24 3.96 2.84 3.95 2.52 4.12C2.2 4.29 2 4.63 2 5V31C2 31.37 2.2 31.7 2.52 31.88C2.67 31.96 2.83 32 3 32C3.19 32 3.38 31.95 3.54 31.84L23.54 18.84C23.82 18.66 24 18.34 24 18C24 17.66 23.83 17.35 23.54 17.16ZM4 29.16V6.84L21.17 18L4 29.16Z"/>',
  solid:
    '<path d="M33 4H27C26.45 4 26 4.45 26 5V31C26 31.55 26.45 32 27 32H33C33.55 32 34 31.55 34 31V5C34 4.45 33.55 4 33 4ZM23.54 17.16L3.54 4.16C3.24 3.96 2.84 3.95 2.52 4.12C2.2 4.29 2 4.63 2 5V31C2 31.37 2.2 31.7 2.52 31.88C2.67 31.96 2.83 32 3 32C3.19 32 3.38 31.95 3.54 31.84L23.54 18.84C23.82 18.66 24 18.34 24 18C24 17.66 23.83 17.35 23.54 17.16Z"/>',
};

export const stepForwardIconName = 'step-forward';
export const stepForwardIcon: IconShapeTuple = [stepForwardIconName, renderIcon(icon)];
