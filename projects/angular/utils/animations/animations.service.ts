/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformServer } from '@angular/common';
import {
  afterNextRender,
  ANIMATION_MODULE_TYPE,
  ɵANIMATIONS_DISABLED as ANIMATIONS_DISABLED,
  inject,
  Injectable,
  Injector,
  MAX_ANIMATION_TIMEOUT,
  PLATFORM_ID,
} from '@angular/core';

/** Extra time given to an animation past its computed end before `whenComplete()` stops waiting for it. */
const COMPLETION_GRACE_PERIOD = 50;

/** State returned by `ClrAnimationsService.trackInitialRender()`. */
export interface ClrInitialRenderState {
  /** Whether the render that created the component's view has completed. */
  readonly done: boolean;
}

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
   * Whether animations are disabled for the application. They are when:
   *
   * - the application opted into no-op animations (`provideNoopAnimations()`, `NoopAnimationsModule` or
   *   `BrowserAnimationsModule.withConfig({ disableAnimations: true })`),
   * - Angular's own `animate.enter` / `animate.leave` are disabled: `TestBed` does that unless
   *   `animationsEnabled: true` is passed, so completion callbacks resolve immediately in unit tests,
   * - the application is rendered on the server, where nothing animates.
   */
  readonly disabled: boolean =
    inject(ANIMATION_MODULE_TYPE, { optional: true }) === 'NoopAnimations' ||
    // `ANIMATIONS_DISABLED` is not public API: keep working if Angular stops exporting it.
    (!!ANIMATIONS_DISABLED && !!inject(ANIMATIONS_DISABLED, { optional: true })) ||
    isPlatformServer(inject(PLATFORM_ID));

  private readonly maxAnimationTimeout = inject(MAX_ANIMATION_TIMEOUT);

  /**
   * Resolves once every CSS animation and transition running on `element` has finished or was cancelled.
   *
   * Resolves right away when animations are disabled, when there is no element, when nothing is animating (for example with the `low-motion`
   * theme, which zeroes the animation duration tokens) or when the Web Animations API is not available (jsdom).
   * Infinite animations, such as spinners, are ignored. Like Angular's `animate.leave`, it stops waiting shortly
   * after the animations should have ended (and at the latest after `MAX_ANIMATION_TIMEOUT`), so a paused animation
   * cannot keep a component in its transient state forever.
   */
  whenComplete(element: Element | null | undefined): Promise<void> {
    if (this.disabled || typeof element?.getAnimations !== 'function') {
      return Promise.resolve();
    }

    // `getAnimations()` flushes pending style changes itself, so transitions triggered by a class added in the
    // current task are already included; no forced layout is needed.
    const animations = element
      .getAnimations()
      .filter(animation => animation.effect?.getTiming().iterations !== Infinity);

    if (!animations.length) {
      return Promise.resolve();
    }

    const finished = Promise.allSettled(animations.map(animation => animation.finished)).then(() => undefined);
    const timeout = new Promise<void>(resolve =>
      setTimeout(resolve, Math.min(this.remainingTime(animations) + COMPLETION_GRACE_PERIOD, this.maxAnimationTimeout))
    );

    return Promise.race([finished, timeout]);
  }

  /**
   * Like `whenComplete()`, but waits for the next render first, so that an animation class bound during the
   * current change detection is applied before the animations of the element are looked up.
   *
   * `getElement` is evaluated after that render and may return nothing (e.g. the element was removed in the
   * meantime), in which case the promise resolves right away. Resolves in a microtask when animations are disabled,
   * which mirrors the timing of Angular's former animation callbacks.
   *
   * @param injector Injector of the component, used to register the render hook.
   */
  whenCompleteAfterRender(getElement: () => Element | null | undefined, injector: Injector): Promise<void> {
    if (this.disabled) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      afterNextRender(
        () => {
          this.whenComplete(getElement()).then(resolve);
        },
        { injector }
      );
    });
  }

  /**
   * Tracks whether the render that created the calling component's view has completed.
   *
   * Enter animations bound with `animate.enter` run right after that render, so an element that exists on the
   * first render of a component is animated too. Call this from `ngAfterViewInit` and only provide an enter class
   * once the returned state says the initial render is done, to animate elements rendered later only (which is
   * what an empty `:enter` transition on a parent trigger used to achieve).
   *
   * @param injector Injector of the component, used to register the render hook.
   */
  trackInitialRender(injector: Injector): ClrInitialRenderState {
    const state = { done: false };
    afterNextRender(() => (state.done = true), { injector });
    return state;
  }

  /** Milliseconds until the last of `animations` should end, when played at their current rate. */
  private remainingTime(animations: Animation[]): number {
    return Math.max(
      ...animations.map(animation => {
        const endTime = Number(animation.effect?.getComputedTiming().endTime) || 0;
        const currentTime = Number(animation.currentTime) || 0;
        const rate = Math.abs(animation.playbackRate) || 1;
        return Math.max(0, (endTime - currentTime) / rate);
      })
    );
  }
}
