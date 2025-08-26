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
    '<path d="M13.759 28.5L3.2909 17.8985C2.94988 17.4948 2.97281 16.8931 3.34353 16.5173C3.71424 16.1415 4.30784 16.1182 4.70604 16.4639L13.7389 25.6207L31.3931 7.74465C31.7913 7.39895 32.3849 7.4222 32.7556 7.798C33.1263 8.1738 33.1492 8.77554 32.8082 9.17921L13.759 28.5Z"/>',
};

export const checkIconName = 'check';
export const checkIcon: IconShapeTuple = [checkIconName, renderIcon(icon)];
