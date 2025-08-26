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
    '<path d="M23 26.5H6V28.5H23C23.55 28.5 24 28.05 24 27.5C24 26.95 23.55 26.5 23 26.5ZM29 20.5H6V22.5H29C29.55 22.5 30 22.05 30 21.5C30 20.95 29.55 20.5 29 20.5ZM6 8.5V10.5H29C29.55 10.5 30 10.05 30 9.5C30 8.95 29.55 8.5 29 8.5H6ZM23 14.5H6V16.5H23C23.55 16.5 24 16.05 24 15.5C24 14.95 23.55 14.5 23 14.5Z"/>',
};

export const alignLeftIconName = 'align-left';
export const alignLeftIcon: IconShapeTuple = [alignLeftIconName, renderIcon(icon)];
