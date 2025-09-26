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
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M15.016 2.0022C7.82748 2.0022 2 7.8225 2 15.0022C2 22.1819 7.82748 28.0022 15.016 28.0022C22.2046 28.0022 28.0321 22.1819 28.0321 15.0022C28.0321 7.8225 22.2046 2.0022 15.016 2.0022ZM15.016 4.05219C19.4513 4.04814 23.452 6.71346 25.1521 10.8049C26.8522 14.8963 25.9167 19.6077 22.782 22.7415C19.6472 25.8752 14.9308 26.8139 10.8328 25.1196C6.7348 23.4254 4.06254 19.432 4.06254 15.0022C4.0899 8.96993 8.97636 4.08503 15.016 4.05219ZM26.33 24.8722L33.7091 32.2922C33.9612 32.5459 34.0588 32.9146 33.9649 33.2596C33.8711 33.6045 33.6001 33.8733 33.254 33.9646C32.908 34.0559 32.5395 33.9559 32.2873 33.7022L24.9082 26.2822L26.33 24.8722Z"/>',
};

export const searchIconName = 'search';
export const searchIcon: IconShapeTuple = [searchIconName, renderIcon(icon)];
