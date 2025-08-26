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
    '<path d="M30 3C30 2.45 29.55 2 29 2H7C6.45 2 6 2.45 6 3V4H30V3ZM32 7C32 6.45 31.55 6 31 6H5C4.45 6 4 6.45 4 7V8H32V7ZM32.12 10H3.88C2.84 10 2 10.84 2 11.88V32.12C2 33.16 2.84 34 3.88 34H32.12C33.16 34 34 33.16 34 32.12V11.88C34 10.84 33.16 10 32.12 10ZM32 32H4V12H32V32ZM12.45 27.83C12.62 27.94 12.81 28 13 28C13.13 28 13.26 27.97 13.38 27.92L25.38 22.92C25.75 22.76 26 22.4 26 22C26 21.6 25.76 21.23 25.38 21.08L13.38 16.08C13.07 15.95 12.72 15.98 12.44 16.17C12.16 16.36 11.99 16.67 11.99 17V27C11.99 27.33 12.16 27.65 12.44 27.83H12.45ZM14 18.5L22.4 22L14 25.5V18.5Z"/>',
  solid:
    '<path d="M30 3C30 2.45 29.55 2 29 2H7C6.45 2 6 2.45 6 3V4H30V3ZM32 7C32 6.45 31.55 6 31 6H5C4.45 6 4 6.45 4 7V8H32V7ZM32.12 10H3.88C2.84 10 2 10.84 2 11.88V32.12C2 33.16 2.84 34 3.88 34H32.12C33.16 34 34 33.16 34 32.12V11.88C34 10.84 33.16 10 32.12 10ZM25.38 22.92L13.38 27.92C13.26 27.97 13.13 28 13 28C12.81 28 12.61 27.94 12.45 27.83C12.17 27.64 12 27.33 12 27V17C12 16.67 12.17 16.35 12.45 16.17C12.73 15.98 13.08 15.95 13.39 16.08L25.39 21.08C25.76 21.24 26.01 21.6 26.01 22C26.01 22.4 25.77 22.77 25.39 22.92H25.38Z"/>',
};

export const videoGalleryIconName = 'video-gallery';
export const videoGalleryIcon: IconShapeTuple = [videoGalleryIconName, renderIcon(icon)];
