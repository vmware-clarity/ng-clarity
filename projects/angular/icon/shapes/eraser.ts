/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { renderIcon } from '../icon.renderer';
import { IconShapeTuple } from '../interfaces/icon.interfaces';

const icon = {
  outline:
    '<path d="M33.04 9.7L28.28 4.93C27.04 3.69 24.88 3.69 23.64 4.93L4.9 23.68C3.62 24.96 3.62 27.04 4.9 28.32L6.58 30H3C2.45 30 2 30.45 2 31C2 31.55 2.45 32 3 32H24.96C25.51 32 25.96 31.55 25.96 31C25.96 30.45 25.51 30 24.96 30H17.39L33.04 14.33C34.32 13.05 34.32 10.97 33.04 9.69V9.7ZM14.57 30H9.41L6.32 26.91C5.82 26.41 5.82 25.6 6.32 25.1L10.99 20.43L17.57 27.01L14.57 30.01V30ZM31.63 12.92L18.97 25.59L12.39 19.01L25.05 6.34C25.54 5.85 26.38 5.85 26.86 6.34L31.62 11.11C32.12 11.61 32.12 12.42 31.62 12.92H31.63Z"/>',
  solid:
    '<path d="M24.96 29.9858H17.39L19 28.3764L9.6 18.9898L4.9 23.6881C3.62 24.9676 3.62 27.0469 4.9 28.3264L6.58 29.9958H3C2.45 29.9958 2 30.4457 2 30.9955C2 31.5453 2.45 31.9951 3 31.9951H24.96C25.51 31.9951 25.96 31.5453 25.96 30.9955C25.96 30.4457 25.51 29.9958 24.96 29.9958V29.9858ZM33.04 9.71307L28.28 4.95477C27 3.67523 24.92 3.67523 23.64 4.95477L11.01 17.5803L20.41 26.9769L33.04 14.3514C34.32 13.0719 34.32 10.9926 33.04 9.71307Z"/>',
};

export const eraserIconName = 'eraser';
export const eraserIcon: IconShapeTuple = [eraserIconName, renderIcon(icon)];
