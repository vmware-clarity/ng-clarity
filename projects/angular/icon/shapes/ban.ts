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
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M18 2C9.16344 2 2 9.16344 2 18C2 26.8366 9.16344 34 18 34C26.8366 34 34 26.8366 34 18C34 13.7565 32.3143 9.68687 29.3137 6.68629C26.3131 3.68571 22.2435 2 18 2ZM4 18C4.00096 14.6359 5.21931 11.3858 7.43 8.85L27.15 28.57C23.0084 32.1463 17.1629 32.982 12.1852 30.7092C7.20751 28.4365 4.0102 23.472 4 18ZM8.85 7.43L28.57 27.15C33.2172 21.5881 32.8511 13.3989 27.7261 8.27391C22.6011 3.14891 14.4119 2.78279 8.85 7.43Z"/>',
};

export const banIconName = 'ban';
export const banIcon: IconShapeTuple = [banIconName, renderIcon(icon)];
