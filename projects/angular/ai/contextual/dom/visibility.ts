/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Whether the element is rendered and can be seen, as assistive technology judges it:
 * `display: none`, `visibility: hidden`, `content-visibility: hidden` and full
 * transparency all hide it. `checkVisibility` without options only covers the first.
 *
 * Geometry is deliberately not judged. A control clipped to nothing, sized to zero or
 * moved off screen is still in the accessibility tree — and that is how custom checkboxes,
 * radios and toggles, Clarity's among them, draw their own box over a native input that is
 * visually hidden but is what a screen reader and the form binding use. What an
 * application wants kept from agents it marks `data-clr-context-ignore`.
 */
export function isVisible(element: Element): boolean {
  // An element with `display: contents` has no box of its own, so it never reads as
  // visible, but it hides nothing itself: its children render in its place. It shows
  // exactly when its parent does — a loop rather than recursion, however deep they nest.
  for (let current: Element | null = element; current; current = current.parentElement) {
    // Not `contentVisibilityAuto`: what `content-visibility: auto` skips is off screen, not absent.
    if (checkVisibility(current, true)) {
      return true;
    }
    if (current.ownerDocument.defaultView?.getComputedStyle(current).display !== 'contents') {
      return false;
    }
  }
  return true;
}

/**
 * `Element.checkVisibility`, with or without judging `visibility` and opacity. Where the
 * method is missing — jsdom, which applications' unit tests run in, and older browsers —
 * the same questions are answered from computed style, so a snapshot taken there works
 * rather than throws.
 */
export function checkVisibility(element: Element, judgeVisibility: boolean): boolean {
  const native = (element as HTMLElement).checkVisibility;
  if (typeof native === 'function') {
    return judgeVisibility
      ? native.call(element, { visibilityProperty: true, opacityProperty: true })
      : native.call(element);
  }
  const view = element.ownerDocument.defaultView;
  if (!element.isConnected || !view) {
    return false;
  }
  const own = view.getComputedStyle(element);
  if (own.display === 'contents' || (judgeVisibility && own.visibility === 'hidden')) {
    return false;
  }
  for (let current: Element | null = element; current; current = current.parentElement) {
    const style = current === element ? own : view.getComputedStyle(current);
    if (style.display === 'none' || (judgeVisibility && style.opacity === '0')) {
      return false;
    }
  }
  return true;
}
