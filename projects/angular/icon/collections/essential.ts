/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClarityIcons } from '../icon.service';
import { IconAlias, IconShapeTuple } from '../interfaces/icon.interfaces';
import { accessibility1Icon } from '../shapes/accessibility-1';
import { accessibility2Icon } from '../shapes/accessibility-2';
import { addTextIcon } from '../shapes/add-text';
import { alarmClockIcon } from '../shapes/alarm-clock';
import { alarmOffIcon } from '../shapes/alarm-off';
import { announcementIcon } from '../shapes/announcement';
import { asteriskIcon } from '../shapes/asterisk';
import { banIcon, banIconName } from '../shapes/ban';
import { betaIcon } from '../shapes/beta';
import { birthdayCakeIcon } from '../shapes/birthday-cake';
import { boltIcon, boltIconName } from '../shapes/bolt';
import { bookIcon } from '../shapes/book';
import { briefcaseIcon } from '../shapes/briefcase';
import { bubbleExclamationIcon, bubbleExclamationIconName } from '../shapes/bubble-exclamation';
import { bugIcon } from '../shapes/bug';
import { bullseyeIcon } from '../shapes/bullseye';
import { childArrowIcon } from '../shapes/child-arrow';
import { circleIcon } from '../shapes/circle';
import { circleArrowIcon } from '../shapes/circle-arrow';
import { clipboardIcon } from '../shapes/clipboard';
import { clockIcon } from '../shapes/clock';
import { cloneIcon } from '../shapes/clone';
import { collapseCardIcon } from '../shapes/collapse-card';
import { colorPaletteIcon } from '../shapes/color-palette';
import { colorPickerIcon } from '../shapes/color-picker';
import { copyIcon } from '../shapes/copy';
import { copyToClipboardIcon } from '../shapes/copy-to-clipboard';
import { crosshairsIcon } from '../shapes/crosshairs';
import { cursorArrowIcon } from '../shapes/cursor-arrow';
import { cursorHandIcon } from '../shapes/cursor-hand';
import { cursorHandClickIcon } from '../shapes/cursor-hand-click';
import { cursorHandGrabIcon } from '../shapes/cursor-hand-grab';
import { cursorHandOpenIcon } from '../shapes/cursor-hand-open';
import { cursorMoveIcon } from '../shapes/cursor-move';
import { detailsIcon } from '../shapes/details';
import { dotCircleIcon } from '../shapes/dot-circle';
import { downloadIcon } from '../shapes/download';
import { dragHandleIcon } from '../shapes/drag-handle';
import { dragHandleCornerIcon } from '../shapes/drag-handle-corner';
import { eraserIcon } from '../shapes/eraser';
import { expandCardIcon } from '../shapes/expand-card';
import { fileIcon, fileIconName } from '../shapes/file';
import { fileGroupIcon } from '../shapes/file-group';
import { fileSettingsIcon } from '../shapes/file-settings';
import { fileZipIcon } from '../shapes/file-zip';
import { filterIcon } from '../shapes/filter';
import { filter2Icon } from '../shapes/filter-2';
import { filterOffIcon } from '../shapes/filter-off';
import { firewallIcon } from '../shapes/firewall';
import { firstAidIcon } from '../shapes/first-aid';
import { fishIcon } from '../shapes/fish';
import { flameIcon } from '../shapes/flame';
import { formIcon } from '../shapes/form';
import { fuelIcon } from '../shapes/fuel';
import { gavelIcon } from '../shapes/gavel';
import { gridViewIcon } from '../shapes/grid-view';
import { helpIcon } from '../shapes/help';
import { historyIcon } from '../shapes/history';
import { hourglassIcon } from '../shapes/hourglass';
import { idBadgeIcon } from '../shapes/id-badge';
import { keyIcon } from '../shapes/key';
import { landscapeIcon } from '../shapes/landscape';
import { launchpadIcon } from '../shapes/launchpad';
import { libraryIcon } from '../shapes/library';
import { lightbulbIcon } from '../shapes/lightbulb';
import { listIcon } from '../shapes/list';
import { lockIcon } from '../shapes/lock';
import { loginIcon, loginIconName } from '../shapes/login';
import { logoutIcon, logoutIconName } from '../shapes/logout';
import { minusIcon } from '../shapes/minus';
import { minusCircleIcon } from '../shapes/minus-circle';
import { moonIcon } from '../shapes/moon';
import { newIcon } from '../shapes/new';
import { noAccessIcon } from '../shapes/no-access';
import { noteIcon, noteIconName } from '../shapes/note';
import { objectsIcon } from '../shapes/objects';
import { organizationIcon, organizationIconName } from '../shapes/organization';
import { paperclipIcon, paperclipIconName } from '../shapes/paperclip';
import { pasteIcon } from '../shapes/paste';
import { pencilIcon, pencilIconName } from '../shapes/pencil';
import { pinIcon } from '../shapes/pin';
import { pinboardIcon, pinboardIconName } from '../shapes/pinboard';
import { plusIcon, plusIconName } from '../shapes/plus';
import { plusCircleIcon } from '../shapes/plus-circle';
import { popOutIcon } from '../shapes/pop-out';
import { portraitIcon } from '../shapes/portrait';
import { printerIcon } from '../shapes/printer';
import { recycleIcon } from '../shapes/recycle';
import { redoIcon } from '../shapes/redo';
import { refreshIcon } from '../shapes/refresh';
import { repeatIcon } from '../shapes/repeat';
import { resizeIcon, resizeIconName } from '../shapes/resize';
import { scissorsIcon } from '../shapes/scissors';
import { scrollIcon } from '../shapes/scroll';
import { shrinkIcon, shrinkIconName } from '../shapes/shrink';
import { sliderIcon } from '../shapes/slider';
import { snowflakeIcon } from '../shapes/snowflake';
import { sortByIcon } from '../shapes/sort-by';
import { sunIcon } from '../shapes/sun';
import { switchIcon } from '../shapes/switch';
import { syncIcon } from '../shapes/sync';
import { tableIcon } from '../shapes/table';
import { tagIcon } from '../shapes/tag';
import { tagsIcon } from '../shapes/tags';
import { targetIcon } from '../shapes/target';
import { thermometerIcon } from '../shapes/thermometer';
import { timelineIcon } from '../shapes/timeline';
import { timesCircleIcon, timesCircleIconName } from '../shapes/times-circle';
import { toolsIcon } from '../shapes/tools';
import { trashIcon } from '../shapes/trash';
import { treeIcon } from '../shapes/tree';
import { treeViewIcon } from '../shapes/tree-view';
import { twoWayArrowsIcon } from '../shapes/two-way-arrows';
import { undoIcon } from '../shapes/undo';
import { unlockIcon } from '../shapes/unlock';
import { unpinIcon } from '../shapes/unpin';
import { uploadIcon } from '../shapes/upload';
import { usersIcon, usersIconName } from '../shapes/users';
import { viewCardsIcon } from '../shapes/view-cards';
import { viewListIcon } from '../shapes/view-list';
import { volumeIcon } from '../shapes/volume';
import { wandIcon } from '../shapes/wand';
import { windowCloseIcon } from '../shapes/window-close';
import { windowMaxIcon } from '../shapes/window-max';
import { windowMinIcon } from '../shapes/window-min';
import { windowRestoreIcon } from '../shapes/window-restore';
import { worldIcon } from '../shapes/world';
import { wrenchIcon } from '../shapes/wrench';
import { zoomInIcon } from '../shapes/zoom-in';
import { zoomOutIcon } from '../shapes/zoom-out';

export const essentialCollectionIcons: IconShapeTuple[] = [
  accessibility1Icon,
  accessibility2Icon,
  addTextIcon,
  alarmClockIcon,
  alarmOffIcon,
  announcementIcon,
  asteriskIcon,
  banIcon,
  betaIcon,
  birthdayCakeIcon,
  boltIcon,
  bookIcon,
  briefcaseIcon,
  bubbleExclamationIcon,
  bugIcon,
  bullseyeIcon,
  childArrowIcon,
  circleIcon,
  circleArrowIcon,
  clipboardIcon,
  clockIcon,
  cloneIcon,
  collapseCardIcon,
  colorPaletteIcon,
  colorPickerIcon,
  copyIcon,
  copyToClipboardIcon,
  crosshairsIcon,
  cursorArrowIcon,
  cursorHandIcon,
  cursorHandClickIcon,
  cursorHandGrabIcon,
  cursorHandOpenIcon,
  cursorMoveIcon,
  detailsIcon,
  dotCircleIcon,
  downloadIcon,
  dragHandleIcon,
  dragHandleCornerIcon,
  eraserIcon,
  expandCardIcon,
  fileGroupIcon,
  fileIcon,
  fileSettingsIcon,
  fileZipIcon,
  filterIcon,
  filter2Icon,
  filterOffIcon,
  firewallIcon,
  firstAidIcon,
  fishIcon,
  flameIcon,
  formIcon,
  fuelIcon,
  gavelIcon,
  gridViewIcon,
  helpIcon,
  historyIcon,
  hourglassIcon,
  idBadgeIcon,
  keyIcon,
  landscapeIcon,
  launchpadIcon,
  libraryIcon,
  lightbulbIcon,
  listIcon,
  lockIcon,
  loginIcon,
  logoutIcon,
  minusIcon,
  minusCircleIcon,
  moonIcon,
  newIcon,
  noAccessIcon,
  noteIcon,
  objectsIcon,
  organizationIcon,
  paperclipIcon,
  pasteIcon,
  pencilIcon,
  pinIcon,
  pinboardIcon,
  plusIcon,
  plusCircleIcon,
  popOutIcon,
  portraitIcon,
  printerIcon,
  recycleIcon,
  redoIcon,
  refreshIcon,
  repeatIcon,
  resizeIcon,
  scissorsIcon,
  scrollIcon,
  shrinkIcon,
  sliderIcon,
  snowflakeIcon,
  sortByIcon,
  sunIcon,
  switchIcon,
  syncIcon,
  tableIcon,
  tagIcon,
  tagsIcon,
  targetIcon,
  thermometerIcon,
  timesCircleIcon,
  timelineIcon,
  toolsIcon,
  trashIcon,
  treeIcon,
  treeViewIcon,
  twoWayArrowsIcon,
  undoIcon,
  unpinIcon,
  unlockIcon,
  uploadIcon,
  usersIcon,
  viewCardsIcon,
  viewListIcon,
  volumeIcon,
  wandIcon,
  windowCloseIcon,
  windowMaxIcon,
  windowMinIcon,
  windowRestoreIcon,
  worldIcon,
  wrenchIcon,
  zoomInIcon,
  zoomOutIcon,
];

export const essentialCollectionAliases: IconAlias[] = [
  [pencilIconName, ['edit']],
  [noteIconName, ['note-edit']],
  [usersIconName, ['group']],
  [fileIconName, ['document']],
  [plusIconName, ['add']],
  [banIconName, ['cancel']],
  [timesCircleIconName, ['remove']],
  [loginIconName, ['sign-in']],
  [logoutIconName, ['sign-out']],
  [boltIconName, ['lightning']],
  [organizationIconName, ['flow-chart']],
  [bubbleExclamationIconName, ['alert']],
  [pinboardIconName, ['pinned']],
  [paperclipIconName, ['attachment']],
  [shrinkIconName, ['resize-down']],
  [resizeIconName, ['resize-up']],
];

/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadEssentialIconSet } from '@clr/angular';
 *
 * loadEssentialIconSet();
 * ```
 *
 */
export function loadEssentialIconSet() {
  ClarityIcons.addIcons(...essentialCollectionIcons);
  ClarityIcons.addAliases(...essentialCollectionAliases);
}

// declare module '@clr/angular' {
//   interface IconRegistrySources {
//     [accessibility1IconName]: string;
//     [accessibility2IconName]: string;
//     [addTextIconName]: string;
//     [alarmClockIconName]: string;
//     [alarmOffIconName]: string;
//     [announcementIconName]: string;
//     [asteriskIconName]: string;
//     [banIconName]: string;
//     [betaIconName]: string;
//     [birthdayCakeIconName]: string;
//     [boltIconName]: string;
//     [bookIconName]: string;
//     [briefcaseIconName]: string;
//     [bubbleExclamationIconName]: string;
//     [bugIconName]: string;
//     [bullseyeIconName]: string;
//     [childArrowIconName]: string;
//     [circleIconName]: string;
//     [circleArrowIconName]: string;
//     [clipboardIconName]: string;
//     [clockIconName]: string;
//     [cloneIconName]: string;
//     [collapseCardIconName]: string;
//     [colorPaletteIconName]: string;
//     [colorPickerIconName]: string;
//     [copyIconName]: string;
//     [copyToClipboardIconName]: string;
//     [crosshairsIconName]: string;
//     [cursorArrowIconName]: string;
//     [cursorHandIconName]: string;
//     [cursorHandClickIconName]: string;
//     [cursorHandGrabIconName]: string;
//     [cursorHandOpenIconName]: string;
//     [cursorMoveIconName]: string;
//     [detailsIconName]: string;
//     [dotCircleIconName]: string;
//     [downloadIconName]: string;
//     [dragHandleIconName]: string;
//     [dragHandleCornerIconName]: string;
//     [eraserIconName]: string;
//     [expandCardIconName]: string;
//     [fileGroupIconName]: string;
//     [fileIconName]: string;
//     [fileSettingsIconName]: string;
//     [fileZipIconName]: string;
//     [filterIconName]: string;
//     [filter2IconName]: string;
//     [filterOffIconName]: string;
//     [firewallIconName]: string;
//     [firstAidIconName]: string;
//     [fishIconName]: string;
//     [flameIconName]: string;
//     [formIconName]: string;
//     [fuelIconName]: string;
//     [gavelIconName]: string;
//     [gridViewIconName]: string;
//     [helpIconName]: string;
//     [historyIconName]: string;
//     [hourglassIconName]: string;
//     [idBadgeIconName]: string;
//     [keyIconName]: string;
//     [landscapeIconName]: string;
//     [launchpadIconName]: string;
//     [libraryIconName]: string;
//     [lightbulbIconName]: string;
//     [listIconName]: string;
//     [lockIconName]: string;
//     [loginIconName]: string;
//     [logoutIconName]: string;
//     [minusIconName]: string;
//     [minusCircleIconName]: string;
//     [moonIconName]: string;
//     [newIconName]: string;
//     [noAccessIconName]: string;
//     [noteIconName]: string;
//     [objectsIconName]: string;
//     [organizationIconName]: string;
//     [paperclipIconName]: string;
//     [pasteIconName]: string;
//     [pencilIconName]: string;
//     [pinIconName]: string;
//     [pinboardIconName]: string;
//     [plusIconName]: string;
//     [plusCircleIconName]: string;
//     [popOutIconName]: string;
//     [portraitIconName]: string;
//     [printerIconName]: string;
//     [recycleIconName]: string;
//     [redoIconName]: string;
//     [refreshIconName]: string;
//     [repeatIconName]: string;
//     [resizeIconName]: string;
//     [scissorsIconName]: string;
//     [scrollIconName]: string;
//     [shrinkIconName]: string;
//     [sliderIconName]: string;
//     [snowflakeIconName]: string;
//     [sortByIconName]: string;
//     [sunIconName]: string;
//     [switchIconName]: string;
//     [syncIconName]: string;
//     [tableIconName]: string;
//     [tagIconName]: string;
//     [tagsIconName]: string;
//     [targetIconName]: string;
//     [thermometerIconName]: string;
//     [timesCircleIconName]: string;
//     [timelineIconName]: string;
//     [trashIconName]: string;
//     [toolsIconName]: string;
//     [treeIconName]: string;
//     [treeViewIconName]: string;
//     [twoWayArrowsIconName]: string;
//     [undoIconName]: string;
//     [unpinIconName]: string;
//     [unlockIconName]: string;
//     [uploadIconName]: string;
//     [usersIconName]: string;
//     [viewCardsIconName]: string;
//     [viewListIconName]: string;
//     [volumeIconName]: string;
//     [wandIconName]: string;
//     [windowCloseIconName]: string;
//     [windowMaxIconName]: string;
//     [windowMinIconName]: string;
//     [windowRestoreIconName]: string;
//     [worldIconName]: string;
//     [wrenchIconName]: string;
//     [zoomInIconName]: string;
//     [zoomOutIconName]: string;
//   }
// }
