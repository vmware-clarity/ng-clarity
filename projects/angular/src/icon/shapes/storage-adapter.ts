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
    '<path d="M22 20H28V18H22V20ZM18 22H12V24H19C19.27 24 19.52 23.89 19.71 23.71C19.9 23.53 20 23.27 20 23V14H18V22ZM33.12 10.88C32.56 10.32 31.79 10 31 10H8V6H3C2.73 6 2.48 6.11 2.29 6.29C2.1 6.47 2 6.73 2 7C2 7.27 2.11 7.52 2.29 7.71C2.47 7.9 2.73 8 3 8H6V29C6 29.27 6.11 29.52 6.29 29.71C6.47 29.9 6.73 30 7 30C7.27 30 7.52 29.89 7.71 29.71C7.9 29.53 8 29.27 8 29V28H31C31.8 28 32.56 27.68 33.12 27.12C33.68 26.56 34 25.79 34 25V13C34 12.2 33.68 11.44 33.12 10.88ZM32 25C32 25.27 31.89 25.52 31.71 25.71C31.53 25.9 31.27 26 31 26H8V12H31C31.27 12 31.52 12.11 31.71 12.29C31.9 12.47 32 12.73 32 13V25ZM22 16H28V14H22V16Z"/>',
};

export const storageAdapterIconName = 'storage-adapter';
export const storageAdapterIcon: IconShapeTuple = [storageAdapterIconName, renderIcon(icon)];
