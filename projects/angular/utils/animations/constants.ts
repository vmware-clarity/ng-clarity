/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { animationAnimate, animationReference, animationStyle } from './animation-metadata';

/** @deprecated Clarity animates with native CSS; use the `--cds-global-animation-*` tokens instead. */
export const defaultAnimationTiming = '0.2s ease-in-out';

/** @deprecated Clarity animates with native CSS; see `ClrExpandableAnimation` and `.clr-expandable-animation-active`. */
export const defaultExpandAnimation = animationReference(
  [
    animationStyle({ height: '{{ startHeight }}px' }),
    animationAnimate(defaultAnimationTiming, animationStyle({ height: '*' })),
  ],
  {
    params: {
      startHeight: 0, // default
    },
  }
);
