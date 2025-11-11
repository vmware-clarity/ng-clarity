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
    '<path d="M13 4.5C12.45 4.5 12 4.95 12 5.5V27.5C12 28.05 12.45 28.5 13 28.5C13.55 28.5 14 28.05 14 27.5V5.5C14 4.95 13.55 4.5 13 4.5ZM9 4.5C8.45 4.5 8 4.95 8 5.5V27.5C8 28.05 8.45 28.5 9 28.5C9.55 28.5 10 28.05 10 27.5V5.5C10 4.95 9.55 4.5 9 4.5ZM5 4.5C4.45 4.5 4 4.95 4 5.5V31.5C4 32.05 4.45 32.5 5 32.5C5.55 32.5 6 32.05 6 31.5V5.5C6 4.95 5.55 4.5 5 4.5ZM17 4.5C16.45 4.5 16 4.95 16 5.5V27.5C16 28.05 16.45 28.5 17 28.5C17.55 28.5 18 28.05 18 27.5V5.5C18 4.95 17.55 4.5 17 4.5ZM31 4.5C30.45 4.5 30 4.95 30 5.5V31.5C30 32.05 30.45 32.5 31 32.5C31.55 32.5 32 32.05 32 31.5V5.5C32 4.95 31.55 4.5 31 4.5ZM27 4.5C26.45 4.5 26 4.95 26 5.5V27.5C26 28.05 26.45 28.5 27 28.5C27.55 28.5 28 28.05 28 27.5V5.5C28 4.95 27.55 4.5 27 4.5ZM21 4.5C20.45 4.5 20 4.95 20 5.5V27.5C20 28.05 20.45 28.5 21 28.5C21.55 28.5 22 28.05 22 27.5V5.5C22 4.95 21.55 4.5 21 4.5Z"/>',
};

export const barCodeIconName = 'bar-code';
export const barCodeIcon: IconShapeTuple = [barCodeIconName, renderIcon(icon)];
