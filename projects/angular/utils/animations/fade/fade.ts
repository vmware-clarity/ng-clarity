/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { animationAnimate, animationStyle, animationTransition, ClrAnimationMetadata } from '../animation-metadata';
import { defaultAnimationTiming } from '../constants';

/** @deprecated Clarity animates with native CSS; use the `clr-fade-enter` and `clr-fade-leave` classes instead. */
export function fade(opacity = 1): ClrAnimationMetadata[] {
  return [
    animationTransition('void => *', [
      animationStyle({ opacity: 0 }),
      animationAnimate(defaultAnimationTiming, animationStyle({ opacity: opacity })),
    ]),
    animationTransition('* => void', [animationAnimate(defaultAnimationTiming, animationStyle({ opacity: 0 }))]),
  ];
}
