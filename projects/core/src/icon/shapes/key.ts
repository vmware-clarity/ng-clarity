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
    '<rect x="6.33" y="10.71" width="9.71" height="2.57" rx="1" ry="1" transform="translate(-5.21 11.43) rotate(-45)"/><path d="M23.35,16.8l.63-.63A5,5,0,0,0,24,9.1L18.71,3.84a5,5,0,0,0-7.07,0L3.09,12.39a5,5,0,0,0,0,7.07l5.26,5.26a5,5,0,0,0,7.07,0l.4-.4L18,26.48h3.44v3h3.69v1.63L28,34h6V27.45ZM32,32H28.86l-1.77-1.76v-2.8H23.41v-3H18.8l-3-3L14,23.31a3,3,0,0,1-4.24,0L4.5,18a3,3,0,0,1,0-4.24l8.56-8.56a3,3,0,0,1,4.24,0l5.26,5.26a3,3,0,0,1,0,4.24l-2,2L32,28.28Z"/>',

  outlineAlerted:
    '<rect x="6.33" y="10.71" width="9.71" height="2.57" rx="1" ry="1" transform="translate(-5.21 11.43) rotate(-45)"/><path d="M23.35,16.8l.63-.63a5,5,0,0,0,.63-.77H22.23l-.29,0L20.52,16.8,32,28.28V32H28.86l-1.77-1.76v-2.8H23.41v-3H18.8l-3-3L14,23.31a3,3,0,0,1-4.24,0L4.5,18a3,3,0,0,1,0-4.24l8.56-8.56a3,3,0,0,1,4.24,0L20.1,8.06l1-1.79L18.71,3.84a5,5,0,0,0-7.07,0L3.09,12.39a5,5,0,0,0,0,7.07l5.26,5.26a5,5,0,0,0,7.07,0l.4-.4L18,26.48h3.44v3h3.69v1.63L28,34h6V27.45Z"/>',

  outlineBadged:
    '<rect x="6.33" y="10.71" width="9.71" height="2.57" rx="1" ry="1" transform="translate(-5.21 11.43) rotate(-45)"/><path d="M23.35,16.8l.63-.63A5,5,0,0,0,24,9.1L18.71,3.84a5,5,0,0,0-7.07,0L3.09,12.39a5,5,0,0,0,0,7.07l5.26,5.26a5,5,0,0,0,7.07,0l.4-.4L18,26.48h3.44v3h3.69v1.63L28,34h6V27.45ZM32,32H28.86l-1.77-1.76v-2.8H23.41v-3H18.8l-3-3L14,23.31a3,3,0,0,1-4.24,0L4.5,18a3,3,0,0,1,0-4.24l8.56-8.56a3,3,0,0,1,4.24,0l5.26,5.26a3,3,0,0,1,0,4.24l-2,2L32,28.28Z"/>',

  solid:
    '<path d="M23.38,16.77l.6-.6A5,5,0,0,0,24,9.1L18.71,3.84a5,5,0,0,0-7.07,0L3.09,12.39a5,5,0,0,0,0,7.07l5.26,5.26a5,5,0,0,0,7.07,0l.45-.45,2.1,2.2h3.44v3h3.69v1.63L28,34h6V27.45Zm-8.56-6.59L9.37,15.64a1,1,0,0,1-1.41,0l-.4-.4a1,1,0,0,1,0-1.41L13,8.36a1,1,0,0,1,1.41,0l.4.4A1,1,0,0,1,14.82,10.18ZM32,32H28.86l-1.77-1.76v-2.8H23.41v-3H18.8l-1.52-1.61L22,18.18,32,28.28Z"/>',

  solidAlerted:
    '<path d="M23.38,16.77l.6-.6a5,5,0,0,0,.63-.77H22.23A3.68,3.68,0,0,1,19,9.89l2.09-3.62L18.71,3.84a5,5,0,0,0-7.07,0L3.09,12.39a5,5,0,0,0,0,7.07l5.26,5.26a5,5,0,0,0,7.07,0l.45-.45,2.1,2.2h3.44v3h3.69v1.63L28,34h6V27.45Zm-8.56-6.59L9.37,15.64a1,1,0,0,1-1.41,0l-.4-.4a1,1,0,0,1,0-1.41L13,8.36a1,1,0,0,1,1.41,0l.4.4A1,1,0,0,1,14.82,10.18ZM32,32H28.86l-1.77-1.76v-2.8H23.41v-3H18.8l-1.52-1.61L22,18.18,32,28.28Z"/>',

  solidBadged:
    '<path d="M23.38,16.77l.6-.6A5,5,0,0,0,24,9.1L18.71,3.84a5,5,0,0,0-7.07,0L3.09,12.39a5,5,0,0,0,0,7.07l5.26,5.26a5,5,0,0,0,7.07,0l.45-.45,2.1,2.2h3.44v3h3.69v1.63L28,34h6V27.45Zm-8.56-6.59L9.37,15.64a1,1,0,0,1-1.41,0l-.4-.4a1,1,0,0,1,0-1.41L13,8.36a1,1,0,0,1,1.41,0l.4.4A1,1,0,0,1,14.82,10.18ZM32,32H28.86l-1.77-1.76v-2.8H23.41v-3H18.8l-1.52-1.61L22,18.18,32,28.28Z"/>',
};

export const keyIconName = 'key';
export const keyIcon: IconShapeTuple = [keyIconName, renderIcon(icon)];
