/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { createId, FocusTrapTrackerService, isFocusable, isHTMLElement } from '@cds/core/internal';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, Injector, Renderer2 } from '@angular/core';

export interface FocusTrapElement extends HTMLElement {
  topReboundElement: HTMLElement | undefined;
  bottomReboundElement: HTMLElement | undefined;
  focusTrapId: string;
}

export function refocusIfOutsideFocusTrapElement(
  focusedElement: HTMLElement,
  focusTrapElement: FocusTrapElement,
  elementToRefocus?: HTMLElement
) {
  const focusTrapIsCurrent = FocusTrapTrackerService.getCurrent() === focusTrapElement;
  const elementToFocusIsOutsideFocusTrap = elementIsOutsideFocusTrapElement(focusedElement, focusTrapElement);

  if (focusTrapIsCurrent && elementToFocusIsOutsideFocusTrap) {
    elementToRefocus = elementToRefocus || focusTrapElement;
    elementToRefocus.focus();
  } else {
    focusedElement.focus();
  }
}

export function elementIsOutsideFocusTrapElement(
  focusedElement: HTMLElement,
  focusTrapElement: FocusTrapElement
): boolean {
  if (
    focusedElement === focusTrapElement.topReboundElement ||
    focusedElement === focusTrapElement.bottomReboundElement
  ) {
    return true;
  }

  const elementIsInFocusTrapLightDom = focusTrapElement.contains(focusedElement);

  if (elementIsInFocusTrapLightDom) {
    return false;
  }

  if (focusTrapElement !== null && focusTrapElement.contains(focusedElement)) {
    return false;
  }

  return true;
}

export function createFocusTrapReboundElement(document: Document) {
  const offScreenSpan = document.createElement('span');
  offScreenSpan.setAttribute('tabindex', '0');
  offScreenSpan.classList.add('offscreen-focus-rebounder');
  return offScreenSpan;
}

export function addReboundElementsToFocusTrapElement(document: Document, focusTrapElement: FocusTrapElement) {
  if (focusTrapElement && !focusTrapElement.topReboundElement && !focusTrapElement.bottomReboundElement) {
    focusTrapElement.topReboundElement = createFocusTrapReboundElement(document);
    focusTrapElement.bottomReboundElement = createFocusTrapReboundElement(document);

    const parent = focusTrapElement.parentElement;
    const sibling = focusTrapElement.nextSibling;

    if (parent) {
      parent.insertBefore(focusTrapElement.topReboundElement, focusTrapElement);
      if (sibling) {
        parent.insertBefore(focusTrapElement.bottomReboundElement, sibling);
      } else {
        parent.appendChild(focusTrapElement.bottomReboundElement);
      }
    }
  }
}

export function removeReboundElementsFromFocusTrapElement(focusTrapElement: FocusTrapElement) {
  if (focusTrapElement) {
    const parent = focusTrapElement.parentElement;

    if (parent) {
      const topRebound = focusTrapElement.topReboundElement;
      const bottomRebound = focusTrapElement.bottomReboundElement;
      if (topRebound) {
        parent.removeChild(topRebound);
      }
      if (bottomRebound) {
        parent.removeChild(bottomRebound);
      }
    }
    // These are here to to make sure that we completely delete all traces of the removed DOM objects.
    delete focusTrapElement.topReboundElement;
    delete focusTrapElement.bottomReboundElement;
  }
}

// this helper exists to enable the focus trap class to handle vanilla html elements
// it's primary concern is to keep TS happy.
export function castHtmlElementToFocusTrapElement(el: HTMLElement): FocusTrapElement {
  return el as FocusTrapElement;
}

@Injectable()
export class FocusTrap {
  focusTrapElement: FocusTrapElement;
  private previousFocus: HTMLElement;
  private onFocusInEvent: () => void;
  private unlisten: () => void;

  protected _document: Document;

  firstFocusElement: HTMLElement | FocusTrapElement;

  active = false;

  constructor(protected renderer: Renderer2, injector: Injector, platformId: any, hostElement: FocusTrapElement) {
    if (isPlatformBrowser(platformId)) {
      this._document = injector.get(DOCUMENT);
    }

    hostElement = castHtmlElementToFocusTrapElement(hostElement);

    if (!hostElement.focusTrapId) {
      hostElement.focusTrapId = createId();
    }

    this.focusTrapElement = hostElement;
  }

  enableFocusTrap() {
    const fte = this.focusTrapElement;
    const firstFocusElement = fte.querySelector('[cds-first-focus]');
    const activeEl = this._document.activeElement;

    if (FocusTrapTrackerService.getCurrent() === fte) {
      throw new Error('Focus trap is already enabled for this instance.');
    }

    this.firstFocusElement = (firstFocusElement as HTMLElement) || this.focusTrapElement;

    addReboundElementsToFocusTrapElement(this._document, fte);

    if (!isFocusable(fte)) {
      fte.setAttribute('tabindex', '-1');
    }

    if (activeEl && isHTMLElement(activeEl)) {
      this.previousFocus = activeEl as HTMLElement;
    }

    FocusTrapTrackerService.setCurrent(fte);

    // setTimeout here is required for Safari which may try to set focus on
    // element before it is visible...
    const focusTimer = setTimeout(() => {
      this.firstFocusElement.focus();
      clearTimeout(focusTimer);
    }, 10);

    this.onFocusInEvent = this.onFocusIn.bind(this);
    this.unlisten = this.renderer.listen(this._document, 'focusin', this.onFocusInEvent);
    this.active = true;
  }

  removeFocusTrap() {
    if (this.unlisten) {
      this.unlisten();
    }

    removeReboundElementsFromFocusTrapElement(this.focusTrapElement);
    this.renderer.removeAttribute(this.focusTrapElement, 'tabindex');
    FocusTrapTrackerService.activatePreviousCurrent();
    this.active = false;
    if (this.previousFocus) {
      this.previousFocus.focus();
    }
  }

  private onFocusIn(event: FocusEvent) {
    refocusIfOutsideFocusTrapElement(
      event.composedPath()[0] as HTMLElement,
      this.focusTrapElement,
      this.firstFocusElement
    );
  }
}
