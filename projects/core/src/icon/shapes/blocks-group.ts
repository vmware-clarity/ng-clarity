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
    '<path d="M33.53,18.76,26.6,15.57V6.43A1,1,0,0,0,26,5.53l-7.5-3.45a1,1,0,0,0-.84,0l-7.5,3.45a1,1,0,0,0-.58.91v9.14L2.68,18.76a1,1,0,0,0-.58.91v9.78h0a1,1,0,0,0,.58.91l7.5,3.45a1,1,0,0,0,.84,0l7.08-3.26,7.08,3.26a1,1,0,0,0,.84,0l7.5-3.45a1,1,0,0,0,.58-.91h0V19.67A1,1,0,0,0,33.53,18.76Zm-2.81.91L25.61,22,20.5,19.67l5.11-2.35ZM18.1,4.08l5.11,2.35L18.1,8.78,13,6.43ZM10.6,17.31l5.11,2.35L10.6,22,5.49,19.67Zm6.5,11.49-6.5,3-6.5-3V21.23L10.18,24A1,1,0,0,0,11,24l6.08-2.8ZM11.6,15.57h0V8l6.08,2.8a1,1,0,0,0,.84,0L24.6,8v7.58h0l-6.5,3ZM32.11,28.81l-6.5,3-6.51-3V21.22L25.19,24A1,1,0,0,0,26,24l6.08-2.8Z"/>',

  outlineAlerted:
    '<path d="M33.53,18.76,26.6,15.57h-2v0l-6.5,3-6.5-3V8l6.08,2.8a1,1,0,0,0,.84,0l.24-.11a4.17,4.17,0,0,1,.29-.65l1.33-2.31-2.28,1L13,6.43l5.1-2.35,3.47,1.6,1-1.73L18.5,2.08a1,1,0,0,0-.84,0l-7.5,3.45a1,1,0,0,0-.58.91v9.14l-6.9,3.18a1,1,0,0,0-.58.91v9.78a1,1,0,0,0,.58.91l7.5,3.45a1,1,0,0,0,.84,0l7.08-3.26,7.08,3.26a1,1,0,0,0,.84,0l7.5-3.45a1,1,0,0,0,.58-.91V19.67A1,1,0,0,0,33.53,18.76ZM10.6,17.31l5.11,2.35L10.6,22,5.49,19.67Zm0,14.49-6.5-3V21.23L10.18,24A1,1,0,0,0,11,24l6.08-2.8,0,7.6Zm15-14.48,5.11,2.35L25.61,22,20.5,19.67Zm0,14.49-6.51-3V21.22L25.19,24A1,1,0,0,0,26,24l6.08-2.8,0,7.61Z"/>',

  outlineBadged:
    '<path d="M33.53,18.76,26.6,15.57V12.7a7.58,7.58,0,0,1-2-1.51v4.39l-6.5,3-6.5-3V8l6.08,2.8a1,1,0,0,0,.84,0L23,8.72a7.05,7.05,0,0,1-.47-2l-4.47,2L13,6.43l5.1-2.35,4.44,2s0-.06,0-.09a7.55,7.55,0,0,1,.27-2l-4.3-2a1,1,0,0,0-.84,0l-7.5,3.45a1,1,0,0,0-.58.91v9.14l-6.9,3.18a1,1,0,0,0-.58.91v9.78a1,1,0,0,0,.58.91l7.5,3.45a1,1,0,0,0,.84,0l7.08-3.26,7.08,3.26a1,1,0,0,0,.84,0l7.5-3.45a1,1,0,0,0,.58-.91V19.67A1,1,0,0,0,33.53,18.76ZM10.6,17.31l5.11,2.35L10.6,22,5.49,19.67Zm0,14.49-6.5-3V21.23L10.18,24A1,1,0,0,0,11,24l6.08-2.8,0,7.6Zm15-14.48,5.11,2.35L25.61,22,20.5,19.67Zm0,14.49-6.51-3V21.22L25.19,24A1,1,0,0,0,26,24l6.08-2.8,0,7.61Z"/>',

  solid:
    '<path d="M33.53,18.76,26.6,15.57V6.43A1,1,0,0,0,26,5.53l-7.5-3.45a1,1,0,0,0-.84,0l-7.5,3.45a1,1,0,0,0-.58.91v9.14L2.68,18.76a1,1,0,0,0-.58.91v9.78h0a1,1,0,0,0,.58.91l7.5,3.45a1,1,0,0,0,.84,0l7.08-3.26,7.08,3.26a1,1,0,0,0,.84,0l7.5-3.45a1,1,0,0,0,.58-.91h0V19.67A1,1,0,0,0,33.53,18.76ZM25.61,22,20.5,19.67l5.11-2.35,5.11,2.35Zm-1-6.44-6.44,3V10.87a1,1,0,0,0,.35-.08L24.6,8v7.58ZM18.1,4.08l5.11,2.35L18.1,8.78,13,6.43ZM10.6,17.31l5.11,2.35L10.6,22,5.49,19.67Zm6.5,11.49-6.5,3h0V24.11h0A1,1,0,0,0,11,24l6.08-2.8Zm15,0-6.46,3V24.11A1,1,0,0,0,26,24l6.08-2.8Z"/>',

  solidAlerted:
    '<path d="M33.53,18.76,26.6,15.57v0h-2v0l-6.43,3V10.87a1.05,1.05,0,0,0,.35-.08l.14-.06A3.23,3.23,0,0,1,19,10l1.28-2.22-2.14,1L13,6.43l5.1-2.35,3.39,1.56,1-1.73-4-1.83a1,1,0,0,0-.84,0l-7.5,3.45a1,1,0,0,0-.58.91v9.14l-6.9,3.18a1,1,0,0,0-.58.91v9.78a1,1,0,0,0,.58.91l7.5,3.45a1,1,0,0,0,.84,0l7.08-3.26,7.08,3.26a1,1,0,0,0,.84,0l7.5-3.45a1,1,0,0,0,.58-.91V19.67A1,1,0,0,0,33.53,18.76Zm-28,.91,5.11-2.36,5.11,2.35L10.6,22ZM10.6,31.8V24.11A1.08,1.08,0,0,0,11,24l6.08-2.8,0,7.6Zm9.9-12.13,5.11-2.35,5.11,2.35L25.61,22ZM25.64,31.8V24.11A.89.89,0,0,0,26,24l6.08-2.8,0,7.6Z"/>',

  solidBadged:
    '<path d="M33.53,18.76,26.6,15.57V12.69a7.66,7.66,0,0,1-2-1.47v4.34l-6.43,3V10.87a1.05,1.05,0,0,0,.35-.08L23,8.73a7.65,7.65,0,0,1-.48-2l-4.42,2L13,6.43l5.1-2.35,4.38,2V6a7.55,7.55,0,0,1,.27-2L18.5,2.08a1,1,0,0,0-.84,0l-7.5,3.45a1,1,0,0,0-.58.91v9.14l-6.9,3.18a1,1,0,0,0-.58.91v9.78a1,1,0,0,0,.58.91l7.5,3.45a1,1,0,0,0,.84,0l7.08-3.26,7.08,3.26a1,1,0,0,0,.84,0l7.5-3.45a1,1,0,0,0,.58-.91V19.67A1,1,0,0,0,33.53,18.76Zm-28,.91,5.11-2.36,5.11,2.35L10.6,22ZM10.6,31.8V24.11A1.08,1.08,0,0,0,11,24l6.08-2.8,0,7.6Zm9.9-12.13,5.11-2.35,5.11,2.35L25.61,22ZM25.64,31.8V24.11A.89.89,0,0,0,26,24l6.08-2.8,0,7.6Z"/>',
};

export const blocksGroupIconName = 'blocks-group';
export const blocksGroupIcon: IconShapeTuple = [blocksGroupIconName, renderIcon(icon)];
