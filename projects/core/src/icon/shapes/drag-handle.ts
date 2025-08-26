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
    '<path d="M14 24C12.9 24 12 24.9 12 26C12 27.1 12.9 28 14 28C15.1 28 16 27.1 16 26C16 24.9 15.1 24 14 24ZM22 12C23.1 12 24 11.1 24 10C24 8.9 23.1 8 22 8C20.9 8 20 8.9 20 10C20 11.1 20.9 12 22 12ZM14 16C12.9 16 12 16.9 12 18C12 19.1 12.9 20 14 20C15.1 20 16 19.1 16 18C16 16.9 15.1 16 14 16ZM22 16C20.9 16 20 16.9 20 18C20 19.1 20.9 20 22 20C23.1 20 24 19.1 24 18C24 16.9 23.1 16 22 16ZM14 8C12.9 8 12 8.9 12 10C12 11.1 12.9 12 14 12C15.1 12 16 11.1 16 10C16 8.9 15.1 8 14 8ZM22 24C20.9 24 20 24.9 20 26C20 27.1 20.9 28 22 28C23.1 28 24 27.1 24 26C24 24.9 23.1 24 22 24Z"/>',
};

export const dragHandleIconName = 'drag-handle';
export const dragHandleIcon: IconShapeTuple = [dragHandleIconName, renderIcon(icon)];
