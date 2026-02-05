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
    '<path d="M15 23.86L17 24.86V18.27C16.9989 18.0077 16.8947 17.7563 16.71 17.57L10.23 11H25.79L19.32 17.57C19.1353 17.7563 19.0311 18.0077 19.03 18.27L19 26L21 27V18.68L27.58 12C27.8432 11.733 27.9936 11.3749 28 11V10C28 9.44772 27.5523 9 27 9H9C8.44772 9 8 9.44772 8 10V11C8.0064 11.3749 8.15679 11.733 8.42 12L15 18.68V23.86Z"/>',
  solid:
    '<path d="M8 9V10.1212C8.00188 10.2532 8.05585 10.3791 8.15015 10.4716L15.4374 17.8393C15.5317 17.9317 15.5857 18.0577 15.5876 18.1897V25.087C15.5872 25.2784 15.696 25.4532 15.8679 25.5375L19.8218 26.9489C19.9771 27.025 20.1607 27.0156 20.3073 26.9239C20.4539 26.8323 20.5429 26.6714 20.5425 26.4985V18.0996C20.5564 17.9643 20.6207 17.8392 20.7227 17.7492L27.8498 10.4916C27.9442 10.3992 27.9981 10.2732 28 10.1412V9H8Z"/>',
};

export const filterGridIconName = 'filter-grid';
export const filterGridIcon: IconShapeTuple = [filterGridIconName, renderIcon(icon)];
