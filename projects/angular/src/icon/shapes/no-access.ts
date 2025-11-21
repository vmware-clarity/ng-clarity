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
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M18 2C9.16344 2 2 9.16344 2 18C2 26.8366 9.16344 34 18 34C26.8366 34 34 26.8366 34 18C34 13.7565 32.3143 9.68687 29.3137 6.68629C26.3131 3.68571 22.2435 2 18 2ZM27.15 15C28.1717 15 29 15.8283 29 16.85V19.15C29 20.1717 28.1717 21 27.15 21H8.85C8.35761 21 7.88554 20.8037 7.5383 20.4546C7.19107 20.1055 6.99734 19.6324 7 19.14V16.85C7 15.8283 7.82827 15 8.85 15H27.15ZM27.15 19.4C27.2881 19.4 27.4 19.2881 27.4 19.15V16.85C27.4 16.7119 27.2881 16.6 27.15 16.6H8.85C8.71193 16.6 8.6 16.7119 8.6 16.85V19.15C8.6 19.2881 8.71193 19.4 8.85 19.4H27.15ZM4 18C4 25.732 10.268 32 18 32C21.713 32 25.274 30.525 27.8995 27.8995C30.525 25.274 32 21.713 32 18C32 10.268 25.732 4 18 4C10.268 4 4 10.268 4 18Z"/>',

  solid:
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M2 18C2 9.16344 9.16344 2 18 2C22.2435 2 26.3131 3.68571 29.3137 6.68629C32.3143 9.68687 34 13.7565 34 18C34 26.8366 26.8366 34 18 34C9.16344 34 2 26.8366 2 18ZM6.24896 19.751C6.40837 19.9104 6.62457 20 6.85 20H29.15C29.3772 20 29.5949 19.9091 29.7546 19.7475C29.9143 19.5859 30.0027 19.3672 30 19.14V16.85C30 16.3806 29.6194 16 29.15 16H6.85C6.38056 16 6 16.3806 6 16.85V19.15C6 19.3754 6.08955 19.5916 6.24896 19.751Z"/>',
};

export const noAccessIconName = 'no-access';
export const noAccessIcon: IconShapeTuple = [noAccessIconName, renderIcon(icon)];
