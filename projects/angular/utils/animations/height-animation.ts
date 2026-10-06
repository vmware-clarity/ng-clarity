/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { afterNextRender, Injector } from '@angular/core';

import { ClrAnimationsService } from './animations.service';

/**
 * Animates the height of an element between its measured heights with the Web Animations API, the way the former
 * `@angular/animations` transitions to and from `height: '*'` did.
 *
 * The element is expected to clip its content and to have the style of its final state (`height: 0` when collapsed,
 * its natural height when expanded): the animation only covers the way there and leaves no style behind. Since it is
 * a Web Animation of the element, `ClrAnimationsService.whenComplete()` waits for it.
 */
export class ClrHeightAnimation {
  readonly #animations: ClrAnimationsService;
  #animation: Animation | null = null;
  #animationId = 0;

  /**
   * @param injector Injector of the component, used to register the render hook.
   * @param easing Easing of the animation, instead of the `--cds-global-animation-easing-in-out` token.
   */
  constructor(
    private readonly injector: Injector,
    private readonly easing?: string
  ) {
    this.#animations = injector.get(ClrAnimationsService);
  }

  /**
   * Animates the element from its current height, or from `startHeight`, to the height it has after the next render.
   *
   * Call it when the change that expands the element is made, before the change is rendered. `getElement` is
   * evaluated again after that render, so it can return an element that does not exist yet.
   */
  expand(getElement: () => HTMLElement | null | undefined, startHeight?: number) {
    if (this.#animations.disabled) {
      return;
    }
    const element = getElement();
    const from = startHeight ?? (element ? measureHeight(element) : 0);
    const animationId = this.cancel();

    afterNextRender(
      {
        earlyRead: () => {
          const target = getElement();
          return target ? { target, to: measureHeight(target), timing: this.#timing(target) } : null;
        },
        write: step => {
          if (step && animationId === this.#animationId) {
            this.#play(step.target, from, step.to, step.timing);
          }
        },
      },
      { injector: this.injector }
    );
  }

  /** Animates the element from its current height to 0, right away. */
  collapse(element: HTMLElement | null | undefined) {
    if (!element || this.#animations.disabled) {
      return;
    }
    const from = measureHeight(element);
    this.cancel();
    this.#play(element, from, 0, this.#timing(element));
  }

  /** Stops the running animation, if any, and returns the id of the next one. */
  cancel(): number {
    this.#animation?.cancel();
    this.#animation = null;
    return ++this.#animationId;
  }

  #timing(element: HTMLElement): KeyframeAnimationOptions | null {
    const timing = readAnimationTiming(element);
    return timing && this.easing ? { ...timing, easing: this.easing } : timing;
  }

  #play(element: HTMLElement, from: number, to: number, timing: KeyframeAnimationOptions | null) {
    if (!timing || from === to || typeof element.animate !== 'function') {
      return;
    }
    try {
      this.#animation = element.animate([{ height: `${from}px` }, { height: `${to}px` }], timing);
    } catch {
      // Invalid timing (customized animation tokens): no animation.
    }
  }
}

/**
 * The height of an element, with its fractional part, as currently rendered (running animations included).
 * `DomAdapter.computedHeight` rounds it down, and animating to a rounded height makes the element jump by the
 * remainder when the animation ends.
 */
export function measureHeight(element: HTMLElement): number {
  const height = parseFloat(getComputedStyle(element).height);
  return Number.isFinite(height) ? height : 0;
}

/**
 * Timing of the height animations, from the Clarity animation tokens. `null` when there is nothing to animate: the
 * duration is 0 (low motion theme) or the user prefers reduced motion.
 */
export function readAnimationTiming(element: HTMLElement): KeyframeAnimationOptions | null {
  if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }
  const style = getComputedStyle(element);
  const duration = parseDuration(style.getPropertyValue('--cds-global-animation-duration-quick'));
  const easing = style.getPropertyValue('--cds-global-animation-easing-in-out').trim() || 'ease-in-out';
  return duration > 0 ? { duration, easing } : null;
}

/** Parses a CSS time (`0.2s`, `200ms`) to milliseconds. */
function parseDuration(value: string): number {
  const time = value.trim();
  const amount = parseFloat(time);
  if (!Number.isFinite(amount)) {
    return 0;
  }
  return time.endsWith('ms') ? amount : amount * 1000;
}
