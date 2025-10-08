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
    '<path d="M22.61 14.22L16.25 20.58L12.71 17.04C12.32 16.65 11.69 16.65 11.3 17.04C10.91 17.43 10.91 18.06 11.3 18.45L16.25 23.4L24.03 15.62C24.42 15.23 24.42 14.6 24.03 14.21C23.64 13.82 23.01 13.82 22.62 14.21L22.61 14.22ZM18 6C11.38 6 6 11.38 6 18C6 24.62 11.38 30 18 30C24.62 30 30 24.62 30 18C30 11.38 24.62 6 18 6ZM18 28C12.49 28 8 23.51 8 18C8 12.49 12.49 8 18 8C23.51 8 28 12.49 28 18C28 23.51 23.51 28 18 28Z"/>',
  solid:
    '<path d="M18 6C11.38 6 6 11.38 6 18C6 24.62 11.38 30 18 30C24.62 30 30 24.62 30 18C30 11.38 24.62 6 18 6ZM24.16 15.78L16.24 23.7L11.15 18.61C10.68 18.14 10.68 17.38 11.15 16.91C11.62 16.44 12.38 16.44 12.85 16.91L16.24 20.3L22.46 14.08C22.93 13.61 23.69 13.61 24.16 14.08C24.63 14.55 24.63 15.31 24.16 15.78Z"/>',
};

export const checkCircleIconName = 'check-circle';
export const checkCircleIcon: IconShapeTuple = [checkCircleIconName, renderIcon(icon)];
