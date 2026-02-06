/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { animate, animation, style } from '@angular/animations';

export const defaultAnimationTiming = '0.2s ease-in-out';
export const defaultExpandAnimation = animation(
  [style({ height: '{{ startHeight }}px' }), animate(defaultAnimationTiming, style({ height: '*' }))],
  {
    params: {
      startHeight: 0, // default
    },
  }
);
