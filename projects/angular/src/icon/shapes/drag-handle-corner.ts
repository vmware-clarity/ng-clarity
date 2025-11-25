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
    '<path d="M10 24C8.9 24 8 24.9 8 26C8 27.1 8.9 28 10 28C11.1 28 12 27.1 12 26C12 24.9 11.1 24 10 24ZM18 24C16.9 24 16 24.9 16 26C16 27.1 16.9 28 18 28C19.1 28 20 27.1 20 26C20 24.9 19.1 24 18 24ZM26 12C27.1 12 28 11.1 28 10C28 8.9 27.1 8 26 8C24.9 8 24 8.9 24 10C24 11.1 24.9 12 26 12ZM26 16C24.9 16 24 16.9 24 18C24 19.1 24.9 20 26 20C27.1 20 28 19.1 28 18C28 16.9 27.1 16 26 16ZM26 24C24.9 24 24 24.9 24 26C24 27.1 24.9 28 26 28C27.1 28 28 27.1 28 26C28 24.9 27.1 24 26 24ZM18 16C16.9 16 16 16.9 16 18C16 19.1 16.9 20 18 20C19.1 20 20 19.1 20 18C20 16.9 19.1 16 18 16Z"/>',
};

export const dragHandleCornerIconName = 'drag-handle-corner';
export const dragHandleCornerIcon: IconShapeTuple = [dragHandleCornerIconName, renderIcon(icon)];
