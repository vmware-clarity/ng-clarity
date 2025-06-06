/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { animate, AnimationMetadata, style, transition } from '@angular/animations';

import { defaultAnimationTiming } from '../constants';

export function slide(direction: string): AnimationMetadata[] {
  let transform: string = null;
  if (direction === 'up') {
    transform = 'translate(0, 25%)';
  } else if (direction === 'down') {
    transform = 'translate(0, -25%)';
  } else if (direction === 'left') {
    transform = 'translate(25%, 0)';
  } else if (direction === 'right') {
    transform = 'translate(-25%, 0)';
  } else {
    throw new Error('Unknown direction ' + direction + ' for slide animation.');
  }
  return [
    transition('void => *', [style({ transform: transform }), animate(defaultAnimationTiming)]),
    transition('* => void', [animate(defaultAnimationTiming, style({ transform: transform }))]),
  ];
}
