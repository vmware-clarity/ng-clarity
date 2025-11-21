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
    '<path d="M2 18C2 26.84 9.16 34 18 34C22.24 34 26.31 32.31 29.31 29.31C32.31 26.31 34 22.24 34 18C34 9.16 26.84 2 18 2C9.16 2 2 9.16 2 18ZM4 18C4 10.27 10.27 4 18 4C25.73 4 32 10.27 32 18C32 25.73 25.73 32 18 32C10.27 32 4 25.73 4 18ZM21 25H19V14H16C15.45 14 15 14.45 15 15C15 15.55 15.45 16 16 16H17V25H15C14.45 25 14 25.45 14 26C14 26.55 14.45 27 15 27H21C21.55 27 22 26.55 22 26C22 25.45 21.55 25 21 25ZM19.37 10.45C19.37 11.22 18.74 11.85 17.97 11.85C17.2 11.85 16.57 11.22 16.57 10.45C16.57 9.68 17.2 9.05 17.97 9.05C18.74 9.05 19.37 9.68 19.37 10.45Z"/>',
  solid:
    '<path d="M18 2C9.16 2 2 9.16 2 18C2 26.84 9.16 34 18 34C22.24 34 26.31 32.31 29.31 29.31C32.31 26.31 34 22.24 34 18C34 9.16 26.84 2 18 2ZM17.97 8.85C18.85 8.85 19.57 9.57 19.57 10.45C19.57 11.33 18.85 12.05 17.97 12.05C17.09 12.05 16.37 11.33 16.37 10.45C16.37 9.57 17.09 8.85 17.97 8.85ZM21 27.2H15C14.34 27.2 13.8 26.66 13.8 26C13.8 25.34 14.34 24.8 15 24.8H16.8V16.2H16C15.34 16.2 14.8 15.66 14.8 15C14.8 14.34 15.34 13.8 16 13.8H19.2V24.8H21C21.66 24.8 22.2 25.34 22.2 26C22.2 26.66 21.66 27.2 21 27.2Z"/>',
};

export const infoStandardIconName = 'info-standard';
export const infoStandardIcon: IconShapeTuple = [infoStandardIconName, renderIcon(icon)];
