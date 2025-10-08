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
    '<path d="M4 15H6V13H4V15ZM4 21H6V19H4V21ZM4 27H6V25H4V27ZM9 9H31C31.55 9 32 8.55 32 8C32 7.45 31.55 7 31 7H9C8.45 7 8 7.45 8 8C8 8.55 8.45 9 9 9ZM31 25H9C8.45 25 8 25.45 8 26C8 26.55 8.45 27 9 27H31C31.55 27 32 26.55 32 26C32 25.45 31.55 25 31 25ZM4 9H6V7H4V9ZM31 13H9C8.45 13 8 13.45 8 14C8 14.55 8.45 15 9 15H31C31.55 15 32 14.55 32 14C32 13.45 31.55 13 31 13ZM31 19H9C8.45 19 8 19.45 8 20C8 20.55 8.45 21 9 21H31C31.55 21 32 20.55 32 20C32 19.45 31.55 19 31 19Z"/>',
};

export const viewListIconName = 'view-list';
export const viewListIcon: IconShapeTuple = [viewListIconName, renderIcon(icon)];
