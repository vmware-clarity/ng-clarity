/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformServer } from '@angular/common';
import * as angularCore from '@angular/core';
import {
  afterNextRender,
  ANIMATION_MODULE_TYPE,
  inject,
  Injectable,
  Injector,
  MAX_ANIMATION_TIMEOUT,
  PLATFORM_ID,
} from '@angular/core';

// Angular's token disabling `animate.enter` / `animate.leave` (set by `TestBed`). It is private API, so it is read
// from the namespace: if Angular stops exporting it, it is `undefined` instead of breaking the build.
const ANIMATIONS_DISABLED = (angularCore as Partial<typeof angularCore>).ɵANIMATIONS_DISABLED;

/** State returned by `ClrAnimationsService.trackInitialRender()`. */
export interface ClrInitialRenderState {
  /** Whether the render that created the component's view has completed. */
  readonly done: boolean;
}

/**
 * Waits for the CSS / Web Animations of the Clarity components that cannot use Angular's `animate.leave`.
 */
@Injectable({ providedIn: 'root' })
export class ClrAnimationsService {
  /**
   * Whether animations are off: with `NoopAnimationsModule` / `provideNoopAnimations()`, in `TestBed` (unless
   * `animationsEnabled: true`) and on the server.
   */
  readonly disabled: boolean =
    inject(ANIMATION_MODULE_TYPE, { optional: true }) === 'NoopAnimations' ||
    (!!ANIMATIONS_DISABLED && !!inject(ANIMATIONS_DISABLED, { optional: true })) ||
    isPlatformServer(inject(PLATFORM_ID));

  private readonly maxAnimationTimeout = inject(MAX_ANIMATION_TIMEOUT);

  /**
   * Resolves once the animations running on `element` have finished or were cancelled. Infinite animations are
   * ignored, and like `animate.leave` it gives up after `MAX_ANIMATION_TIMEOUT`.
   */
  whenComplete(element: Element | null | undefined): Promise<void> {
    const animations =
      this.disabled || typeof element?.getAnimations !== 'function'
        ? []
        : element.getAnimations().filter(animation => animation.effect?.getTiming().iterations !== Infinity);

    if (!animations.length) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      const timer = setTimeout(resolve, this.maxAnimationTimeout);
      Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
        clearTimeout(timer);
        resolve();
      });
    });
  }

  /**
   * Like `whenComplete()`, but looks the element up after the next render, once the classes bound in the current
   * change detection are applied.
   */
  whenCompleteAfterRender(getElement: () => Element | null | undefined, injector: Injector): Promise<void> {
    if (this.disabled) {
      return Promise.resolve();
    }
    return new Promise(resolve => {
      afterNextRender(() => this.whenComplete(getElement()).then(resolve), { injector });
    });
  }

  /**
   * Tells when the component's first render is done, so that elements present on that render are not animated.
   * Call it from a field initializer.
   */
  trackInitialRender(injector: Injector): ClrInitialRenderState {
    const state = { done: false };
    afterNextRender(() => (state.done = true), { injector });
    return state;
  }
}
