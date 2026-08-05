/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FlexibleConnectedPositionStrategyOrigin } from '@angular/cdk/overlay';
import { ElementRef } from '@angular/core';

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
  const element = getOriginElement(origin);

  if (!element) {
    return origin;
  }

  const elementWindow = element.ownerDocument?.defaultView;

  if (!elementWindow || elementWindow === window) {
    return origin;
  }

  return {
    get x(): number {
      const offset = getCumulativeFrameOffset(elementWindow) ?? { x: 0, y: 0 };
      return element.getBoundingClientRect().left + offset.x;
    },
    get y(): number {
      const offset = getCumulativeFrameOffset(elementWindow) ?? { x: 0, y: 0 };
      return element.getBoundingClientRect().top + offset.y;
    },
    get width(): number {
      return element.getBoundingClientRect().width;
    },
    get height(): number {
      return element.getBoundingClientRect().height;
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
    let frameElement: Element | null;

    try {
      frameElement = currentWindow.frameElement;
    } catch {
      return null;
    }

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
