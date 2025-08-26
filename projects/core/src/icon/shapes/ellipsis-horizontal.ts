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
    '<path d="M7.8 18.1C7.8 19.7568 6.50163 21.1 4.9 21.1C3.29837 21.1 2 19.7568 2 18.1C2 16.4431 3.29837 15.1 4.9 15.1C6.50163 15.1 7.8 16.4431 7.8 18.1Z"/><path d="M18 21.1C19.6016 21.1 20.9 19.7568 20.9 18.1C20.9 16.4431 19.6016 15.1 18 15.1C16.3984 15.1 15.1 16.4431 15.1 18.1C15.1 19.7568 16.3984 21.1 18 21.1Z"/><path d="M31.1 21.1C32.7016 21.1 34 19.7568 34 18.1C34 16.4431 32.7016 15.1 31.1 15.1C29.4984 15.1 28.2 16.4431 28.2 18.1C28.2 19.7568 29.4984 21.1 31.1 21.1Z"/>',
  outlineBadged:
    '<path d="M4.9 21.1C6.50163 21.1 7.8 19.7568 7.8 18.1C7.8 16.4431 6.50163 15.1 4.9 15.1C3.29837 15.1 2 16.4431 2 18.1C2 19.7568 3.29837 21.1 4.9 21.1Z"/><path d="M18 21.1C19.6016 21.1 20.9 19.7568 20.9 18.1C20.9 16.4431 19.6016 15.1 18 15.1C16.3984 15.1 15.1 16.4431 15.1 18.1C15.1 19.7568 16.3984 21.1 18 21.1Z"/><path d="M34 18.1C34 19.7568 32.7016 21.1 31.1 21.1C29.4984 21.1 28.2 19.7568 28.2 18.1C28.2 16.4431 29.4984 15.1 31.1 15.1C32.7016 15.1 34 16.4431 34 18.1Z"/><path d="M30 11C32.7614 11 35 8.76142 35 6C35 3.23858 32.7614 1 30 1C27.2386 1 25 3.23858 25 6C25 8.76142 27.2386 11 30 11Z"/>',
};

export const ellipsisHorizontalIconName = 'ellipsis-horizontal';
export const ellipsisHorizontalIcon: IconShapeTuple = [ellipsisHorizontalIconName, renderIcon(icon)];
