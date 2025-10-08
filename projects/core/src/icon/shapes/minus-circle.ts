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
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M18 2C9.16344 2 2 9.16344 2 18C2 26.8366 9.16344 34 18 34C26.8366 34 34 26.8366 34 18C34 13.7565 32.3143 9.68687 29.3137 6.68629C26.3131 3.68571 22.2435 2 18 2ZM18 32C10.268 32 4 25.732 4 18C4 10.268 10.268 4 18 4C25.732 4 32 10.268 32 18C32 21.713 30.525 25.274 27.8995 27.8995C25.274 30.525 21.713 32 18 32ZM11 18C11 17.4477 11.4477 17 12 17H24C24.5523 17 25 17.4477 25 18C25 18.5523 24.5523 19 24 19H12C11.4477 19 11 18.5523 11 18Z"/>',

  solid:
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M2 18C2 9.16344 9.16344 2 18 2C22.2435 2 26.3131 3.68571 29.3137 6.68629C32.3143 9.68687 34 13.7565 34 18C34 26.8366 26.8366 34 18 34C9.16344 34 2 26.8366 2 18ZM10.5 18C10.5 18.8284 11.1716 19.5 12 19.5H24C24.8284 19.5 25.5 18.8284 25.5 18C25.5 17.1716 24.8284 16.5 24 16.5H12C11.1716 16.5 10.5 17.1716 10.5 18Z"/>',
};

export const minusCircleIconName = 'minus-circle';
export const minusCircleIcon: IconShapeTuple = [minusCircleIconName, renderIcon(icon)];
