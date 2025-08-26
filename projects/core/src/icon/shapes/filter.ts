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
    '<path d="M33 4H3C2.45 4 2 4.44984 2 4.99964V6.66905C2 7.14888 2.19 7.59871 2.53 7.93859L14 19.5744V28.0514L16 29.0011V18.9846C16 18.7147 15.9 18.4648 15.71 18.2749L4 6.58908V5.99929H32V6.60907L20.33 18.2849C20.13 18.4648 20.01 18.7247 20 18.9946V31.0004L22 32V19.4945L33.47 7.99857C33.81 7.65869 34.01 7.18886 34 6.69904V4.99964C34 4.44984 33.55 4 33 4Z"/>',

  solid:
    '<path d="M32.9998 4H2.99976C2.44976 4 1.99976 4.45 1.99976 5V6.67C1.99976 7.15 2.18976 7.6 2.52976 7.94L13.9998 19.58V28.06L21.9998 32V19.49L33.4698 8C33.8098 7.66 34.0098 7.19 33.9998 6.7V5C33.9998 4.45 33.5498 4 32.9998 4Z"/>',
};

export const filterIconName = 'filter';
export const filterIcon: IconShapeTuple = [filterIconName, renderIcon(icon)];
