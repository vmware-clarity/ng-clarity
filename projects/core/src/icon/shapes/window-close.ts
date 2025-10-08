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
    '<path d="M19.41 18.0003L26.7 10.7103C27.0398 10.3135 27.0169 9.72207 26.6476 9.3527C26.2782 8.98333 25.6868 8.96049 25.29 9.30026L18 16.5903L10.71 9.29026C10.3132 8.95049 9.72181 8.97333 9.35244 9.3427C8.98307 9.71207 8.96023 10.3035 9.30001 10.7003L16.59 18.0003L9.29001 25.2903C9.00463 25.5347 8.88032 25.9184 8.96819 26.2837C9.05607 26.649 9.34129 26.9342 9.70659 27.0221C10.0719 27.1099 10.4556 26.9856 10.7 26.7003L18 19.4103L25.29 26.7003C25.6868 27.04 26.2782 27.0172 26.6476 26.6478C27.0169 26.2785 27.0398 25.687 26.7 25.2903L19.41 18.0003Z"/>',
};

export const windowCloseIconName = 'window-close';
export const windowCloseIcon: IconShapeTuple = [windowCloseIconName, renderIcon(icon)];
