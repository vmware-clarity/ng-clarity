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
    '<path d="M31.68,6.16c-1.92-3.3-10.6-4-11.58-4.09L19,2V22.34a5.89,5.89,0,0,0-.82-.56,8.33,8.33,0,0,0-6.53-.41C7.57,22.7,4.92,26.5,5.78,29.84a5.33,5.33,0,0,0,2.66,3.32,7.48,7.48,0,0,0,3.61.88A9.54,9.54,0,0,0,15,33.57c3.67-1.18,6.17-4.33,6.06-7.36V9.34a29.14,29.14,0,0,1,6.55,1.43,1,1,0,1,0,.72-1.87A31.37,31.37,0,0,0,21,7.33V4.17c3.33.36,8,1.38,8.92,3,2,3.41-2.33,7.36-2.37,7.4a1,1,0,0,0,1.33,1.49C29.15,15.85,34.5,11,31.68,6.16ZM14.35,31.67a6.43,6.43,0,0,1-5-.26,3.31,3.31,0,0,1-1.69-2.07c-.6-2.33,1.45-5.05,4.58-6.06a7.52,7.52,0,0,1,2.3-.37,5.52,5.52,0,0,1,2.65.62,3.31,3.31,0,0,1,1.69,2.07C19.54,27.94,17.49,30.66,14.35,31.67Z"/>',
  solid:
    '<path d="M31.68,6.16c-1.92-3.3-10.6-4-11.58-4.09L19,2V22.29a5.88,5.88,0,0,0-.81-.55,8.33,8.33,0,0,0-6.53-.41c-4.12,1.33-6.77,5.13-5.91,8.47a5.33,5.33,0,0,0,2.66,3.32,7.48,7.48,0,0,0,3.61.88A9.54,9.54,0,0,0,15,33.52c3.7-1.19,6.2-4.37,6.06-7.42,0,0,0,0,0,0V8.49c1,.12,2.37.33,3.82.64a11.17,11.17,0,0,1,4.06,1.46c1,.66.38,1.9.33,2a11.8,11.8,0,0,1-1.66,2,1,1,0,0,0,1.33,1.49C29.15,15.85,34.5,11,31.68,6.16Z"/>',
};

export const musicNoteIconName = 'music-note';
export const musicNoteIcon: IconShapeTuple = [musicNoteIconName, renderIcon(icon)];
