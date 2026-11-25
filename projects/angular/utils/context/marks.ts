/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { booleanAttribute, DestroyRef, Directive, effect, ElementRef, inject, input, Signal } from '@angular/core';

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

/** Whether page-context tooling reads no text from the element: hidden, ignored, redacted or an editing host. */
export function isContextWithheld(element: Element): boolean {
  return (
    isContextHidden(element) || hasContextMark(element, 'redact') || element.matches(CLR_CONTEXT_EDITING_HOST_SELECTOR)
  );
}

/** Whether something inside the element is {@link isContextWithheld}. */
export function holdsContextWithheld(element: Element): boolean {
  return Array.from(element.querySelectorAll('*')).some(isContextWithheld);
}

/** Marks the host element while `active` is true; a mark is set until the input is first read, so it fails closed. */
function markHostWhile(mark: ClrContextMark, active: Signal<boolean>): void {
  const host: Node = inject(ElementRef).nativeElement;
  if (host.nodeType !== Node.ELEMENT_NODE) {
    return;
  }
  let unmark: (() => void) | null = markContext(host as Element, mark);
  effect(() => {
    if (active() && !unmark) {
      unmark = markContext(host as Element, mark);
    } else if (!active() && unmark) {
      unmark();
      unmark = null;
    }
  });
  inject(DestroyRef).onDestroy(() => unmark?.());
}

/**
 * Hides the element and everything inside it from AI page context. Put it on UI that consumes
 * context, such as a chat panel, to avoid feedback loops.
 */
@Directive({ selector: '[clrContextIgnore]' })
export class ClrContextIgnore {
  /** `false` lifts the mark, such as `[clrContextIgnore]="isInternal(item)"` on one item of a list. */
  readonly clrContextIgnore = input(true, { transform: booleanAttribute });

  constructor() {
    markHostWhile('ignore', this.clrContextIgnore);
  }
}

/**
 * Withholds the values and text of the element and everything inside it from AI page context.
 * The element is still described, so an agent knows the value is withheld rather than absent.
 */
@Directive({ selector: '[clrContextRedact]' })
export class ClrContextRedact {
  /** `false` lifts the mark, such as `[clrContextRedact]="account.private"` on one row of a grid. */
  readonly clrContextRedact = input(true, { transform: booleanAttribute });

  constructor() {
    markHostWhile('redact', this.clrContextRedact);
  }
}
