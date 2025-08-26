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
    '<path d="M30 3C30 2.45 29.55 2 29 2H7C6.45 2 6 2.45 6 3V4H30V3ZM32 7C32 6.45 31.55 6 31 6H5C4.45 6 4 6.45 4 7V8H32V7ZM9 20C10.66 20 12 18.66 12 17C12 15.34 10.66 14 9 14C7.34 14 6 15.34 6 17C6 17.8 6.32 18.56 6.88 19.12C7.44 19.68 8.21 20 9 20ZM9 15.4C9.65 15.38 10.25 15.76 10.51 16.36C10.77 16.96 10.64 17.65 10.19 18.12C9.74 18.59 9.04 18.73 8.44 18.48C7.84 18.24 7.44 17.65 7.44 17C7.44 16.13 8.13 15.42 9 15.4ZM32.12 10H3.88C2.84 10 2 10.84 2 11.88V32.12C2 33.16 2.84 34 3.88 34H32.12C33.16 34 34 33.16 34 32.12V11.88C34 10.84 33.16 10 32.12 10ZM32 32H4V12H32V32ZM13.9 24L17.08 27.18L14.26 30H16.26L23.72 22.54L30 28.77V26.77L24.2 21C23.92 20.73 23.48 20.73 23.2 21L18.04 26.16L14.37 22.5C14.09 22.23 13.65 22.23 13.37 22.5L5.92 30H7.9L13.9 24Z"/>',
  solid:
    '<path d="M30 3C30 2.45 29.55 2 29 2H7C6.45 2 6 2.45 6 3V4H30V3ZM32.12 10H3.88C2.84 10 2 10.84 2 11.88V32.12C2 33.16 2.84 34 3.88 34H32.12C33.16 34 34 33.16 34 32.12V11.88C34 10.84 33.16 10 32.12 10ZM9 14C10.66 14 12 15.34 12 17C12 18.66 10.66 20 9 20C8.2 20 7.44 19.68 6.88 19.12C6.32 18.56 6 17.79 6 17C6 15.34 7.34 14 9 14ZM30 30H5.92L13.37 22.5C13.65 22.23 14.09 22.23 14.37 22.5L18.04 26.16L23.2 21C23.48 20.73 23.92 20.73 24.2 21L30 26.77V30ZM32 7C32 6.45 31.55 6 31 6H5C4.45 6 4 6.45 4 7V8H32V7Z"/>',
};

export const imageGalleryIconName = 'image-gallery';
export const imageGalleryIcon: IconShapeTuple = [imageGalleryIconName, renderIcon(icon)];
