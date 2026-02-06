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
    '<path d="M17 23.72V28H19V23.72C19.6 23.37 20 22.74 20 22C20 20.9 19.1 20 18 20C16.9 20 16 20.9 16 22C16 22.74 16.4 23.38 17 23.72ZM26 14V10C26 5.59 22.41 2 18 2C13.59 2 10 5.59 10 10V14H6V30.9C6 32.61 7.39 34 9.1 34H26.9C28.61 34 30 32.61 30 30.9V14H26ZM12 10C12 6.69 14.69 4 18 4C21.31 4 24 6.69 24 10V14H12V10ZM28 30.9C28 31.51 27.51 32 26.9 32H9.1C8.49 32 8 31.51 8 30.9V16H28V30.9Z"/>',
  solid:
    '<path d="M26 14V10C26 5.59 22.41 2 18 2C13.59 2 10 5.59 10 10V14H6V30.9C6 32.61 7.39 34 9.1 34H26.9C28.61 34 30 32.61 30 30.9V14H26ZM19.2 23.84V28.2H16.8V23.84C16.2 23.45 15.8 22.77 15.8 22C15.8 20.79 16.79 19.8 18 19.8C19.21 19.8 20.2 20.79 20.2 22C20.2 22.77 19.8 23.45 19.2 23.84ZM24 14H12V10C12 6.69 14.69 4 18 4C21.31 4 24 6.69 24 10V14Z"/>',
};

export const lockIconName = 'lock';
export const lockIcon: IconShapeTuple = [lockIconName, renderIcon(icon)];
