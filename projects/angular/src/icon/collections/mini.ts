/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClarityIcons } from '../icon.service';
import { IconAlias, IconShapeTuple } from '../interfaces/icon.interfaces';
import { arrowMiniIcon } from '../shapes/arrow-mini';
import { calendarMiniIcon } from '../shapes/calendar-mini';
import { checkCircleMiniIcon } from '../shapes/check-circle-mini';
import { checkMiniIcon } from '../shapes/check-mini';
import { errorMiniIcon } from '../shapes/error-mini';
import { eventMiniIcon } from '../shapes/event-mini';
import { filterGridCircleMiniIcon } from '../shapes/filter-grid-circle-mini';
import { filterGridMiniIcon } from '../shapes/filter-grid-mini';
import { infoCircleMiniIcon, infoCircleMiniIconName } from '../shapes/info-circle-mini';
import { timesMiniIcon, timesMiniIconName } from '../shapes/times-mini';
import { warningMiniIcon } from '../shapes/warning-mini';

export const miniCollectionIcons: IconShapeTuple[] = [
  arrowMiniIcon,
  calendarMiniIcon,
  checkCircleMiniIcon,
  checkMiniIcon,
  errorMiniIcon,
  eventMiniIcon,
  filterGridMiniIcon,
  filterGridCircleMiniIcon,
  infoCircleMiniIcon,
  timesMiniIcon,
  warningMiniIcon,
];

export const miniCollectionAliases: IconAlias[] = [
  [timesMiniIconName, ['close-mini']],
  [infoCircleMiniIconName, ['info-mini']],
];

/**
 * Function that can be called to load the mini icon set.
 *
 * ```typescript@clr/angular';
 *
 * loadMiniIconSet();
 * ```
 *
 */
export function loadMiniIconSet() {
  ClarityIcons.addIcons(...miniCollectionIcons);
  ClarityIcons.addAliases(...miniCollectionAliases);
}

// declare module '@clr/angular' {
//   interface IconRegistrySources {
//     [arrowMiniIconName]: string;
//     [calendarMiniIconName]: string;
//     [checkMiniIconName]: string;
//     [checkCircleMiniIconName]: string;
//     [errorMiniIconName]: string;
//     [eventMiniIconName]: string;
//     [filterGridMiniIconName]: string;
//     [filterGridCircleMiniIconName]: string;
//     [infoCircleMiniIconName]: string;
//     [timesMiniIconName]: string;
//     [warningMiniIconName]: string;
//   }
// }
