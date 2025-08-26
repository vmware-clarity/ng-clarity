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
    '<path d="M31 26.75H5C4.45 26.75 4 27.2 4 27.75C4 28.3 4.45 28.75 5 28.75H31C31.55 28.75 32 28.3 32 27.75C32 27.2 31.55 26.75 31 26.75ZM5 10.75H31C31.55 10.75 32 10.3 32 9.75C32 9.2 31.55 8.75 31 8.75H5C4.45 8.75 4 9.2 4 9.75C4 10.3 4.45 10.75 5 10.75ZM31 14.75H5C4.45 14.75 4 15.2 4 15.75C4 16.3 4.45 16.75 5 16.75H31C31.55 16.75 32 16.3 32 15.75C32 15.2 31.55 14.75 31 14.75ZM31 20.75H5C4.45 20.75 4 21.2 4 21.75C4 22.3 4.45 22.75 5 22.75H31C31.55 22.75 32 22.3 32 21.75C32 21.2 31.55 20.75 31 20.75Z"/>',
};

export const justifyTextIconName = 'justify-text';
export const justifyTextIcon: IconShapeTuple = [justifyTextIconName, renderIcon(icon)];
