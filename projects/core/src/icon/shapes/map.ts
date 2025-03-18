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
    '<path d="M33.59,6.19A1,1,0,0,0,32.7,6L23.09,9,13.46,4.11a1,1,0,0,0-.84,0L2.62,8.2A1,1,0,0,0,2,9.13V29.61a1,1,0,0,0,1.38.92L13,26.58l9.59,4.92a1,1,0,0,0,.46.11,1,1,0,0,0,.3,0l10-3.12a1,1,0,0,0,.7-1V7A1,1,0,0,0,33.59,6.19ZM32,26.75l-8.32,2.6V27.06h-1.6v2l-8.4-4.31V23.06h-1.6v1.72L4,28.11V9.79l8.08-3.33V8.81h1.6V6.47l8.4,4.3v2.1h1.6V11L32,8.36Z"/><rect x="22.08" y="15.06" width="1.6" height="3.81"/><rect x="22.08" y="21.06" width="1.6" height="3.81"/><rect x="12.08" y="11.06" width="1.6" height="3.81"/><rect x="12.08" y="17.13" width="1.6" height="3.75"/>',

  outlineAlerted:
    '<rect x="22.08" y="15.06" width="1.6" height="3.81"/><rect x="22.08" y="21.06" width="1.6" height="3.81"/><rect x="12.08" y="11.06" width="1.6" height="3.81"/><rect x="12.08" y="17.13" width="1.6" height="3.75"/><path d="M33.68,15.4H32V26.75l-8.32,2.6V27.06h-1.6v2l-8.4-4.31V23.06h-1.6v1.72L4,28.11V9.79l8.08-3.33V8.81h1.6V6.47l5.67,2.9,1-1.76-6.9-3.5a1,1,0,0,0-.84,0L2.62,8.2A1,1,0,0,0,2,9.13V29.61a1,1,0,0,0,1.38.92l9.62-4,9.59,4.92a1,1,0,0,0,.46.11.76.76,0,0,0,.3,0l10-3.12a1,1,0,0,0,.7-1V15.38Z"/>',

  outlineBadged:
    '<rect x="22.08" y="21.06" width="1.6" height="3.81"/><rect x="12.08" y="11.06" width="1.6" height="3.81"/><rect x="12.08" y="17.13" width="1.6" height="3.75"/><path d="M32,13.22V26.75l-8.32,2.6V27.06h-1.6v2l-8.4-4.31V23.06h-1.6v1.72L4,28.11V9.79l8.08-3.33V8.81h1.6V6.47l8.4,4.3v2.1h1.6V11l.58-.18A7.69,7.69,0,0,1,23.12,9h0L13.46,4.11a1,1,0,0,0-.84,0L2.62,8.2A1,1,0,0,0,2,9.13V29.61a1,1,0,0,0,1.38.92l9.62-4,9.59,4.92a1,1,0,0,0,.46.11.76.76,0,0,0,.3,0l10-3.12a1,1,0,0,0,.7-1V12.31A7.55,7.55,0,0,1,32,13.22Z"/>',

  solid:
    '<path d="M33.31,7.35,25,9.94V14H23V10.29L14,5.68V9H12V5.27l-9.67,4A.53.53,0,0,0,2,9.75V30.45a.53.53,0,0,0,.74.49L12,27.12V23h2v4.53l9,4.61V28h2v3.79l8.63-2.7a.53.53,0,0,0,.37-.51V7.86A.53.53,0,0,0,33.31,7.35ZM14,21H12V17h2Zm0-6H12V11h2ZM25,26H23V22h2Zm0-6H23V16h2Z"/>',

  solidAlerted:
    '<path d="M33.68,15.4H22.23a3.68,3.68,0,0,1-3.18-5.51l.72-1.25L14,5.68V9H12V5.27l-9.67,4A.52.52,0,0,0,2,9.75v20.7a.54.54,0,0,0,.74.49L12,27.12V23h2v4.53l9,4.61V28h2v3.79l8.63-2.7a.54.54,0,0,0,.37-.51V15.38ZM14,21H12V17h2Zm0-6H12V11h2ZM25,26H23V22h2Zm0-6H23V16h2Z"/>',

  solidBadged:
    '<path d="M30,13.5a7.48,7.48,0,0,1-5-1.92V14H23V10.29L14,5.68V9H12V5.27l-9.67,4A.52.52,0,0,0,2,9.75v20.7a.54.54,0,0,0,.74.49L12,27.12V23h2v4.53l9,4.61V28h2v3.79l8.63-2.7a.54.54,0,0,0,.37-.51V12.34A7.49,7.49,0,0,1,30,13.5ZM14,21H12V17h2Zm0-6H12V11h2ZM25,26H23V22h2Zm0-6H23V16h2Z"/>',
};

export const mapIconName = 'map';
export const mapIcon: IconShapeTuple = [mapIconName, renderIcon(icon)];
