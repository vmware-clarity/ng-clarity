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
    '<path d="M18 3C18 2.44772 18.4477 2 19 2H34V17C34 17.5523 33.5523 18 33 18C32.4477 18 32 17.5523 32 17V5.41L18.15 19.26C17.9056 19.5454 17.5219 19.6697 17.1566 19.5818C16.7913 19.4939 16.5061 19.2087 16.4182 18.8434C16.3303 18.4781 16.4546 18.0944 16.74 17.85L30.59 4H19C18.4477 4 18 3.55228 18 3Z"/><path d="M6 32H28C29.1046 32 30 31.1046 30 30V20H28V30H6V8H16V6H6C4.89543 6 4 6.89543 4 8V30C4 31.1046 4.89543 32 6 32Z"/>',
};

export const popOutIconName = 'pop-out';
export const popOutIcon: IconShapeTuple = [popOutIconName, renderIcon(icon)];
