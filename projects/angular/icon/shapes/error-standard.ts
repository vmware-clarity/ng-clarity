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
    '<path d="M18 22.61C17.4477 22.61 17 22.1623 17 21.61V9.61C17 9.05772 17.4477 8.61 18 8.61C18.5523 8.61 19 9.05772 19 9.61V21.61C19 22.1623 18.5523 22.61 18 22.61Z"/><path d="M19.33 26.06C19.33 26.7945 18.7345 27.39 18 27.39C17.2655 27.39 16.67 26.7945 16.67 26.06C16.67 25.3255 17.2655 24.73 18 24.73C18.7345 24.73 19.33 25.3255 19.33 26.06Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M2 18C2 26.8366 9.16344 34 18 34C22.2435 34 26.3131 32.3143 29.3137 29.3137C32.3143 26.3131 34 22.2435 34 18C34 9.16344 26.8366 2 18 2C9.16344 2 2 9.16344 2 18ZM4 18C4 10.268 10.268 4 18 4C25.732 4 32 10.268 32 18C32 25.732 25.732 32 18 32C10.268 32 4 25.732 4 18Z"/>',
  solid:
    '<path d="M18 2C9.16 2 2 9.16 2 18C2 26.84 9.16 34 18 34C22.24 34 26.31 32.31 29.31 29.31C32.31 26.31 34 22.24 34 18C34 9.16 26.84 2 18 2ZM17 9.61C17 9.06 17.45 8.61 18 8.61C18.55 8.61 19 9.06 19 9.61V21.61C19 22.16 18.55 22.61 18 22.61C17.45 22.61 17 22.16 17 21.61V9.61ZM18 27.26C17.34 27.26 16.8 26.72 16.8 26.06C16.8 25.4 17.34 24.86 18 24.86C18.66 24.86 19.2 25.4 19.2 26.06C19.2 26.72 18.66 27.26 18 27.26Z"/>',
};

export const errorStandardIconName = 'error-standard';
export const errorStandardIcon: IconShapeTuple = [errorStandardIconName, renderIcon(icon)];
