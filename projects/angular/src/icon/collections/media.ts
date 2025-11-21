/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClarityIcons } from '../icon.service';
import { IconAlias, IconShapeTuple } from '../interfaces/icon.interfaces';
import { cameraIcon } from '../shapes/camera';
import { fastForwardIcon } from '../shapes/fast-forward';
import { filmStripIcon } from '../shapes/film-strip';
import { headphonesIcon } from '../shapes/headphones';
import { imageGalleryIcon } from '../shapes/image-gallery';
import { microphoneIcon } from '../shapes/microphone';
import { microphoneMuteIcon } from '../shapes/microphone-mute';
import { musicNoteIcon } from '../shapes/music-note';
import { pauseIcon } from '../shapes/pause';
import { playIcon } from '../shapes/play';
import { powerIcon } from '../shapes/power';
import { replayAllIcon } from '../shapes/replay-all';
import { replayOneIcon } from '../shapes/replay-one';
import { rewindIcon } from '../shapes/rewind';
import { shuffleIcon } from '../shapes/shuffle';
import { stepForwardIcon } from '../shapes/step-forward';
import { stopIcon } from '../shapes/stop';
import { videoCameraIcon } from '../shapes/video-camera';
import { videoGalleryIcon } from '../shapes/video-gallery';
import { volumeDownIcon } from '../shapes/volume-down';
import { volumeMuteIcon } from '../shapes/volume-mute';
import { volumeUpIcon } from '../shapes/volume-up';

export const mediaCollectionIcons: IconShapeTuple[] = [
  cameraIcon,
  fastForwardIcon,
  filmStripIcon,
  headphonesIcon,
  imageGalleryIcon,
  microphoneIcon,
  microphoneMuteIcon,
  musicNoteIcon,
  pauseIcon,
  playIcon,
  powerIcon,
  replayAllIcon,
  replayOneIcon,
  rewindIcon,
  shuffleIcon,
  stepForwardIcon,
  stopIcon,
  videoCameraIcon,
  videoGalleryIcon,
  volumeDownIcon,
  volumeMuteIcon,
  volumeUpIcon,
];

export const mediaCollectionAliases: IconAlias[] = [];

/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadMediaIconSet } from '@clr/angular';
 *
 * loadMediaIconSet();
 * ```
 *
 */
export function loadMediaIconSet() {
  ClarityIcons.addIcons(...mediaCollectionIcons);
  ClarityIcons.addAliases(...mediaCollectionAliases);
}

// declare module '@clr/angular' {
//   interface IconRegistrySources {
//     [cameraIconName]: string;
//     [fastForwardIconName]: string;
//     [filmStripIconName]: string;
//     [headphonesIconName]: string;
//     [imageGalleryIconName]: string;
//     [microphoneIconName]: string;
//     [microphoneMuteIconName]: string;
//     [musicNoteIconName]: string;
//     [pauseIconName]: string;
//     [playIconName]: string;
//     [powerIconName]: string;
//     [replayAllIconName]: string;
//     [replayOneIconName]: string;
//     [rewindIconName]: string;
//     [shuffleIconName]: string;
//     [stepForwardIconName]: string;
//     [stopIconName]: string;
//     [videoCameraIconName]: string;
//     [videoGalleryIconName]: string;
//     [volumeDownIconName]: string;
//     [volumeMuteIconName]: string;
//     [volumeUpIconName]: string;
//   }
// }
