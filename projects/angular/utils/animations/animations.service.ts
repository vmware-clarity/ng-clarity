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
  inject,
  Injectable,
  Injector,
  MAX_ANIMATION_TIMEOUT,
  PLATFORM_ID,
  ɵANIMATIONS_DISABLED,
} from '@angular/core';

export interface ClrInitialRenderState {
  readonly done: boolean;
}

/**
 * Waits for the animations of the Clarity components that cannot use Angular's `animate.leave`.
 */
@Injectable({ providedIn: 'root' })
export class ClrAnimationsService {
  /** True with `NoopAnimationsModule`, in `TestBed` (unless `animationsEnabled: true`) and on the server. */
  readonly disabled =
    inject(ANIMATION_MODULE_TYPE, { optional: true }) === 'NoopAnimations' ||
    inject(ɵANIMATIONS_DISABLED) ||
    isPlatformServer(inject(PLATFORM_ID));

  private readonly timeout = inject(MAX_ANIMATION_TIMEOUT);

  /** Resolves when the (finite) animations of `element` end, or after `MAX_ANIMATION_TIMEOUT`. */
  whenComplete(element: Element | null | undefined): Promise<void> {
    const animations = this.disabled
      ? []
      : (element?.getAnimations?.() ?? []).filter(animation => animation.effect?.getTiming().iterations !== Infinity);

    return new Promise(resolve => {
      const timer = animations.length ? setTimeout(resolve, this.timeout) : undefined;
      Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
        clearTimeout(timer);
        resolve();
      });
    });
  }

  /** `whenComplete()` for the element `getElement` returns after the next render. */
  whenCompleteAfterRender(getElement: () => Element | null | undefined, injector: Injector): Promise<void> {
    if (this.disabled) {
      return Promise.resolve();
    }
    return new Promise(resolve => {
      afterNextRender(() => this.whenComplete(getElement()).then(resolve), { injector });
    });
  }

  /** `done` turns true after the first render, so that only elements added later get enter animations. */
  trackInitialRender(injector: Injector): ClrInitialRenderState {
    const state = { done: false };
    afterNextRender(() => (state.done = true), { injector });
    return state;
  }
}
