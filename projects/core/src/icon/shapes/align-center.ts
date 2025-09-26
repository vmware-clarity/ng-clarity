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
    '<path d="M27 26H9C8.45 26 8 26.45 8 27C8 27.55 8.45 28 9 28H27C27.55 28 28 27.55 28 27C28 26.45 27.55 26 27 26ZM5 10H31C31.55 10 32 9.55 32 9C32 8.45 31.55 8 31 8H5C4.45 8 4 8.45 4 9C4 9.55 4.45 10 5 10ZM27 14H9C8.45 14 8 14.45 8 15C8 15.55 8.45 16 9 16H27C27.55 16 28 15.55 28 15C28 14.45 27.55 14 27 14ZM31 20H5C4.45 20 4 20.45 4 21C4 21.55 4.45 22 5 22H31C31.55 22 32 21.55 32 21C32 20.45 31.55 20 31 20Z"/>',
};

export const alignCenterIconName = 'align-center';
export const alignCenterIcon: IconShapeTuple = [alignCenterIconName, renderIcon(icon)];
