/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClarityIcons } from '../icon.service';
import { IconAlias, IconShapeTuple } from '../interfaces/icon.interfaces';
import { bookmarkIcon } from '../shapes/bookmark';
import { calendarIcon, calendarIconName } from '../shapes/calendar';
import { chatBubbleIcon } from '../shapes/chat-bubble';
import { contractIcon } from '../shapes/contract';
import { crownIcon } from '../shapes/crown';
import { envelopeIcon, envelopeIconName } from '../shapes/envelope';
import { eventIcon } from '../shapes/event';
import { flagIcon } from '../shapes/flag';
import { halfStarIcon } from '../shapes/half-star';
import { happyFaceIcon } from '../shapes/happy-face';
import { hashtagIcon } from '../shapes/hashtag';
import { heartIcon } from '../shapes/heart';
import { heartBrokenIcon } from '../shapes/heart-broken';
import { inboxIcon } from '../shapes/inbox';
import { neutralFaceIcon } from '../shapes/neutral-face';
import { pictureIcon } from '../shapes/picture';
import { sadFaceIcon } from '../shapes/sad-face';
import { shareIcon } from '../shapes/share';
import { starIcon, starIconName } from '../shapes/star';
import { talkBubblesIcon } from '../shapes/talk-bubbles';
import { tasksIcon } from '../shapes/tasks';
import { thumbsDownIcon } from '../shapes/thumbs-down';
import { thumbsUpIcon } from '../shapes/thumbs-up';

export const socialCollectionIcons: IconShapeTuple[] = [
  bookmarkIcon,
  calendarIcon,
  chatBubbleIcon,
  contractIcon,
  crownIcon,
  envelopeIcon,
  eventIcon,
  flagIcon,
  halfStarIcon,
  happyFaceIcon,
  hashtagIcon,
  heartIcon,
  heartBrokenIcon,
  inboxIcon,
  neutralFaceIcon,
  pictureIcon,
  sadFaceIcon,
  shareIcon,
  starIcon,
  talkBubblesIcon,
  tasksIcon,
  thumbsDownIcon,
  thumbsUpIcon,
];

export const socialCollectionAliases: IconAlias[] = [
  [starIconName, ['favorite']],
  [envelopeIconName, ['email']],
  [calendarIconName, ['date']],
];

/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadSocialIconSet } from '@clr/angular';
 *
 * loadSocialIconSet();
 * ```
 *
 */
export function loadSocialIconSet() {
  ClarityIcons.addIcons(...socialCollectionIcons);
  ClarityIcons.addAliases(...socialCollectionAliases);
}

// declare module '@clr/angular' {
//   interface IconRegistrySources {
//     [bookmarkIconName]: string;
//     [calendarIconName]: string;
//     [chatBubbleIconName]: string;
//     [contractIconName]: string;
//     [crownIconName]: string;
//     [envelopeIconName]: string;
//     [eventIconName]: string;
//     [flagIconName]: string;
//     [halfStarIconName]: string;
//     [happyFaceIconName]: string;
//     [hashtagIconName]: string;
//     [heartIconName]: string;
//     [heartBrokenIconName]: string;
//     [inboxIconName]: string;
//     [neutralFaceIconName]: string;
//     [pictureIconName]: string;
//     [sadFaceIconName]: string;
//     [shareIconName]: string;
//     [starIconName]: string;
//     [talkBubblesIconName]: string;
//     [tasksIconName]: string;
//     [thumbsDownIconName]: string;
//     [thumbsUpIconName]: string;
//   }
// }
