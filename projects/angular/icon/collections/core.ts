/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClarityIcons } from '../icon.service';
import { IconAlias, IconShapeTuple } from '../interfaces/icon.interfaces';
import { angleIcon, angleIconName } from '../shapes/angle';
import { angleDoubleIcon, angleDoubleIconName } from '../shapes/angle-double';
import { arrowIcon } from '../shapes/arrow';
import { barsIcon, barsIconName } from '../shapes/bars';
import { bellIcon, bellIconName } from '../shapes/bell';
import { calendarIcon } from '../shapes/calendar';
import { checkIcon, checkIconName } from '../shapes/check';
import { checkCircleIcon } from '../shapes/check-circle';
import { cloudIcon } from '../shapes/cloud';
import { cogIcon, cogIconName } from '../shapes/cog';
import { detailCollapseIcon } from '../shapes/detail-collapse';
import { detailExpandIcon } from '../shapes/detail-expand';
import { ellipsisHorizontalIcon } from '../shapes/ellipsis-horizontal';
import { ellipsisVerticalIcon } from '../shapes/ellipsis-vertical';
import { errorStandardIcon } from '../shapes/error-standard';
import { eventIcon } from '../shapes/event';
import { exclamationCircleIcon, exclamationCircleIconName } from '../shapes/exclamation-circle';
import { exclamationTriangleIcon, exclamationTriangleIconName } from '../shapes/exclamation-triangle';
import { eyeIcon } from '../shapes/eye';
import { eyeHideIcon } from '../shapes/eye-hide';
import { filterGridIcon } from '../shapes/filter-grid';
import { filterGridCircleIcon } from '../shapes/filter-grid-circle';
import { folderIcon, folderIconName } from '../shapes/folder';
import { folderOpenIcon } from '../shapes/folder-open';
import { helpInfoIcon } from '../shapes/help-info';
import { homeIcon, homeIconName } from '../shapes/home';
import { imageIcon } from '../shapes/image';
import { infoCircleIcon, infoCircleIconName } from '../shapes/info-circle';
import { infoStandardIcon } from '../shapes/info-standard';
import { searchIcon } from '../shapes/search';
import { stepForward2Icon } from '../shapes/step-forward-2';
import { successStandardIcon } from '../shapes/success-standard';
import { timesIcon, timesIconName } from '../shapes/times';
import { unknownStatusIcon } from '../shapes/unknown-status';
import { userIcon, userIconName } from '../shapes/user';
import { viewColumnsIcon } from '../shapes/view-columns';
import { vmBugIcon } from '../shapes/vm-bug';
import { vmBugInverseIcon } from '../shapes/vm-bug-inverse';
import { warningStandardIcon } from '../shapes/warning-standard';

export const coreCollectionIcons: IconShapeTuple[] = [
  angleIcon,
  angleDoubleIcon,
  arrowIcon,
  barsIcon,
  bellIcon,
  calendarIcon,
  checkIcon,
  checkCircleIcon,
  cloudIcon,
  cogIcon,
  ellipsisHorizontalIcon,
  ellipsisVerticalIcon,
  errorStandardIcon,
  eventIcon,
  exclamationCircleIcon,
  exclamationTriangleIcon,
  eyeIcon,
  eyeHideIcon,
  filterGridIcon,
  filterGridCircleIcon,
  folderIcon,
  folderOpenIcon,
  helpInfoIcon,
  homeIcon,
  imageIcon,
  infoCircleIcon,
  infoStandardIcon,
  searchIcon,
  stepForward2Icon,
  successStandardIcon,
  timesIcon,
  unknownStatusIcon,
  userIcon,
  viewColumnsIcon,
  vmBugIcon,
  vmBugInverseIcon,
  warningStandardIcon,
  detailExpandIcon,
  detailCollapseIcon,
];

export const coreCollectionAliases: IconAlias[] = [
  [homeIconName, ['house']],
  [cogIconName, ['settings']],
  [checkIconName, ['success']],
  [timesIconName, ['close']],
  [exclamationTriangleIconName, ['warning']],
  [exclamationCircleIconName, ['error']],
  [infoCircleIconName, ['info']],
  [barsIconName, ['menu']],
  [userIconName, ['avatar']],
  [angleIconName, ['caret']],
  [folderIconName, ['directory']],
  [bellIconName, ['notification']],
  [angleDoubleIconName, ['collapse']],
];

/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadCoreIconSet } from '@clr/angular';
 *
 * loadCoreIconSet();
 * ```
 *
 */
export function loadCoreIconSet() {
  ClarityIcons.addIcons(...coreCollectionIcons);
  ClarityIcons.addAliases(...coreCollectionAliases);
}

// declare module '@clr/angular' {
//   interface IconRegistrySources {
//     [unknownIconName]: string;
//     [angleIconName]: string;
//     [angleDoubleIconName]: string;
//     [arrowIconName]: string;
//     [barsIconName]: string;
//     [bellIconName]: string;
//     [calendarIconName]: string;
//     [checkIconName]: string;
//     [checkCircleIconName]: string;
//     [cloudIconName]: string;
//     [cogIconName]: string;
//     [ellipsisHorizontalIconName]: string;
//     [ellipsisVerticalIconName]: string;
//     [errorStandardIconName]: string;
//     [eventIconName]: string;
//     [exclamationCircleIconName]: string;
//     [exclamationTriangleIconName]: string;
//     [eyeIconName]: string;
//     [eyeHideIconName]: string;
//     [filterGridIconName]: string;
//     [filterGridCircleIconName]: string;
//     [folderIconName]: string;
//     [folderOpenIconName]: string;
//     [helpInfoIconName]: string;
//     [homeIconName]: string;
//     [imageIconName]: string;
//     [infoCircleIconName]: string;
//     [infoStandardIconName]: string;
//     [searchIconName]: string;
//     [stepForward2IconName]: string;
//     [successStandardIconName]: string;
//     [timesIconName]: string;
//     [unknownStatusIconName]: string;
//     [userIconName]: string;
//     [viewColumnsIconName]: string;
//     [vmBugIconName]: string;
//     [vmBugInverseIconName]: string;
//     [warningStandardIconName]: string;
//     [detailExpandIconName]: string;
//     [detailCollapseIconName]: string;
//   }
// }
