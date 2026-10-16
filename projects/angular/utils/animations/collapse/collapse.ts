/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  animationAnimate,
  animationState,
  animationStyle,
  animationTransition,
  ClrAnimationMetadata,
} from '../animation-metadata';
import { defaultAnimationTiming } from '../constants';

/** @deprecated Clarity animates with native CSS; transition `grid-template-rows` or `height` instead. */
export function collapse(): ClrAnimationMetadata[] {
  'use strict';
  return [
    animationState('true', animationStyle({ height: 0, 'overflow-y': 'hidden' })),
    animationTransition('true => false', [
      animationAnimate(defaultAnimationTiming, animationStyle({ height: '*', 'overflow-y': 'hidden' })),
    ]),
    animationTransition('false => true', [
      animationStyle({ height: '*', 'overflow-y': 'hidden' }),
      animationAnimate(defaultAnimationTiming),
    ]),
  ];
}
