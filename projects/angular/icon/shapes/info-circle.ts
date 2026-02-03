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
    '<path d="M21 23H19V15H16C15.45 15 15 15.45 15 16C15 16.55 15.45 17 16 17H17V23H15C14.45 23 14 23.45 14 24C14 24.55 14.45 25 15 25H21C21.55 25 22 24.55 22 24C22 23.45 21.55 23 21 23ZM17.93 13.3C18.7 13.3 19.33 12.67 19.33 11.9C19.33 11.13 18.7 10.5 17.93 10.5C17.16 10.5 16.53 11.13 16.53 11.9C16.53 12.67 17.16 13.3 17.93 13.3ZM18 6C11.38 6 6 11.38 6 18C6 24.62 11.38 30 18 30C24.62 30 30 24.62 30 18C30 11.38 24.62 6 18 6ZM18 28C12.49 28 8 23.51 8 18C8 12.49 12.49 8 18 8C23.51 8 28 12.49 28 18C28 23.51 23.51 28 18 28Z"/>',
  solid:
    '<path d="M18 6C11.38 6 6 11.38 6 18C6 24.62 11.38 30 18 30C24.62 30 30 24.62 30 18C30 11.38 24.62 6 18 6ZM17.93 10.3C18.81 10.3 19.53 11.02 19.53 11.9C19.53 12.78 18.81 13.5 17.93 13.5C17.05 13.5 16.33 12.78 16.33 11.9C16.33 11.02 17.05 10.3 17.93 10.3ZM21 25.2H15C14.34 25.2 13.8 24.66 13.8 24C13.8 23.34 14.34 22.8 15 22.8H16.8V17.2H16C15.34 17.2 14.8 16.66 14.8 16C14.8 15.34 15.34 14.8 16 14.8H19.2V22.8H21C21.66 22.8 22.2 23.34 22.2 24C22.2 24.66 21.66 25.2 21 25.2Z"/>',
};

export const infoCircleIconName = 'info-circle';
export const infoCircleIcon: IconShapeTuple = [infoCircleIconName, renderIcon(icon)];
