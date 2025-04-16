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
    '<path d="M32.88,19.92h-30a1,1,0,1,1,0-2h30a1,1,0,0,1,0,2Z"/><path d="M7.27,15.86a12.9,12.9,0,0,1,1.29-.52A5.69,5.69,0,0,1,10.39,15a3.18,3.18,0,0,1,2.75,1.11A4.44,4.44,0,0,1,14,18.85v.49a13.83,13.83,0,0,0-4.29-.74,6.19,6.19,0,0,0-2.59.54A5,5,0,0,0,5.81,20H15.88V18.85a5.67,5.67,0,0,0-1.37-4,5.16,5.16,0,0,0-4-1.49,10,10,0,0,0-3.91.88.87.87,0,0,0-.44,1.18A.84.84,0,0,0,7.27,15.86Z"/><path d="M21,20a5.94,5.94,0,0,1,.54-2.31,4.35,4.35,0,0,1,1.58-1.83,4.27,4.27,0,0,1,4.59,0,4.47,4.47,0,0,1,1.57,1.83A6.12,6.12,0,0,1,29.85,20h2a7.73,7.73,0,0,0-.78-3.19,6,6,0,0,0-2.18-2.45,5.74,5.74,0,0,0-3.1-.88,5.39,5.39,0,0,0-2.8.73,5.55,5.55,0,0,0-2,2.05V10a.87.87,0,0,0-.86-.86H20a.87.87,0,0,0-.86.86V20Z"/><path d="M29.67,22a5.61,5.61,0,0,1-.36,1.07,4.47,4.47,0,0,1-1.57,1.85,4.32,4.32,0,0,1-4.59,0,4.35,4.35,0,0,1-1.58-1.85A5.64,5.64,0,0,1,21.2,22H19.09v4.13A.87.87,0,0,0,20,27h.2a.87.87,0,0,0,.86-.86V24.51a5.58,5.58,0,0,0,2,2.06,5.48,5.48,0,0,0,2.8.72,5.66,5.66,0,0,0,3.1-.88A5.88,5.88,0,0,0,31.09,24,7.09,7.09,0,0,0,31.73,22Z"/><path d="M14,22v.76a3.34,3.34,0,0,1-1.62,2,5.34,5.34,0,0,1-2.69.72,3.78,3.78,0,0,1-2.36-.7,2.24,2.24,0,0,1-.94-1.9,2.29,2.29,0,0,1,.2-.91H4.62a4,4,0,0,0-.13,1,3.83,3.83,0,0,0,1.35,3.06A5.15,5.15,0,0,0,9.31,27.2,6,6,0,0,0,12,26.57a4.62,4.62,0,0,0,2-1.74V26a.86.86,0,0,0,.86.86H15a.86.86,0,0,0,.86-.86V22Z"/>',
};

export const strikethroughIconName = 'strikethrough';
export const strikethroughIcon: IconShapeTuple = [strikethroughIconName, renderIcon(icon)];
