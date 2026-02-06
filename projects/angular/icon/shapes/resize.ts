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
    '<path d="M18 5C18 4.44772 18.4477 4 19 4H32V17C32 17.5523 31.5523 18 31 18C30.4477 18 30 17.5523 30 17V7.41L20.75 16.66C20.5056 16.9454 20.1219 17.0697 19.7566 16.9818C19.3913 16.8939 19.1061 16.6087 19.0182 16.2434C18.9303 15.8781 19.0546 15.4944 19.34 15.25L28.59 6H19C18.4477 6 18 5.55228 18 5Z"/><path d="M5 18C4.44772 18 4 18.4477 4 19V32H17C17.5523 32 18 31.5523 18 31C18 30.4477 17.5523 30 17 30H7.41L16.66 20.75C16.9454 20.5056 17.0697 20.1219 16.9818 19.7566C16.8939 19.3913 16.6087 19.1061 16.2434 19.0182C15.8781 18.9303 15.4944 19.0546 15.25 19.34L6 28.59V19C6 18.4477 5.55228 18 5 18Z"/>',
};

export const resizeIconName = 'resize';
export const resizeIcon: IconShapeTuple = [resizeIconName, renderIcon(icon)];
