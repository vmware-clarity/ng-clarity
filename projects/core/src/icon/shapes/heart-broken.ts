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
    '<path d="M33,7.64c-1.34-2.75-5.09-5-9.69-3.69a9.87,9.87,0,0,0-6,4.84,18.9,18.9,0,0,0-2.23,5.33l5.28,2.34-4.6,4.37,3.49,4.1,1.52-1.3L18.54,21l5.4-5.13L17.58,13A16.23,16.23,0,0,1,19.75,8.9a7.68,7.68,0,0,1,4.11-3c3.34-.89,6.34.6,7.34,2.65,1.55,3.18.85,6.72-2.14,10.81A57.16,57.16,0,0,1,18,30.16,57.16,57.16,0,0,1,6.94,19.33c-3-4.1-3.69-7.64-2.14-10.81a5.9,5.9,0,0,1,5.33-2.93,7.31,7.31,0,0,1,2,.29,7.7,7.7,0,0,1,3.38,2l.15-.3a10.66,10.66,0,0,1,1-1.41,9.64,9.64,0,0,0-3.94-2.22C8.2,2.66,4.34,4.89,3,7.64c-1.88,3.85-1.1,8.18,2.32,12.87C8,24.18,11.83,27.9,17.39,32.22a1,1,0,0,0,1.23,0c5.55-4.31,9.39-8,12.07-11.71C34.1,15.82,34.88,11.49,33,7.64Z"/>',
  solid:
    '<path d="M33,7.64c-1.34-2.75-5.2-5-9.69-3.69A11.55,11.55,0,0,0,18.19,7.5a16.89,16.89,0,0,0-2.48,4.56L22.27,15,16.7,20.26,19,23l-1.57,1.34-3.6-4.22,4.74-4.51-5.44-2.41a19.49,19.49,0,0,1,2.3-5.5,14.77,14.77,0,0,1,1.06-1.54l.06,0a9.66,9.66,0,0,0-3.89-2.18C8.19,2.66,4.34,4.89,3,7.64c-1.88,3.85-1.1,8.18,2.32,12.87C8,24.18,11.83,27.9,17.39,32.22a1,1,0,0,0,1.23,0c5.55-4.31,9.39-8,12.07-11.71C34.1,15.82,34.88,11.49,33,7.64Z"/>',
};

export const heartBrokenIconName = 'heart-broken';
export const heartBrokenIcon: IconShapeTuple = [heartBrokenIconName, renderIcon(icon)];
