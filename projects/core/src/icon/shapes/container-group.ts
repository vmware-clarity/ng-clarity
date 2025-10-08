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
    '<path d="m16,12v-6h-2v6h2Zm6,0v-6h-2v6h2Zm-12,0v-6h-2v6h2ZM4,4h22v8h2V3c0-.5-.5-1-1-1H3c-.5,0-1,.5-1,1v18c0,.5.5,1,1,1h3v-2h-2V4Zm29,10H9c-.5,0-1,.5-1,1v18c0,.5.5,1,1,1h24c.5,0,1-.5,1-1V15c0-.5-.5-1-1-1Zm-1,18H10v-16h22v16Zm-16-14h-2v12h2v-12Zm12,0h-2v12h2v-12Zm-6,0h-2v12h2v-12Z"/>',
  solid:
    '<path d="m10.1,12h3.8v-6.1h2.2v6.1h3.8v-6.1h2.2v6.1h5.9V3c0-.5-.5-1-1-1H3c-.5,0-1,.5-1,1v18c0,.5.5,1,1,1h3v-7c0-1.21.81-2.31,1.9-2.77v-6.33h2.2v6.1Zm22.9,2H9c-.5,0-1,.5-1,1v18c0,.5.5,1,1,1h24c.5,0,1-.5,1-1V15c0-.5-.5-1-1-1Zm-16.9,16.1h-2.2v-12.2h2.2v12.2Zm6,0h-2.2v-12.2h2.2v12.2Zm6,0h-2.2v-12.2h2.2v12.2Z"/>',
};

export const containerGroupIconName = 'container-group';
export const containerGroupIcon: IconShapeTuple = [containerGroupIconName, renderIcon(icon)];
