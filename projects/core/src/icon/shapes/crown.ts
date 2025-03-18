/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { renderIcon } from '../icon.renderer.js';
import { IconShapeTuple } from '../interfaces/icon.interfaces.js';

const icon = {
  outline:
    '<path d="M4,13.33A1.39,1.39,0,1,0,2.6,14.72,1.39,1.39,0,0,0,4,13.33Z"/><path d="M31.81,15.84a20.35,20.35,0,0,0-4.58,1.43,22.7,22.7,0,0,0-3.48,2.1A17.69,17.69,0,0,1,22,16.57a47.65,47.65,0,0,1-2.8-7.69,1,1,0,0,0-1-.74,1,1,0,0,0-1,.74,46.71,46.71,0,0,1-2.8,7.69,17,17,0,0,1-1.76,2.8,22.7,22.7,0,0,0-3.48-2.1,20.66,20.66,0,0,0-4.58-1.43,1,1,0,0,0-1,.39,1,1,0,0,0-.09,1.05A50.13,50.13,0,0,1,7.82,31.17a1,1,0,0,0,1,.83H27.62a1,1,0,0,0,1-.83,50.15,50.15,0,0,1,4.26-13.89,1,1,0,0,0-.09-1.05A1,1,0,0,0,31.81,15.84ZM26.79,30H9.64a55.66,55.66,0,0,0-3.4-11.71,15.75,15.75,0,0,1,2.09.78,20,20,0,0,1,3.85,2.45,1,1,0,0,0,1.39-.09,19.28,19.28,0,0,0,2.67-4,43.46,43.46,0,0,0,2-4.89,41.74,41.74,0,0,0,2,4.89,19.92,19.92,0,0,0,2.66,4,1,1,0,0,0,1.4.09,19.21,19.21,0,0,1,3.85-2.45,14.77,14.77,0,0,1,2.09-.78A55.07,55.07,0,0,0,26.79,30Z"/><ellipse cx="33.83" cy="13.33" rx="1.39" ry="1.39"/><path d="M18.22,6.39A1.39,1.39,0,1,0,16.84,5,1.39,1.39,0,0,0,18.22,6.39Z"/><path d="M18.23,26.34a1.11,1.11,0,1,0,1.1,1.1A1.1,1.1,0,0,0,18.23,26.34Z"/><path d="M12.58,26.34a1.11,1.11,0,1,0,1.1,1.1A1.1,1.1,0,0,0,12.58,26.34Z"/><path d="M23.89,26.34a1.11,1.11,0,1,0,1.1,1.1A1.1,1.1,0,0,0,23.89,26.34Z"/>',
  solid:
    '<path d="M2.6,11.93A1.4,1.4,0,1,0,4,13.33,1.4,1.4,0,0,0,2.6,11.93Z"/><ellipse cx="33.83" cy="13.33" rx="1.39" ry="1.39"/><path d="M18.22,6.39A1.39,1.39,0,1,0,16.84,5,1.39,1.39,0,0,0,18.22,6.39Z"/><path d="M31.63,16.1A18.61,18.61,0,0,0,28,17.34a21.57,21.57,0,0,0-4,2.49,19.2,19.2,0,0,1-2.26-3.49,48.92,48.92,0,0,1-2.52-6.58,1,1,0,0,0-1-.71h0a1,1,0,0,0-1,.71,48.42,48.42,0,0,1-2.52,6.58,18.69,18.69,0,0,1-2.26,3.48,22.81,22.81,0,0,0-4-2.48A18.83,18.83,0,0,0,4.9,16.1a1,1,0,0,0-1,.33,1,1,0,0,0-.13,1.07,55.9,55.9,0,0,1,4,13.5,1,1,0,0,0,1,.83h19a1,1,0,0,0,1-.83,55.9,55.9,0,0,1,4-13.5,1,1,0,0,0-.13-1.07A1,1,0,0,0,31.63,16.1ZM11.08,28.55a1.11,1.11,0,1,1,1.1-1.11A1.11,1.11,0,0,1,11.08,28.55Zm7.15,0a1.11,1.11,0,0,1,0-2.21,1.11,1.11,0,0,1,0,2.21Zm7.16,0a1.11,1.11,0,1,1,1.1-1.11A1.11,1.11,0,0,1,25.39,28.55Z"/>',
};

export const crownIconName = 'crown';
export const crownIcon: IconShapeTuple = [crownIconName, renderIcon(icon)];
