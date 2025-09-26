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
    '<path d="M21 7.34C21 6.06 19.95 5.02 18.67 5.01H17.87C17.42 3.24 15.82 2 13.99 2C12.16 2 10.57 3.24 10.11 5.01H9.32C8.04 5.01 7 6.06 6.99 7.34V11.01H20.99V7.34H21ZM19 9.01H9V7.34C9 7.25 9.03 7.17 9.1 7.11C9.16 7.05 9.25 7.01 9.33 7.01H12V6.01C12 4.91 12.9 4.01 14 4.01C15.1 4.01 16 4.91 16 6.01V7.01H18.67C18.85 7.01 19 7.16 19 7.34V9.01ZM24 17H26V6.7C26 6.25 25.82 5.82 25.49 5.5C25.17 5.18 24.74 5.01 24.29 5.01H22V7.01H24V17ZM24 32H4V7.01H6V5.01H4C3.5 4.94 3 5.08 2.62 5.41C2.24 5.73 2.01 6.2 2 6.7V32.31C2 32.76 2.18 33.19 2.51 33.51C2.83 33.83 3.26 34 3.71 34H24.29C24.74 34 25.17 33.83 25.49 33.51C25.81 33.19 25.99 32.76 26 32.31V23H24V32ZM33 19H18.61L21.72 15.71C22.09 15.32 22.09 14.69 21.72 14.3C21.35 13.91 20.75 13.91 20.38 14.3L14.99 20.01L20.38 25.72C20.56 25.92 20.81 26.01 21.05 26.01C21.29 26.01 21.53 25.91 21.72 25.72C22.09 25.33 22.09 24.7 21.72 24.31L18.61 21.02H33C33.55 21.02 34 20.57 34 20.02C34 19.47 33.55 19.02 33 19.02V19Z"/>',
};

export const copyToClipboardIconName = 'copy-to-clipboard';
export const copyToClipboardIcon: IconShapeTuple = [copyToClipboardIconName, renderIcon(icon)];
