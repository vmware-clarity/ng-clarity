/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { renderIcon } from '../icon.renderer.js';
import { IconShapeTuple } from '../interfaces/icon.interfaces.js';

const icon = {
  outline:
    '<path d="M16.17,25.86,10.81,20.5a1,1,0,0,1,1.41-1.41L16.17,23l8.64-8.64a1,1,0,0,1,1.41,1.41Z"/><path d="M32.25,6H29V8h3V30H4V8H7V6H3.75A1.78,1.78,0,0,0,2,7.81V30.19A1.78,1.78,0,0,0,3.75,32h28.5A1.78,1.78,0,0,0,34,30.19V7.81A1.78,1.78,0,0,0,32.25,6Z"/><path d="M10,10a1,1,0,0,0,1-1V3A1,1,0,0,0,9,3V9A1,1,0,0,0,10,10Z"/><path d="M26,10a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V9A1,1,0,0,0,26,10Z"/><rect x="13" y="6" width="10" height="2"/>',
  outlineAlerted:
    '<path d="M10,10a1,1,0,0,0,1-1V3A1,1,0,0,0,9,3V9A1,1,0,0,0,10,10Z"/><path d="M10.81,20.5l5.36,5.36L26.22,15.81a1,1,0,0,0,.23-.41H23.8L16.17,23l-3.94-3.94a1,1,0,0,0-1.41,1.41Z"/><polygon points="21.29 6 13 6 13 8 20.14 8 21.29 6"/><path d="M33.68,15.4H32V30H4V8H7V6H3.75A1.78,1.78,0,0,0,2,7.81V30.19A1.78,1.78,0,0,0,3.75,32h28.5A1.78,1.78,0,0,0,34,30.19V15.38Z"/>',
  outlineBadged:
    '<path d="M10.81,20.5l5.36,5.36L26.22,15.81a1,1,0,0,0-1.41-1.41L16.17,23l-3.94-3.94a1,1,0,0,0-1.41,1.41Z"/><path d="M10,10a1,1,0,0,0,1-1V3A1,1,0,0,0,9,3V9A1,1,0,0,0,10,10Z"/><path d="M32,13.22V30H4V8H7V6H3.75A1.78,1.78,0,0,0,2,7.81V30.19A1.78,1.78,0,0,0,3.75,32h28.5A1.78,1.78,0,0,0,34,30.19V12.34A7.45,7.45,0,0,1,32,13.22Z"/><path d="M22.5,6H13V8h9.78A7.49,7.49,0,0,1,22.5,6Z"/>',
  solid:
    '<path d="M10,10a1,1,0,0,0,1-1V3A1,1,0,0,0,9,3V9A1,1,0,0,0,10,10Z"/><path d="M26,10a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V9A1,1,0,0,0,26,10Z"/><path d="M32.25,6h-4V9a2.2,2.2,0,0,1-4.4,0V6H12.2V9A2.2,2.2,0,0,1,7.8,9V6h-4A1.78,1.78,0,0,0,2,7.81V30.19A1.78,1.78,0,0,0,3.75,32h28.5A1.78,1.78,0,0,0,34,30.19V7.81A1.78,1.78,0,0,0,32.25,6ZM25.94,16.58l-9.67,9.67L11,20.94A1.36,1.36,0,0,1,12.9,19l3.38,3.38L24,14.66a1.36,1.36,0,1,1,1.93,1.93Z"/>',
  solidAlerted:
    '<path d="M10,10a1,1,0,0,0,1-1V3A1,1,0,0,0,9,3V9A1,1,0,0,0,10,10Z"/><path d="M33.68,15.4H26.3a1.34,1.34,0,0,1-.36,1.18l-9.67,9.67L11,20.94A1.36,1.36,0,0,1,12.9,19l3.38,3.38,7-7h-1A3.68,3.68,0,0,1,19,9.89L21.29,6H12.2V9A2.2,2.2,0,0,1,7.8,9V6h-4A1.78,1.78,0,0,0,2,7.81V30.19A1.78,1.78,0,0,0,3.75,32h28.5A1.78,1.78,0,0,0,34,30.19V15.38Z"/>',
  solidBadged:
    '<path d="M10,10a1,1,0,0,0,1-1V3A1,1,0,0,0,9,3V9A1,1,0,0,0,10,10Z"/><path d="M30,13.5A7.5,7.5,0,0,1,22.5,6H12.2V9A2.2,2.2,0,0,1,7.8,9V6h-4A1.78,1.78,0,0,0,2,7.81V30.19A1.78,1.78,0,0,0,3.75,32h28.5A1.78,1.78,0,0,0,34,30.19V12.34A7.45,7.45,0,0,1,30,13.5Zm-4.06,3.08-9.67,9.67L11,20.94A1.36,1.36,0,0,1,12.9,19l3.38,3.38L24,14.66a1.36,1.36,0,1,1,1.93,1.93Z"/>',
};

export const eventIconName = 'event';
export const eventIcon: IconShapeTuple = [eventIconName, renderIcon(icon)];
