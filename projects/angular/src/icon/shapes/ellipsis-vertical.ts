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
    '<path d="M21.1001 4.9C21.1001 6.50163 19.757 7.8 18.1001 7.8C16.4432 7.8 15.1001 6.50163 15.1001 4.9C15.1001 3.29837 16.4432 2 18.1001 2C19.757 2 21.1001 3.29837 21.1001 4.9Z"/><path d="M18.1001 20.9C19.757 20.9 21.1001 19.6016 21.1001 18C21.1001 16.3984 19.757 15.1 18.1001 15.1C16.4432 15.1 15.1001 16.3984 15.1001 18C15.1001 19.6016 16.4432 20.9 18.1001 20.9Z"/><path d="M18.1001 34C19.757 34 21.1001 32.7016 21.1001 31.1C21.1001 29.4984 19.757 28.2 18.1001 28.2C16.4432 28.2 15.1001 29.4984 15.1001 31.1C15.1001 32.7016 16.4432 34 18.1001 34Z"/>',
  outlineBadged:
    '<path d="M21.1001 4.9C21.1001 6.50163 19.757 7.8 18.1001 7.8C16.4432 7.8 15.1001 6.50163 15.1001 4.9C15.1001 3.29837 16.4432 2 18.1001 2C19.757 2 21.1001 3.29837 21.1001 4.9Z"/><path d="M18.1001 20.9C19.757 20.9 21.1001 19.6016 21.1001 18C21.1001 16.3984 19.757 15.1 18.1001 15.1C16.4432 15.1 15.1001 16.3984 15.1001 18C15.1001 19.6016 16.4432 20.9 18.1001 20.9Z"/><path d="M18.1001 34C19.757 34 21.1001 32.7016 21.1001 31.1C21.1001 29.4984 19.757 28.2 18.1001 28.2C16.4432 28.2 15.1001 29.4984 15.1001 31.1C15.1001 32.7016 16.4432 34 18.1001 34Z"/><path d="M30 11C32.7614 11 35 8.76142 35 6C35 3.23858 32.7614 1 30 1C27.2386 1 25 3.23858 25 6C25 8.76142 27.2386 11 30 11Z"/>',
};

export const ellipsisVerticalIconName = 'ellipsis-vertical';
export const ellipsisVerticalIcon: IconShapeTuple = [ellipsisVerticalIconName, renderIcon(icon)];
