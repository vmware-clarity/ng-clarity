/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';

import { publishFor } from './publish';

/**
 * How page-context tooling treats an element and everything inside it. `ignore`: invisible to it.
 * `redact`: described, but its values and text are withheld, so an agent knows something is there.
 */
export type ClrContextMark = 'ignore' | 'redact';

// Kept off the elements, so page content can neither read a mark nor plant one to hide itself.
const marks: Record<ClrContextMark, WeakMap<Element, object>> = { ignore: new WeakMap(), redact: new WeakMap() };

/** Marks the element; the teardown removes only this mark. */
export function markContext(element: Element, mark: ClrContextMark): () => void {
  return publishFor(marks[mark], element, {});
}

/** Whether the element itself carries the mark. */
export function hasContextMark(element: Element, mark: ClrContextMark): boolean {
  return marks[mark].has(element);
}

/** The element, or its closest ancestor, that carries the mark. */
export function closestContextMark(element: Element, mark: ClrContextMark): Element | null {
  for (let current: Element | null = element; current; current = current.parentElement) {
    if (marks[mark].has(current)) {
      return current;
    }
  }
  return null;
}

/** What page-context tooling treats as not on the page, along with `ignore` marks. */
export const CLR_CONTEXT_HIDDEN_SELECTOR = '[hidden], [aria-hidden="true"], [inert]';

/** An editing host; what it holds is user input, never text to read into a name. */
export const CLR_CONTEXT_EDITING_HOST_SELECTOR = '[contenteditable]:not([contenteditable="false" i])';

/** Whether the element is hidden from page-context tooling: hidden, inert or marked `ignore`. */
export function isContextHidden(element: Element): boolean {
  return element.matches(CLR_CONTEXT_HIDDEN_SELECTOR) || hasContextMark(element, 'ignore');
}

/** Whether the element, or an ancestor, is hidden from page-context tooling. */
export function isWithinContextHidden(element: Element): boolean {
  return !!element.closest(CLR_CONTEXT_HIDDEN_SELECTOR) || !!closestContextMark(element, 'ignore');
}

function markHost(mark: ClrContextMark): void {
  const host: Node = inject(ElementRef).nativeElement;
  if (host.nodeType === Node.ELEMENT_NODE) {
    inject(DestroyRef).onDestroy(markContext(host as Element, mark));
  }
}

/**
 * Hides the element and everything inside it from AI page context. Put it on UI that consumes
 * context, such as a chat panel, to avoid feedback loops.
 */
@Directive({ selector: '[clrContextIgnore]' })
export class ClrContextIgnore {
  constructor() {
    markHost('ignore');
  }
}

/**
 * Withholds the values and text of the element and everything inside it from AI page context.
 * The element is still described, so an agent knows the value is withheld rather than absent.
 */
@Directive({ selector: '[clrContextRedact]' })
export class ClrContextRedact {
  constructor() {
    markHost('redact');
  }
}
