/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FlexibleConnectedPositionStrategyOrigin } from '@angular/cdk/overlay';
import { ElementRef } from '@angular/core';

import { getFrameElement } from './dom-realm';

/**
 * Resolves an origin to its element and owning window, but only when that window differs
 * from this one - i.e. the origin lives inside an iframe. Returns null for same-window
 * origins and for non-element (point) origins, so a single check lets callers skip all
 * cross-window handling for the overwhelming majority of popovers.
 *
 * Cheap: a few property reads, no layout access.
 */
export function getCrossWindowOriginContext(
  origin: FlexibleConnectedPositionStrategyOrigin
): { element: Element; elementWindow: Window } | null {
  const element = getOriginElement(origin);
  const elementWindow = element?.ownerDocument?.defaultView;

  return element && elementWindow && elementWindow !== window ? { element, elementWindow } : null;
}

/**
 * CDK's FlexibleConnectedPositionStrategy anchors the overlay by reading
 * origin.getBoundingClientRect() (for an Element/ElementRef origin) directly off the
 * origin, relative to the origin's own window. That only matches the overlay panel's
 * window (always the one this code runs in) when the origin lives in the same document.
 * When the origin sits inside an iframe (e.g. a micro-frontend mounting its trigger in a
 * nested document, possibly combined with a ShadowRoot), the raw rect is relative to the
 * wrong viewport and the overlay is mispositioned.
 *
 * If the origin is same-window (or not an Element/ElementRef at all), this returns it
 * unchanged. Otherwise it returns a Point-based origin (the other shape
 * FlexibleConnectedPositionStrategy natively supports) whose x/y/width/height are live
 * getters that recompute the element's rect plus the cumulative offset of every ancestor
 * iframe between the origin's window and this one, so the overlay still anchors
 * correctly across repositions (scroll, resize). This has no effect on anything besides
 * overlay positioning math - it never replaces the origin ElementRef consumers rely on
 * elsewhere (e.g. scroll listeners), since it only wraps a local copy used for
 * positioning.
 *
 * If the ancestor iframe chain can't be safely resolved (e.g. a cross-origin frame
 * boundary this code can't introspect), the getters fall back to the element's own
 * un-translated rect - the exact numbers CDK would compute if given the raw
 * Element/ElementRef directly, so behavior for that case is unchanged.
 */
export function resolveCrossWindowOrigin(
  origin: FlexibleConnectedPositionStrategyOrigin
): FlexibleConnectedPositionStrategyOrigin {
  const crossWindowOrigin = getCrossWindowOriginContext(origin);

  // Same-window origins (and point origins) are handed back untouched - no wrapping, no
  // translation, no behavior change from a popover that never crosses a window boundary.
  if (!crossWindowOrigin) {
    return origin;
  }

  const { element, elementWindow } = crossWindowOrigin;

  let cached: { x: number; y: number; width: number; height: number } | null = null;

  // CDK's position strategy reads x/y/width/height several times per apply() (it builds
  // a rect from a Point origin as {top: y, bottom: y + height, left: x, right: x + width}).
  // Memoizing per microtask collapses that into a single rect/offset computation instead
  // of one forced layout read per property access, while still recomputing fresh on the
  // next reposition (scroll, resize), since the cache clears before the next microtask.
  const read = () => {
    if (!cached) {
      const rect = element.getBoundingClientRect();
      const offset = getCumulativeFrameOffset(elementWindow) ?? { x: 0, y: 0 };
      cached = { x: rect.left + offset.x, y: rect.top + offset.y, width: rect.width, height: rect.height };
      queueMicrotask(() => (cached = null));
    }

    return cached;
  };

  return {
    get x(): number {
      return read().x;
    },
    get y(): number {
      return read().y;
    },
    get width(): number {
      return read().width;
    },
    get height(): number {
      return read().height;
    },
  };
}

function getOriginElement(origin: FlexibleConnectedPositionStrategyOrigin): Element | null {
  if (origin instanceof ElementRef) {
    return origin.nativeElement;
  }

  // `instanceof Element` is realm-sensitive and misses raw elements belonging to
  // another window - exactly the population this util targets - so duck-type instead.
  if ((origin as Node)?.nodeType === Node.ELEMENT_NODE) {
    return origin as Element;
  }

  return null;
}

/**
 * Walks the chain of window.frameElement references from `originWindow` up to this
 * code's own window, summing each ancestor iframe's position. Returns null if the
 * chain can't be fully resolved (cross-origin boundary, or `originWindow` isn't
 * actually embedded within this window).
 */
function getCumulativeFrameOffset(originWindow: Window): { x: number; y: number } | null {
  let offsetX = 0;
  let offsetY = 0;
  let currentWindow: Window | null = originWindow;

  while (currentWindow && currentWindow !== window) {
    const frameElement = getFrameElement(currentWindow);

    if (!frameElement) {
      return null;
    }

    const frameRect = frameElement.getBoundingClientRect();
    // clientLeft/clientTop only cover the frame's border, not any CSS padding, which
    // would otherwise skew the anchor - read computed style through the frame's own
    // window for realm-safety.
    const frameWindow = frameElement.ownerDocument?.defaultView ?? window;
    const { borderLeftWidth, borderTopWidth, paddingLeft, paddingTop } = frameWindow.getComputedStyle(frameElement);
    offsetX += frameRect.left + (parseFloat(borderLeftWidth) || 0) + (parseFloat(paddingLeft) || 0);
    offsetY += frameRect.top + (parseFloat(borderTopWidth) || 0) + (parseFloat(paddingTop) || 0);
    currentWindow = frameElement.ownerDocument?.defaultView ?? null;
  }

  return currentWindow === window ? { x: offsetX, y: offsetY } : null;
}
