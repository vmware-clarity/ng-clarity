/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { renderIcon } from '../icon.renderer.js';
import { IconShapeTuple } from '../interfaces/icon.interfaces.js';

const icon = {
  outline:
    '<path d="M33.83,23.43a1.16,1.16,0,0,0-.71-1.12l-1.68-.5c-.09-.24-.18-.48-.29-.71l.78-1.44a1.16,1.16,0,0,0-.21-1.37l-1.42-1.41a1.16,1.16,0,0,0-1.37-.2l-1.45.76a7.84,7.84,0,0,0-.76-.32l-.48-1.58a1.15,1.15,0,0,0-1.11-.77h-2a1.16,1.16,0,0,0-1.11.82l-.47,1.54a7.76,7.76,0,0,0-.77.32l-1.42-.76a1.16,1.16,0,0,0-1.36.2l-1.45,1.4a1.16,1.16,0,0,0-.21,1.38L17.08,21a7.64,7.64,0,0,0-.31.74l-1.58.47a1.15,1.15,0,0,0-.83,1.11v2a1.15,1.15,0,0,0,.83,1.1l1.59.47a7.53,7.53,0,0,0,.31.72l-.78,1.46a1.16,1.16,0,0,0,.21,1.37l1.42,1.4a1.16,1.16,0,0,0,1.37.21l1.48-.78c.23.11.47.2.72.29L22,33.18a1.16,1.16,0,0,0,1.11.81h2a1.16,1.16,0,0,0,1.11-.82l.47-1.58c.24-.08.47-.18.7-.29l1.5.79a1.16,1.16,0,0,0,1.36-.2l1.42-1.4a1.16,1.16,0,0,0,.21-1.38l-.79-1.45q.16-.34.29-.69L33,26.5a1.15,1.15,0,0,0,.83-1.11Zm-1.6,1.63-2.11.62-.12.42a6,6,0,0,1-.5,1.19l-.21.38,1,1.91-1,1-2-1-.37.2a6.21,6.21,0,0,1-1.2.49l-.42.12-.63,2.09H23.42l-.63-2.08-.42-.12a6.23,6.23,0,0,1-1.21-.49l-.37-.2-1.94,1-1-1,1-1.94-.22-.38A6,6,0,0,1,18.17,26L18,25.63,16,25V23.69L18,23.08l.13-.41a5.94,5.94,0,0,1,.53-1.23L18.9,21l-1-1.85,1-.94,1.89,1,.38-.21a6.23,6.23,0,0,1,1.26-.52l.41-.12.63-2h1.38l.62,2,.41.12A6.21,6.21,0,0,1,27.1,19l.38.21,1.92-1,1,1-1,1.89.21.38a6.08,6.08,0,0,1,.5,1.21l.12.42,2.06.61Z"/><path d="M24.12,20.35a4,4,0,1,0,4.08,4A4.06,4.06,0,0,0,24.12,20.35Zm0,6.46a2.43,2.43,0,1,1,2.48-2.43A2.46,2.46,0,0,1,24.12,26.82Z"/><path d="M14.49,31H6V5H26v7.89a3.2,3.2,0,0,1,2,1.72V5a2,2,0,0,0-2-2H6A2,2,0,0,0,4,5V31a2,2,0,0,0,2,2H16.23l-1.1-1.08A3.11,3.11,0,0,1,14.49,31Z"/>',

  outlineAlerted:
    '<path d="M24.12,20.35a4,4,0,1,0,4.08,4A4.06,4.06,0,0,0,24.12,20.35Zm0,6.46a2.43,2.43,0,1,1,2.48-2.43A2.46,2.46,0,0,1,24.12,26.82Z"/><path d="M33.83,23.43a1.16,1.16,0,0,0-.71-1.12l-1.68-.5c-.09-.24-.18-.48-.29-.71l.78-1.44a1.16,1.16,0,0,0-.21-1.37l-1.42-1.41a1.16,1.16,0,0,0-1.37-.2l-1.45.76a7.84,7.84,0,0,0-.76-.32l-.48-1.58a1.15,1.15,0,0,0-1.11-.77h-2a1.16,1.16,0,0,0-1.11.82l-.47,1.54a7.76,7.76,0,0,0-.77.32l-1.42-.76a1.16,1.16,0,0,0-1.36.2l-1.45,1.4a1.16,1.16,0,0,0-.21,1.38L17.08,21a7.64,7.64,0,0,0-.31.74l-1.58.47a1.15,1.15,0,0,0-.83,1.11v2a1.15,1.15,0,0,0,.83,1.1l1.59.47a7.53,7.53,0,0,0,.31.72l-.78,1.46a1.16,1.16,0,0,0,.21,1.37l1.42,1.4a1.16,1.16,0,0,0,1.37.21l1.48-.78c.23.11.47.2.72.29L22,33.18a1.16,1.16,0,0,0,1.11.81h2a1.16,1.16,0,0,0,1.11-.82l.47-1.58c.24-.08.47-.18.7-.29l1.5.79a1.16,1.16,0,0,0,1.36-.2l1.42-1.4a1.16,1.16,0,0,0,.21-1.38l-.79-1.45q.16-.34.29-.69L33,26.5a1.15,1.15,0,0,0,.83-1.11Zm-1.6,1.63-2.11.62-.12.42a6,6,0,0,1-.5,1.19l-.21.38,1,1.91-1,1-2-1-.37.2a6.21,6.21,0,0,1-1.2.49l-.42.12-.63,2.09H23.42l-.63-2.08-.42-.12a6.23,6.23,0,0,1-1.21-.49l-.37-.2-1.94,1-1-1,1-1.94-.22-.38A6,6,0,0,1,18.17,26L18,25.63,16,25V23.69L18,23.08l.13-.41a5.94,5.94,0,0,1,.53-1.23L18.9,21l-1-1.85,1-.94,1.89,1,.38-.21a6.23,6.23,0,0,1,1.26-.52l.41-.12.63-2h1.38l.62,2,.41.12A6.21,6.21,0,0,1,27.1,19l.38.21,1.92-1,1,1-1,1.89.21.38a6.08,6.08,0,0,1,.5,1.21l.12.42,2.06.61Z"/><path d="M14.49,31H6V5H21.87L23,3H6A2,2,0,0,0,4,5V31a2,2,0,0,0,2,2H16.23l-1.1-1.08A3.11,3.11,0,0,1,14.49,31Z"/>',

  outlineBadged:
    '<path d="M33.83,23.43a1.16,1.16,0,0,0-.71-1.12l-1.68-.5c-.09-.24-.18-.48-.29-.71l.78-1.44a1.16,1.16,0,0,0-.21-1.37l-1.42-1.41a1.16,1.16,0,0,0-1.37-.2l-1.45.76a7.84,7.84,0,0,0-.76-.32l-.48-1.58a1.15,1.15,0,0,0-1.11-.77h-2a1.16,1.16,0,0,0-1.11.82l-.47,1.54a7.76,7.76,0,0,0-.77.32l-1.42-.76a1.16,1.16,0,0,0-1.36.2l-1.45,1.4a1.16,1.16,0,0,0-.21,1.38L17.08,21a7.64,7.64,0,0,0-.31.74l-1.58.47a1.15,1.15,0,0,0-.83,1.11v2a1.15,1.15,0,0,0,.83,1.1l1.59.47a7.53,7.53,0,0,0,.31.72l-.78,1.46a1.16,1.16,0,0,0,.21,1.37l1.42,1.4a1.16,1.16,0,0,0,1.37.21l1.48-.78c.23.11.47.2.72.29L22,33.18a1.16,1.16,0,0,0,1.11.81h2a1.16,1.16,0,0,0,1.11-.82l.47-1.58c.24-.08.47-.18.7-.29l1.5.79a1.16,1.16,0,0,0,1.36-.2l1.42-1.4a1.16,1.16,0,0,0,.21-1.38l-.79-1.45q.16-.34.29-.69L33,26.5a1.15,1.15,0,0,0,.83-1.11Zm-1.6,1.63-2.11.62-.12.42a6,6,0,0,1-.5,1.19l-.21.38,1,1.91-1,1-2-1-.37.2a6.21,6.21,0,0,1-1.2.49l-.42.12-.63,2.09H23.42l-.63-2.08-.42-.12a6.23,6.23,0,0,1-1.21-.49l-.37-.2-1.94,1-1-1,1-1.94-.22-.38A6,6,0,0,1,18.17,26L18,25.63,16,25V23.69L18,23.08l.13-.41a5.94,5.94,0,0,1,.53-1.23L18.9,21l-1-1.85,1-.94,1.89,1,.38-.21a6.23,6.23,0,0,1,1.26-.52l.41-.12.63-2h1.38l.62,2,.41.12A6.21,6.21,0,0,1,27.1,19l.38.21,1.92-1,1,1-1,1.89.21.38a6.08,6.08,0,0,1,.5,1.21l.12.42,2.06.61Z"/><path d="M24.12,20.35a4,4,0,1,0,4.08,4A4.06,4.06,0,0,0,24.12,20.35Zm0,6.46a2.43,2.43,0,1,1,2.48-2.43A2.46,2.46,0,0,1,24.12,26.82Z"/><path d="M14.49,31H6V5H23.08a6.94,6.94,0,0,1,.6-2H6A2,2,0,0,0,4,5V31a2,2,0,0,0,2,2H16.23l-1.1-1.08A3.11,3.11,0,0,1,14.49,31Z"/><path d="M28,15.33V12.71a7,7,0,0,1-2-1v1.88A3.2,3.2,0,0,1,28,15.33Z"/>',

  solid:
    '<path d="M15.55,31H6V5H26v8.78a2.37,2.37,0,0,1,2,1.57V5a2,2,0,0,0-2-2H6A2,2,0,0,0,4,5V31a2,2,0,0,0,2,2H17.16l-1-1A2.38,2.38,0,0,1,15.55,31Z"/><path d="M33.54,23.47l-2-.61a7.06,7.06,0,0,0-.58-1.41l1-1.86a.37.37,0,0,0-.07-.44L30.41,17.7a.37.37,0,0,0-.44-.07l-1.85,1A7,7,0,0,0,26.69,18l-.61-2a.37.37,0,0,0-.36-.25h-2a.37.37,0,0,0-.35.26l-.61,2a7,7,0,0,0-1.44.61l-1.82-1a.37.37,0,0,0-.44.07l-1.47,1.44a.37.37,0,0,0-.07.44l1,1.82a7,7,0,0,0-.61,1.44l-2,.61a.37.37,0,0,0-.26.35v2a.37.37,0,0,0,.26.35l2,.61a7,7,0,0,0,.61,1.41l-1,1.9a.37.37,0,0,0,.07.44L19,32a.37.37,0,0,0,.44.07l1.87-1a7.06,7.06,0,0,0,1.39.57l.61,2a.37.37,0,0,0,.35.26h2a.37.37,0,0,0,.35-.26l.61-2a7,7,0,0,0,1.38-.57l1.89,1a.37.37,0,0,0,.44-.07l1.45-1.45a.37.37,0,0,0,.07-.44l-1-1.88a7.06,7.06,0,0,0,.58-1.39l2-.61a.37.37,0,0,0,.26-.35V23.83A.37.37,0,0,0,33.54,23.47ZM24.7,28.19A3.33,3.33,0,1,1,28,24.86,3.33,3.33,0,0,1,24.7,28.19Z"/>',

  solidAlerted:
    '<path d="M33.54,23.47l-2-.61a7.06,7.06,0,0,0-.58-1.41l1-1.86a.37.37,0,0,0-.07-.44L30.41,17.7a.37.37,0,0,0-.44-.07l-1.85,1A7,7,0,0,0,26.69,18l-.61-2a.37.37,0,0,0-.36-.25h-2a.37.37,0,0,0-.35.26l-.61,2a7,7,0,0,0-1.44.61l-1.82-1a.37.37,0,0,0-.44.07l-1.47,1.44a.37.37,0,0,0-.07.44l1,1.82a7,7,0,0,0-.61,1.44l-2,.61a.37.37,0,0,0-.26.35v2a.37.37,0,0,0,.26.35l2,.61a7,7,0,0,0,.61,1.41l-1,1.9a.37.37,0,0,0,.07.44L19,32a.37.37,0,0,0,.44.07l1.87-1a7.06,7.06,0,0,0,1.39.57l.61,2a.37.37,0,0,0,.35.26h2a.37.37,0,0,0,.35-.26l.61-2a7,7,0,0,0,1.38-.57l1.89,1a.37.37,0,0,0,.44-.07l1.45-1.45a.37.37,0,0,0,.07-.44l-1-1.88a7.06,7.06,0,0,0,.58-1.39l2-.61a.37.37,0,0,0,.26-.35V23.83A.37.37,0,0,0,33.54,23.47ZM24.7,28.19A3.33,3.33,0,1,1,28,24.86,3.33,3.33,0,0,1,24.7,28.19Z"/><path d="M15.55,31H6V5H21.87L23,3H6A2,2,0,0,0,4,5V31a2,2,0,0,0,2,2H17.16l-1-1A2.38,2.38,0,0,1,15.55,31Z"/>',

  solidBadged:
    '<path d="M33.54,23.47l-2-.61a7.06,7.06,0,0,0-.58-1.41l1-1.86a.37.37,0,0,0-.07-.44L30.41,17.7a.37.37,0,0,0-.44-.07l-1.85,1A7,7,0,0,0,26.69,18l-.61-2a.37.37,0,0,0-.36-.25h-2a.37.37,0,0,0-.35.26l-.61,2a7,7,0,0,0-1.44.61l-1.82-1a.37.37,0,0,0-.44.07l-1.47,1.44a.37.37,0,0,0-.07.44l1,1.82a7,7,0,0,0-.61,1.44l-2,.61a.37.37,0,0,0-.26.35v2a.37.37,0,0,0,.26.35l2,.61a7,7,0,0,0,.61,1.41l-1,1.9a.37.37,0,0,0,.07.44L19,32a.37.37,0,0,0,.44.07l1.87-1a7.06,7.06,0,0,0,1.39.57l.61,2a.37.37,0,0,0,.35.26h2a.37.37,0,0,0,.35-.26l.61-2a7,7,0,0,0,1.38-.57l1.89,1a.37.37,0,0,0,.44-.07l1.45-1.45a.37.37,0,0,0,.07-.44l-1-1.88a7.06,7.06,0,0,0,.58-1.39l2-.61a.37.37,0,0,0,.26-.35V23.83A.37.37,0,0,0,33.54,23.47ZM24.7,28.19A3.33,3.33,0,1,1,28,24.86,3.33,3.33,0,0,1,24.7,28.19Z"/><path d="M15.55,31H6V5H23.08a6.94,6.94,0,0,1,.6-2H6A2,2,0,0,0,4,5V31a2,2,0,0,0,2,2H17.16l-1-1A2.38,2.38,0,0,1,15.55,31Z"/><path d="M28,15.36V12.71a7,7,0,0,1-2-1v2A2.37,2.37,0,0,1,28,15.36Z"/>',
};

export const fileSettingsIconName = 'file-settings';
export const fileSettingsIcon: IconShapeTuple = [fileSettingsIconName, renderIcon(icon)];
