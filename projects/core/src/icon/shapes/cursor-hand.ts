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
    '<path d="M30.74,15.19a13.66,13.66,0,0,0-6.87-3.83A26,26,0,0,0,18,10.58V5.28A3.4,3.4,0,0,0,14.5,2,3.4,3.4,0,0,0,11,5.28v10L9.4,13.7a3.77,3.77,0,0,0-5.28,0A3.67,3.67,0,0,0,3,16.33a3.6,3.6,0,0,0,1,2.56l4.66,5.52a11.53,11.53,0,0,0,1.43,4,10.12,10.12,0,0,0,2,2.54v1.92a1.07,1.07,0,0,0,1,1.08H27a1.07,1.07,0,0,0,1-1.08v-2.7a12.81,12.81,0,0,0,3-8.36v-6A1,1,0,0,0,30.74,15.19ZM29,21.86a10.72,10.72,0,0,1-2.6,7.26,1.11,1.11,0,0,0-.4.72V32H14.14V30.52a1,1,0,0,0-.44-.83,7.26,7.26,0,0,1-1.82-2.23,9.14,9.14,0,0,1-1.2-3.52,1,1,0,0,0-.23-.59L5.53,17.53a1.7,1.7,0,0,1,0-2.42,1.76,1.76,0,0,1,2.47,0l3,3v3.14l2-1V5.28A1.42,1.42,0,0,1,14.5,4,1.42,1.42,0,0,1,16,5.28v11.8l2,.43V12.59a24.27,24.27,0,0,1,2.51.18V18l1.6.35V13c.41.08.83.17,1.26.28a14.88,14.88,0,0,1,1.53.49v5.15l1.6.35V14.5A11.06,11.06,0,0,1,29,16.23Z"/>',
  solid:
    '<path d="M28.69,14.33v4.83l-2-.43V13.24a16.19,16.19,0,0,0-2.33-.84v5.82l-2-.43V12c-1.1-.18-2.18-.3-3.08-.36v5.51l-2-.43V11.48h0V4.34a2.53,2.53,0,0,0-2.6-2.43,2.53,2.53,0,0,0-2.6,2.43V17.27h0v2.59l-2,1V15.6L7.75,13.21a2.83,2.83,0,0,0-4,0,2.93,2.93,0,0,0,0,4.09l6,7.1a10.82,10.82,0,0,0,1.39,4.22,8.42,8.42,0,0,0,2.21,2.73v2.56H27.79V30.62a12.54,12.54,0,0,0,3-8.5v-6A10,10,0,0,0,28.69,14.33Z"/>',
};

export const cursorHandIconName = 'cursor-hand';
export const cursorHandIcon: IconShapeTuple = [cursorHandIconName, renderIcon(icon)];
