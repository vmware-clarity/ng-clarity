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
    '<path d="M30.72 32H5.28C3.47 32 2 30.53 2 28.72V11.28C2 9.47 3.47 8 5.28 8H30.72C32.53 8 34 9.47 34 11.28V28.72C34 30.53 32.53 32 30.72 32ZM5.28 10C4.57 10 4 10.58 4 11.28V28.72C4 29.43 4.58 30 5.28 30H30.72C31.43 30 32 29.42 32 28.72V11.28C32 10.57 31.42 10 30.72 10H5.28Z"/><path d="M23 9H21V6H15V9H13V5C13 4.45 13.45 4 14 4H22C22.55 4 23 4.45 23 5V9Z"/><path d="M10 9H8V30H10V9Z"/><path d="M28 9H26V30H28V9Z"/>',
  solid:
    '<path d="M23 9H21V6H15V9H13V5C13 4.45 13.45 4 14 4H22C22.55 4 23 4.45 23 5V9Z"/><path d="M26 8H10V32H26V8Z"/><path d="M30.72 8H28V32H30.72C32.53 32 34 30.53 34 28.72V11.28C34 9.47 32.53 8 30.72 8Z"/><path d="M8 8H5.28C3.47 8 2 9.47 2 11.28V28.72C2 30.53 3.47 32 5.28 32H8V8Z"/>',
};

export const suitcase2IconName = 'suitcase2';
export const suitcase2Icon: IconShapeTuple = [suitcase2IconName, renderIcon(icon)];
