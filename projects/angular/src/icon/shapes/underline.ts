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
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M26 17.96C26 23.88 22.79 26.96 17.99 26.96C13.19 26.96 9.99 23.88 10 18.13V8.15C10 7.51 10.49 7 11.09 7C11.69 7 12.18 7.51 12.18 8.15V17.99C12.18 22.37 14.5 24.84 18.05 24.84C21.6 24.84 23.84 22.57 23.84 18.13V8.15C23.84 7.51 24.33 7 24.93 7C25.53 7 26.02 7.51 26.02 8.15V17.96H26ZM4 29.9C4 29.33 4.44 28.85 5 28.8H31C31.57 28.85 32 29.33 32 29.9C32 30.47 31.56 30.95 31 31H5C4.43 30.95 4 30.47 4 29.9Z"/>',
};

export const underlineIconName = 'underline';
export const underlineIcon: IconShapeTuple = [underlineIconName, renderIcon(icon)];
