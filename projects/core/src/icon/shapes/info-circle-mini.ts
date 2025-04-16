/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { renderIcon } from '../icon.renderer.js';
import { IconShapeTuple } from '../interfaces/icon.interfaces.js';

const icon = {
  outline:
    '<path d="M18,4A14,14,0,1,0,32,18,14,14,0,0,0,18,4Zm0,24A10,10,0,1,1,28,18,10,10,0,0,1,18,28Z"/><rect x="16" y="18" width="4" height="6"/><rect x="16" y="12" width="4" height="3.2"/>',
  solid: '<path d="M18,4A14,14,0,1,0,32,18,14,14,0,0,0,18,4Zm2,22H16V16h4Zm0-14H16V8h4Z"/>',
};

export const infoCircleMiniIconName = 'info-circle-mini';
export const infoCircleMiniIcon: IconShapeTuple = [infoCircleMiniIconName, renderIcon(icon)];
