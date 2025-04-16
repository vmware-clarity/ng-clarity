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
    '<path d="M26.13 32H9.87C8.29 32 7 30.71 7 29.13V10.87C7 9.29 8.29 8 9.87 8H26.13C27.71 8 29 9.29 29 10.87V29.13C29 30.71 27.71 32 26.13 32ZM9.87 10C9.39 10 9 10.39 9 10.87V29.13C9 29.61 9.39 30 9.87 30H26.13C26.61 30 27 29.61 27 29.13V10.87C27 10.39 26.61 10 26.13 10H9.87Z"/><path d="M12 34C11.45 34 11 33.55 11 33V31C11 30.45 11.45 30 12 30C12.55 30 13 30.45 13 31V33C13 33.55 12.55 34 12 34Z"/><path d="M24 34C23.45 34 23 33.55 23 33V31C23 30.45 23.45 30 24 30C24.55 30 25 30.45 25 31V33C25 33.55 24.55 34 24 34Z"/><path d="M22 6H20V4H16V6H14V3C14 2.45 14.45 2 15 2H21C21.55 2 22 2.45 22 3V6Z"/><path d="M13 28C12.45 28 12 27.55 12 27V13C12 12.45 12.45 12 13 12C13.55 12 14 12.45 14 13V27C14 27.55 13.55 28 13 28Z"/><path d="M18 28C17.45 28 17 27.55 17 27V13C17 12.45 17.45 12 18 12C18.55 12 19 12.45 19 13V27C19 27.55 18.55 28 18 28Z"/><path d="M23 28C22.45 28 22 27.55 22 27V13C22 12.45 22.45 12 23 12C23.55 12 24 12.45 24 13V27C24 27.55 23.55 28 23 28Z"/>',
  solid:
    '<path d="M12 34C11.45 34 11 33.55 11 33V31C11 30.45 11.45 30 12 30C12.55 30 13 30.45 13 31V33C13 33.55 12.55 34 12 34Z"/><path d="M24 34C23.45 34 23 33.55 23 33V31C23 30.45 23.45 30 24 30C24.55 30 25 30.45 25 31V33C25 33.55 24.55 34 24 34Z"/><path d="M22 6H20V4H16V6H14V3C14 2.45 14.45 2 15 2H21C21.55 2 22 2.45 22 3V6Z"/><path d="M26.13 8H9.87C8.29 8 7 9.29 7 10.87V29.13C7 30.71 8.29 32 9.87 32H26.13C27.71 32 29 30.71 29 29.13V10.87C29 9.29 27.71 8 26.13 8ZM14 27C14 27.55 13.55 28 13 28C12.45 28 12 27.55 12 27V13C12 12.45 12.45 12 13 12C13.55 12 14 12.45 14 13V27ZM19 27C19 27.55 18.55 28 18 28C17.45 28 17 27.55 17 27V13C17 12.45 17.45 12 18 12C18.55 12 19 12.45 19 13V27ZM24 27C24 27.55 23.55 28 23 28C22.45 28 22 27.55 22 27V13C22 12.45 22.45 12 23 12C23.55 12 24 12.45 24 13V27Z"/>',
};

export const suitcaseIconName = 'suitcase';
export const suitcaseIcon: IconShapeTuple = [suitcaseIconName, renderIcon(icon)];
