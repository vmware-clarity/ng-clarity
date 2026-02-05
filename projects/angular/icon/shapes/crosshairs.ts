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
    '<path d="M18 13C15.24 13 13 15.24 13 18C13 20.76 15.24 23 18 23C20.76 23 23 20.76 23 18C23 15.24 20.76 13 18 13ZM18 21C16.35 21 15 19.65 15 18C15 16.35 16.35 15 18 15C19.65 15 21 16.35 21 18C21 19.65 19.65 21 18 21ZM33 17H28.95C28.47 11.73 24.27 7.53 19 7.05V3C19 2.45 18.55 2 18 2C17.45 2 17 2.45 17 3V7.05C11.73 7.53 7.53 11.73 7.05 17H3C2.45 17 2 17.45 2 18C2 18.55 2.45 19 3 19H7.05C7.53 24.27 11.73 28.47 17 28.95V33C17 33.55 17.45 34 18 34C18.55 34 19 33.55 19 33V28.95C24.27 28.47 28.47 24.27 28.95 19H33C33.55 19 34 18.55 34 18C34 17.45 33.55 17 33 17ZM18 27C13.04 27 9 22.96 9 18C9 13.04 13.04 9 18 9C22.96 9 27 13.04 27 18C27 22.96 22.96 27 18 27Z"/>',
};

export const crosshairsIconName = 'crosshairs';
export const crosshairsIcon: IconShapeTuple = [crosshairsIconName, renderIcon(icon)];
