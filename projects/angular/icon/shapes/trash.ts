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
    '<path d="M27.98 31C28 31.25 27.92 31.49 27.76 31.68C27.6 31.87 27.37 31.98 27.12 32H8.85C8.6 31.98 8.37 31.87 8.21 31.68C8.05 31.49 7.97 31.25 7.99 31V11.03H5.97V31C5.95 31.78 6.24 32.53 6.78 33.09C7.32 33.65 8.06 33.98 8.85 34H27.12C27.9 33.98 28.65 33.66 29.19 33.09C29.73 32.52 30.02 31.77 30 31V11.03H27.98V31ZM13 12.98V27.98H15.02V12.98H13ZM15 4H21V6H23V4C23 2.9 22.1 2 21 2H15C13.9 2 13 2.9 13 4V6H15V4ZM30.99 6.98H5.01C4.45 6.98 4 7.43 4 7.98C4 8.53 4.45 8.98 5.01 8.98H30.99C31.55 8.98 32 8.53 32 7.98C32 7.43 31.55 6.98 30.99 6.98ZM20.98 12.98V27.98H23V12.98H20.98Z"/>',

  solid:
    '<path d="M15 4H21V6H23V4C23 2.9 22.1 2 21 2H15C13.9 2 13 2.9 13 4V6H15V4ZM30.99 6.98H5.01C4.45 6.98 4 7.43 4 7.98C4 8.53 4.45 8.98 5.01 8.98H30.99C31.55 8.98 32 8.53 32 7.98C32 7.43 31.55 6.98 30.99 6.98ZM5.97 11.03V31C5.95 31.78 6.24 32.53 6.78 33.09C7.32 33.65 8.06 33.98 8.85 34H27.12C27.9 33.98 28.65 33.66 29.19 33.09C29.73 32.52 30.02 31.77 30 31V11.03H5.97ZM20.79 28.82V15H23.21V29H20.79V28.82ZM12.81 28.82V15H15.23V29H12.81V28.82Z"/>',
};

export const trashIconName = 'trash';
export const trashIcon: IconShapeTuple = [trashIconName, renderIcon(icon)];
