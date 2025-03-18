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
    '<path d="M9 26C7.35 26 6 24.65 6 23V13C6 11.35 7.35 10 9 10C10.65 10 12 11.35 12 13V23C12 24.65 10.65 26 9 26ZM9 12C8.45 12 8 12.45 8 13V23C8 23.55 8.45 24 9 24C9.55 24 10 23.55 10 23V13C10 12.45 9.55 12 9 12Z"/><path d="M5 23C3.35 23 2 21.65 2 20V16C2 14.35 3.35 13 5 13C6.65 13 8 14.35 8 16V20C8 21.65 6.65 23 5 23ZM5 15C4.45 15 4 15.45 4 16V20C4 20.55 4.45 21 5 21C5.55 21 6 20.55 6 20V16C6 15.45 5.55 15 5 15Z"/><path d="M27 26C25.35 26 24 24.65 24 23V13C24 11.35 25.35 10 27 10C28.65 10 30 11.35 30 13V23C30 24.65 28.65 26 27 26ZM27 12C26.45 12 26 12.45 26 13V23C26 23.55 26.45 24 27 24C27.55 24 28 23.55 28 23V13C28 12.45 27.55 12 27 12Z"/><path d="M31 23C29.35 23 28 21.65 28 20V16C28 14.35 29.35 13 31 13C32.65 13 34 14.35 34 16V20C34 21.65 32.65 23 31 23ZM31 15C30.45 15 30 15.45 30 16V20C30 20.55 30.45 21 31 21C31.55 21 32 20.55 32 20V16C32 15.45 31.55 15 31 15Z"/><path d="M25 17H11V19H25V17Z"/>',
  solid:
    '<path d="M9 26C7.35 26 6 24.65 6 23V13C6 11.35 7.35 10 9 10C10.65 10 12 11.35 12 13V23C12 24.65 10.65 26 9 26Z"/><path d="M5 23C3.35 23 2 21.65 2 20V16C2 14.35 3.35 13 5 13C6.65 13 8 14.35 8 16V20C8 21.65 6.65 23 5 23Z"/><path d="M27 26C25.35 26 24 24.65 24 23V13C24 11.35 25.35 10 27 10C28.65 10 30 11.35 30 13V23C30 24.65 28.65 26 27 26Z"/><path d="M31 23C29.35 23 28 21.65 28 20V16C28 14.35 29.35 13 31 13C32.65 13 34 14.35 34 16V20C34 21.65 32.65 23 31 23Z"/><path d="M25 17H11V19H25V17Z"/>',
};

export const gymIconName = 'gym';
export const gymIcon: IconShapeTuple = [gymIconName, renderIcon(icon)];
