/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ɵANIMATIONS_DISABLED as ANIMATIONS_DISABLED, inject, Injectable } from '@angular/core';

/**
 * Helpers for the native CSS animations of Clarity components.
 *
 * Clarity animates with plain CSS classes, transitions and keyframes. Components that need to act once an
 * animation has finished (close a modal, remove collapsed content, ...) use `whenComplete()` instead of
 * listening to `animationend` / `transitionend` events, which bubble from animated descendants.
 */
@Injectable({ providedIn: 'root' })
export class ClrAnimationsService {
  /**
   * Whether animations are disabled for the application.
   *
   * Mirrors the switch behind Angular's own `animate.enter` / `animate.leave`: `TestBed` disables animations
   * unless `animationsEnabled: true` is passed, so completion callbacks resolve immediately in unit tests.
   */
  readonly disabled: boolean = inject(ANIMATIONS_DISABLED);

  /**
   * Resolves once every CSS animation and transition running on `element` has finished or was cancelled.
   *
   * Resolves right away when animations are disabled, when nothing is animating (for example because of
   * `prefers-reduced-motion`) or when the Web Animations API is not available (server rendering, jsdom).
   * Infinite animations, such as spinners, are ignored.
   */
  whenComplete(element: Element): Promise<void> {
    if (this.disabled || typeof element.getAnimations !== 'function') {
      return Promise.resolve();
    }

    // Flush pending style changes, so that transitions triggered by a class added in the current task already exist.
    void (element as HTMLElement).offsetWidth;

    const animations = element
      .getAnimations()
      .filter(animation => animation.effect?.getTiming().iterations !== Infinity);

    return Promise.allSettled(animations.map(animation => animation.finished)).then(() => undefined);
  }
}
