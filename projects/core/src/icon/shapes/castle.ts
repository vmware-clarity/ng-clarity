/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { renderIcon } from '../icon.renderer.js';
import { IconShapeTuple } from '../interfaces/icon.interfaces.js';

const icon = {
  outline:
    '<path d="M33 14H3C2.45 14 2 13.55 2 13V3C2 2.45 2.45 2 3 2H9C9.55 2 10 2.45 10 3V6H14V3C14 2.45 14.45 2 15 2H21C21.55 2 22 2.45 22 3V6H26V3C26 2.45 26.45 2 27 2H33C33.55 2 34 2.45 34 3V13C34 13.55 33.55 14 33 14ZM4 12H32V4H28V7C28 7.55 27.55 8 27 8H21C20.45 8 20 7.55 20 7V4H16V7C16 7.55 15.55 8 15 8H9C8.45 8 8 7.55 8 7V4H4V12Z"/><path d="M29 34H7C6.45 34 6 33.55 6 33V16H8V32H28V16H30V33C30 33.55 29.55 34 29 34Z"/><path d="M21 28H15C14.45 28 14 27.55 14 27V22C14 19.79 15.79 18 18 18C20.21 18 22 19.79 22 22V27C22 27.55 21.55 28 21 28ZM16 26H20V22C20 20.9 19.1 20 18 20C16.9 20 16 20.9 16 22V26Z"/>',
  solid:
    '<path d="M33 14H3C2.45 14 2 13.55 2 13V3C2 2.45 2.45 2 3 2H9C9.55 2 10 2.45 10 3V6H14V3C14 2.45 14.45 2 15 2H21C21.55 2 22 2.45 22 3V6H26V3C26 2.45 26.45 2 27 2H33C33.55 2 34 2.45 34 3V13C34 13.55 33.55 14 33 14Z"/><path d="M28 16H6V33C6 33.55 6.45 34 7 34H29C29.55 34 30 33.55 30 33V16H28ZM22 27C22 27.55 21.55 28 21 28H15C14.45 28 14 27.55 14 27V22C14 19.79 15.79 18 18 18C20.21 18 22 19.79 22 22V27Z"/><path d="M18 20C16.9 20 16 20.9 16 22V26H20V22C20 20.9 19.1 20 18 20Z"/>',
};

export const castleIconName = 'castle';
export const castleIcon: IconShapeTuple = [castleIconName, renderIcon(icon)];
