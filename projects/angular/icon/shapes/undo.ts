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
    '<path d="M20.8848 11.0918H7.87339L13.4383 5.63847C13.8335 5.24622 13.8335 4.61026 13.4383 4.21801C13.043 3.82577 12.4022 3.82577 12.007 4.21801L4 12.0752L12.007 19.8927C12.3995 20.2794 13.0335 20.2772 13.4232 19.8877C13.8129 19.4982 13.8107 18.8689 13.4182 18.4821L7.86338 13.0785H20.8748C25.8823 13.0509 29.9687 17.0488 30.0127 22.0184C29.9892 25.3922 28.0538 28.4655 25.0084 29.965C24.6758 30.1318 24.4582 30.462 24.4375 30.8312C24.4167 31.2004 24.5961 31.5526 24.9079 31.755C25.2197 31.9574 25.6166 31.9794 25.9492 31.8126C30.5184 29.5243 32.8961 24.4129 31.6875 19.4772C30.4788 14.5415 26.0025 11.0833 20.8848 11.1315V11.0918Z"/>',
};

export const undoIconName = 'undo';
export const undoIcon: IconShapeTuple = [undoIconName, renderIcon(icon)];
