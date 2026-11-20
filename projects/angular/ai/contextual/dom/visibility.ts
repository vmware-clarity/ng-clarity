/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CLR_CONTEXT_HIDDEN_SELECTOR, CLR_CONTEXT_REDACT_SELECTOR } from '@clr/angular/utils';

import { CONTROL_SELECTOR } from './tables/selectors';

/** Whether the element is in hidden, inert or ignored markup, or in a region `withheld` selects. */
export function isHiddenFromContext(element: Element, withheld = ''): boolean {
  return !!element.closest(CLR_CONTEXT_HIDDEN_SELECTOR) || (!!withheld && !!element.closest(withheld));
}

/** {@link isHiddenFromContext} judged on the element alone, for a walk that has already judged its ancestors. */
export function hidesFromContext(element: Element, withheld = ''): boolean {
  return element.matches(CLR_CONTEXT_HIDDEN_SELECTOR) || (!!withheld && element.matches(withheld));
}

/** Whether a redacted region holds `item` but not `container`, so the item's text is withheld from it. */
export function isRedactedWithin(item: Element, container: Element): boolean {
  const redacting = item.closest(CLR_CONTEXT_REDACT_SELECTOR);
  return !!redacting && !redacting.contains(container);
}

/**
 * Whether the element can be seen, as assistive technology judges it. Geometry is not judged:
 * custom checkboxes draw over a visually hidden native input that is still in the accessibility tree.
 * Transparency hides prose and tooltips, but not controls: the native inputs of a button group and the
 * row actions a hover reveals are `opacity: 0` and still reachable. `judgeOpacity: false` ignores it.
 */
export function isVisible(element: Element, judgeOpacity = true): boolean {
  if (!judgeOpacity) {
    return isShown(element, false);
  }
  return isShown(element, true) || (isShown(element, false) && reachesControl(element));
}

function isShown(element: Element, judgeOpacity: boolean): boolean {
  // `display: contents` has no box but hides nothing; it shows exactly when its parent does.
  for (let current: Element | null = element; current; current = current.parentElement) {
    // Not `contentVisibilityAuto`: what `content-visibility: auto` skips is off screen, not absent.
    if (checkVisibility(current, true, judgeOpacity)) {
      return true;
    }
    if (current.ownerDocument.defaultView?.getComputedStyle(current).display !== 'contents') {
      return false;
    }
  }
  return true;
}

function reachesControl(element: Element): boolean {
  return element.matches(CONTROL_SELECTOR) || !!element.querySelector(CONTROL_SELECTOR);
}

/** `Element.checkVisibility`, falling back to computed style where it is missing (jsdom, older browsers). */
export function checkVisibility(element: Element, judgeVisibility: boolean, judgeOpacity = judgeVisibility): boolean {
  const native = (element as HTMLElement).checkVisibility;
  if (typeof native === 'function') {
    return judgeVisibility
      ? native.call(element, { visibilityProperty: true, opacityProperty: judgeOpacity })
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
    if (style.display === 'none' || (judgeOpacity && style.opacity === '0')) {
      return false;
    }
  }
  return true;
}
