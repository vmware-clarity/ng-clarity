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
    '<path d="M29 30H19V28H17V30H7C6.45 30 6 30.45 6 31C6 31.55 6.45 32 7 32H29C29.55 32 30 31.55 30 31C30 30.45 29.55 30 29 30ZM12.55 25.98C12.62 25.99 12.68 26 12.75 26H25C28.86 26 32 22.86 32 19C32 16.2 30.32 13.7 27.81 12.6C27.93 12.08 28 11.54 28 11C28 7.14 24.86 4 21 4C18.23 4 15.72 5.67 14.61 8.15C14.07 8.05 13.53 8 13 8C8.04 8 4 12.04 4 17C4 21.96 7.74 25.74 12.55 25.98ZM13 10C13.65 10 14.31 10.1 14.96 10.28C15.5 10.44 16.04 10.13 16.2 9.6C16.82 7.48 18.79 6 21 6C23.76 6 26 8.24 26 11C26 11.63 25.88 12.25 25.64 12.84C25.53 13.1 25.55 13.4 25.67 13.66C25.8 13.92 26.03 14.1 26.3 14.18C28.47 14.77 29.99 16.75 29.99 19C29.99 21.76 27.75 24 24.99 24H12.9C12.9 24 12.82 23.99 12.77 23.99C8.97 23.87 5.99 20.8 5.99 17C5.99 13.2 9.13 10 12.99 10H13Z"/>',
};

export const cloudNetworkIconName = 'cloud-network';
export const cloudNetworkIcon: IconShapeTuple = [cloudNetworkIconName, renderIcon(icon)];
