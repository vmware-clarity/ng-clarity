/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { animationAnimate, animationStyle, animationTransition, ClrAnimationMetadata } from '../animation-metadata';
import { defaultAnimationTiming } from '../constants';

/** @deprecated Clarity animates with native CSS; use the `clr-slide-<direction>-enter` / `-leave` classes instead. */
export function slide(direction: string): ClrAnimationMetadata[] {
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
    animationTransition('void => *', [
      animationStyle({ transform: transform }),
      animationAnimate(defaultAnimationTiming),
    ]),
    animationTransition('* => void', [
      animationAnimate(defaultAnimationTiming, animationStyle({ transform: transform })),
    ]),
  ];
}
