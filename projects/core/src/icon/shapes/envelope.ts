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
    '<path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6ZM30.46,28H5.66l7-7.24-1.44-1.39L4,26.84V9.52L16.43,21.89a2,2,0,0,0,2.82,0L32,9.21v17.5l-7.36-7.36-1.41,1.41ZM5.31,8H30.38L17.84,20.47Z"/>',

  outlineAlerted:
    '<path d="M33.68,15.26H32V26.71l-7.36-7.36-1.41,1.41L30.46,28H5.66l7-7.24-1.44-1.39L4,26.84V9.52L16.43,21.89a2,2,0,0,0,2.82,0l6.66-6.63H23.08l-5.24,5.21L5.31,8H20.06l1.15-2H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V15.24Z"/>',

  outlineBadged:
    '<path d="M32,13.08V26.71l-7.36-7.36-1.41,1.41L30.46,28H5.66l7-7.24-1.44-1.39L4,26.84V9.52L16.43,21.89a2,2,0,0,0,2.82,0l8.83-8.78a7.44,7.44,0,0,1-2-.85l-8.26,8.21L5.31,8H22.81a7.49,7.49,0,0,1-.31-2H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V12.2A7.45,7.45,0,0,1,32,13.08Z"/>',

  solid:
    '<path d="M32.33,6a2,2,0,0,0-.41,0h-28a2,2,0,0,0-.53.08L17.84,20.47Z"/><path d="M33.81,7.39,19.25,21.89a2,2,0,0,1-2.82,0L2,7.5a2,2,0,0,0-.07.5V28a2,2,0,0,0,2,2h28a2,2,0,0,0,2-2V8A2,2,0,0,0,33.81,7.39ZM5.3,28H3.91V26.57l7.27-7.21,1.41,1.41Zm26.61,0H30.51l-7.29-7.23,1.41-1.41,7.27,7.21Z"/>',

  solidAlerted:
    '<path d="M33.68,15.4H25.77l-6.52,6.49a2,2,0,0,1-2.82,0L2,7.5a2,2,0,0,0-.07.5V28a2,2,0,0,0,2,2h28a2,2,0,0,0,2-2V15.38ZM5.3,28H3.91V26.57l7.27-7.21,1.41,1.41Zm26.61,0H30.51l-7.29-7.23,1.41-1.41,7.27,7.21Z"/><path d="M22.94,15.4h-.7A3.68,3.68,0,0,1,19,9.89L21.29,6H3.92a2,2,0,0,0-.53.08L17.84,20.47Z"/>',

  solidBadged:
    '<path d="M26,12.34A7.49,7.49,0,0,1,22.5,6H3.92a2,2,0,0,0-.53.08L17.84,20.47Z"/><path d="M30,13.5a7.49,7.49,0,0,1-2-.29l-8.71,8.68a2,2,0,0,1-2.82,0L2,7.5a2,2,0,0,0-.07.5V28a2,2,0,0,0,2,2h28a2,2,0,0,0,2-2V12.39A7.45,7.45,0,0,1,30,13.5ZM5.3,28H3.91V26.57l7.27-7.21,1.41,1.41Zm26.61,0H30.51l-7.29-7.23,1.41-1.41,7.27,7.21Z"/>',
};

export const envelopeIconName = 'envelope';
export const envelopeIcon: IconShapeTuple = [envelopeIconName, renderIcon(icon)];
