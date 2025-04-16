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
    '<path d="M7.21,14.07h3a1.61,1.61,0,0,1,1.81,1.5,1.44,1.44,0,0,1-.84,1.34,1.67,1.67,0,0,1,1.1,1.53,1.75,1.75,0,0,1-2,1.63H7.21Zm2.71,2.42c.48,0,.82-.28.82-.67s-.34-.65-.82-.65H8.49v1.32Zm.2,2.48a.75.75,0,1,0,0-1.47H8.49V19Z"/><path d="M14.55,15.23v1.2h3v1.16h-3v1.32h3.33v1.16H13.26v-6h4.62v1.16Z"/><path d="M20.41,15.23H18.54V14.07h5v1.16H21.7v4.84H20.41Z"/><path d="M28,19.12H25.32l-.38.95H23.5l2.44-6h1.44l2.45,6H28.38ZM27.55,18l-.89-2.19L25.77,18Z"/><path d="M8.06,30a.84.84,0,0,1-.38-.08A1,1,0,0,1,7.06,29V25h-4a1,1,0,0,1-1-1V10a1,1,0,0,1,1-1h30a1,1,0,0,1,1,1V24a1,1,0,0,1-1,1H13.48L8.77,29.71A1,1,0,0,1,8.06,30Zm-4-7h4a1,1,0,0,1,1,1v2.59l3.3-3.3a1,1,0,0,1,.7-.29h19V11h-28Z"/>',
  solid:
    '<polygon points="25.8,18 27.5,18 26.7,15.8"/><path d="M10.4,17.5c-0.1,0-0.2,0-0.3,0H8.5V19l1.6,0c0.4,0.1,0.8-0.2,0.9-0.6C11.1,18,10.8,17.6,10.4,17.5z"/><path d="M10.7,15.8c0-0.4-0.3-0.7-0.8-0.7H8.5v1.3h1.4C10.4,16.5,10.7,16.2,10.7,15.8z"/><path d="M33.1,9h-30c-0.6,0-1,0.4-1,1v14c0,0.6,0.4,1,1,1h4v4c0,0.4,0.2,0.8,0.6,0.9C7.8,30,7.9,30,8.1,30c0.3,0,0.5-0.1,0.7-0.3l4.7-4.7h19.6c0.6,0,1-0.4,1-1V10C34.1,9.4,33.6,9,33.1,9z M10.4,20.1c-0.1,0-0.1,0-0.2,0H7.2v-6h3c0.9-0.1,1.7,0.5,1.8,1.4c0,0,0,0.1,0,0.1c0,0.6-0.3,1.1-0.8,1.3c0.6,0.2,1.1,0.8,1.1,1.5C12.2,19.4,11.4,20.1,10.4,20.1z M17.9,15.2h-3.3v1.2h3v1.2h-3v1.3h3.3v1.2h-4.6v-6h4.6V15.2z M21.7,20.1h-1.3v-4.8h-1.9v-1.2h5v1.2h-1.8V20.1z M28.4,20.1l-0.4-1h-2.7l-0.4,1h-1.4l2.4-6h1.4l2.5,6H28.4z"/>',
};

export const betaIconName = 'beta';
export const betaIcon: IconShapeTuple = [betaIconName, renderIcon(icon)];
