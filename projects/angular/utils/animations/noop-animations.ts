/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ANIMATION_MODULE_TYPE, inject } from '@angular/core';

/**
 * Whether the application turned animations off with `provideNoopAnimations()` or `NoopAnimationsModule`. Angular's
 * `animate.enter` and `animate.leave` do not honour them, so Clarity components check it to skip their animations,
 * as they did with `@angular/animations`. To be called in an injection context.
 */
export function noopAnimations(): boolean {
  return inject(ANIMATION_MODULE_TYPE, { optional: true }) === 'NoopAnimations';
}
