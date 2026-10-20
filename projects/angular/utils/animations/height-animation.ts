/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AnimationCallbackEvent } from '@angular/core';

/** `animate.enter` handler expanding the added element from 0 to its natural height. */
export function expandHeight({ target }: AnimationCallbackEvent): void {
  animateHeight(target as HTMLElement, { from: 0 });
}

const runningAnimations = new WeakMap<Element, Animation>();

/**
 * Animates the height of the element from `from` pixels to `to` pixels, or to the height it has once the animation
 * it started before on the same element is canceled. The content is clipped (`clip` rather than `hidden`, which would
 * make the element a scroll container and loosen its `position: sticky` descendants), and stays rendered even when
 * the end state skips it (`content-visibility: hidden`). The animation leaves no style behind: once it is over, the element
 * shows the style of its end state.
 *
 * The duration and easing are the `--cds-global-animation-duration-quick` and `--cds-global-animation-easing-in-out`
 * tokens of the element, unless `easing` is given. It does not animate, and returns `null`, when the duration is 0
 * (low motion theme), when the user prefers reduced motion, or outside of a browser.
 */
export function animateHeight(
  element: HTMLElement,
  { from, to, easing }: { from: number; to?: number; easing?: string }
): Animation | null {
  if (typeof element.animate !== 'function') {
    return null;
  }
  runningAnimations.get(element)?.cancel();
  runningAnimations.delete(element);
  to ??= measureHeight(element);

  if (from === to) {
    return null;
  }
  const timing = readAnimationTiming(element);
  if (!timing) {
    return null;
  }
  try {
    const animation = element.animate(
      [
        { height: `${from}px`, overflow: 'clip', contentVisibility: 'visible' },
        { height: `${to}px`, overflow: 'clip', contentVisibility: 'visible' },
      ],
      { ...timing, ...(easing && { easing }) }
    );
    runningAnimations.set(element, animation);
    return animation;
  } catch {
    // Invalid customized animation tokens: no animation.
    return null;
  }
}

/**
 * The height of the element as it is rendered, running animations included, with its fractional part. It is 0 outside
 * of a browser.
 */
export function measureHeight(element: HTMLElement): number {
  if (typeof getComputedStyle !== 'function') {
    return 0;
  }
  const height = parseFloat(getComputedStyle(element).height);
  return Number.isFinite(height) ? height : 0;
}

function readAnimationTiming(element: HTMLElement): KeyframeAnimationOptions | null {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }
  const style = getComputedStyle(element);
  const duration = parseDuration(style.getPropertyValue('--cds-global-animation-duration-quick'));
  const easing = style.getPropertyValue('--cds-global-animation-easing-in-out').trim() || 'ease-in-out';
  return duration > 0 ? { duration, easing } : null;
}

/** Parses a CSS time (`0.2s`, `200ms`) to milliseconds. */
function parseDuration(value: string): number {
  const time = value.trim().toLowerCase();
  const amount = parseFloat(time);
  if (!Number.isFinite(amount)) {
    return 0;
  }
  return time.endsWith('ms') ? amount : amount * 1000;
}
