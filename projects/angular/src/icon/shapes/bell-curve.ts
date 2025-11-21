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
    '<path d="M33 28.04H2.99999C2.44999 28.04 1.99999 28.49 1.99999 29.04C1.99999 29.59 2.44999 30.04 2.99999 30.04H33C33.55 30.04 34 29.59 34 29.04C34 28.49 33.55 28.04 33 28.04ZM2.99999 26.04H3.59999C7.55999 26.04 10.93 23.24 11.62 19.39C12.68 13.48 14.18 8 18 8C21.82 8 23.31 13.46 24.35 19.37C25.03 23.24 28.41 26.04 32.37 26.04H32.99C33.54 26.04 33.99 25.59 33.99 25.04C33.99 24.49 33.54 24.04 32.99 24.04H32.37C29.38 24.04 26.83 21.93 26.31 19.02C25.51 14.47 24.01 6 17.99 6C11.97 6 10.45 14.48 9.63999 19.03C9.11999 21.93 6.57999 24.03 3.58999 24.03H2.98999C2.43999 24.03 1.98999 24.48 1.98999 25.03C1.98999 25.58 2.43999 26.03 2.98999 26.03L2.99999 26.04Z"/>',
};

export const bellCurveIconName = 'bell-curve';
export const bellCurveIcon: IconShapeTuple = [bellCurveIconName, renderIcon(icon)];
