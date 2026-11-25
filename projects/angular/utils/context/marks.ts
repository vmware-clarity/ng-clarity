/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { booleanAttribute, Directive, input } from '@angular/core';

/**
 * Marks an element whose value, and everything inside it, never appears in a snapshot.
 * The element is still described, so an agent knows the value is withheld rather than absent.
 * In a template, prefer the `clrContextRedact` directive, which sets it.
 */
export const CLR_CONTEXT_REDACT_ATTRIBUTE = 'data-clr-context-redact';

/**
 * Elements carrying this attribute, and everything inside them, are invisible to the engine.
 * In a template, prefer the `clrContextIgnore` directive, which sets it.
 */
export const CLR_CONTEXT_IGNORE_ATTRIBUTE = 'data-clr-context-ignore';

/**
 * How page-context tooling treats an element and everything inside it. `ignore`: invisible to it.
 * `redact`: described, but its values and text are withheld, so an agent knows something is there.
 */
export type ClrContextMark = 'ignore' | 'redact';

const MARK_ATTRIBUTES: Record<ClrContextMark, string> = {
  ignore: CLR_CONTEXT_IGNORE_ATTRIBUTE,
  redact: CLR_CONTEXT_REDACT_ATTRIBUTE,
};

/** Marks the element; the teardown removes the mark. */
export function markContext(element: Element, mark: ClrContextMark): () => void {
  element.setAttribute(MARK_ATTRIBUTES[mark], '');
  return () => element.removeAttribute(MARK_ATTRIBUTES[mark]);
}

/** Whether the element itself carries the mark. */
export function hasContextMark(element: Element, mark: ClrContextMark): boolean {
  return element.hasAttribute(MARK_ATTRIBUTES[mark]);
}

/** The element, or its closest ancestor, that carries the mark. */
export function closestContextMark(element: Element, mark: ClrContextMark): Element | null {
  return element.closest(`[${MARK_ATTRIBUTES[mark]}]`);
}

/** What page-context tooling treats as not on the page; shared so the engine and components agree. */
export const CLR_CONTEXT_HIDDEN_SELECTOR = `[hidden], [aria-hidden="true"], [inert], [${CLR_CONTEXT_IGNORE_ATTRIBUTE}]`;

/** An editing host; what it holds is user input, never text to read into a name. */
export const CLR_CONTEXT_EDITING_HOST_SELECTOR = '[contenteditable]:not([contenteditable="false" i])';

/** Whether the element is hidden from page-context tooling: hidden, inert or marked `ignore`. */
export function isContextHidden(element: Element): boolean {
  return element.matches(CLR_CONTEXT_HIDDEN_SELECTOR);
}

/** Whether the element, or an ancestor, is hidden from page-context tooling. */
export function isWithinContextHidden(element: Element): boolean {
  return !!element.closest(CLR_CONTEXT_HIDDEN_SELECTOR);
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

/**
 * Hides the element and everything inside it from AI page context, by setting `data-clr-context-ignore`.
 * Put it on UI that consumes context, such as a chat panel, to avoid feedback loops.
 */
@Directive({
  selector: '[clrContextIgnore]',
  host: { '[attr.data-clr-context-ignore]': 'clrContextIgnore() ? "" : null' },
})
export class ClrContextIgnore {
  /** `false` lifts the mark, such as `[clrContextIgnore]="isInternal(item)"` on one item of a list. */
  readonly clrContextIgnore = input(true, { transform: booleanAttribute });
}

/**
 * Withholds the values and text of the element and everything inside it from AI page context, by setting
 * `data-clr-context-redact`. The element is still described, so an agent knows the value is withheld.
 */
@Directive({
  selector: '[clrContextRedact]',
  host: { '[attr.data-clr-context-redact]': 'clrContextRedact() ? "" : null' },
})
export class ClrContextRedact {
  /** `false` lifts the mark, such as `[clrContextRedact]="account.private"` on one row of a grid. */
  readonly clrContextRedact = input(true, { transform: booleanAttribute });
}
