/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  afterNextRender,
  ɵANIMATIONS_DISABLED as ANIMATIONS_DISABLED,
  inject,
  Injectable,
  Injector,
} from '@angular/core';

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
          const element = getElement();
          (element ? this.whenComplete(element) : Promise.resolve()).then(resolve);
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
}
