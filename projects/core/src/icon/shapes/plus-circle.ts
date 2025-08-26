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
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M18 2C9.16344 2 2 9.16344 2 18C2 26.8366 9.16344 34 18 34C26.8366 34 34 26.8366 34 18C34 13.7565 32.3143 9.68687 29.3137 6.68629C26.3131 3.68571 22.2435 2 18 2ZM18 32C10.268 32 4 25.732 4 18C4 10.268 10.268 4 18 4C25.732 4 32 10.268 32 18C32 21.713 30.525 25.274 27.8995 27.8995C25.274 30.525 21.713 32 18 32ZM18.9815 17.0185H26.0185C26.5606 17.0185 27 17.458 27 18C27 18.542 26.5606 18.9815 26.0185 18.9815H18.9815V26.0185C18.9815 26.5606 18.542 27 18 27C17.458 27 17.0185 26.5606 17.0185 26.0185V18.9815H9.98146C9.43941 18.9815 9 18.542 9 18C9 17.458 9.43941 17.0185 9.98146 17.0185H17.0185V9.98146C17.0185 9.43941 17.458 9 18 9C18.542 9 18.9815 9.43941 18.9815 9.98146V17.0185Z"/>',

  solid:
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M2 18C2 26.8366 9.16344 34 18 34C26.8366 34 34 26.8366 34 18C34 13.7565 32.3143 9.68687 29.3137 6.68629C26.3131 3.68571 22.2435 2 18 2C9.16344 2 2 9.16344 2 18ZM19.5 16.5H25.59C26.4184 16.5 27.09 17.1716 27.09 18C27.09 18.8284 26.4184 19.5 25.59 19.5H19.5V25.59C19.5 26.4184 18.8284 27.09 18 27.09C17.1716 27.09 16.5 26.4184 16.5 25.59V19.5H10.41C9.58157 19.5 8.91 18.8284 8.91 18C8.91 17.1716 9.58157 16.5 10.41 16.5H16.5V10.41C16.5 9.58157 17.1716 8.91 18 8.91C18.8284 8.91 19.5 9.58157 19.5 10.41V16.5Z"/>',
};

export const plusCircleIconName = 'plus-circle';
export const plusCircleIcon: IconShapeTuple = [plusCircleIconName, renderIcon(icon)];
