/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CLR_CONTEXT_WITHHELD_SELECTOR } from './attributes';

/**
 * How many items a published collection lists when the caller gives no budget: the
 * same default `maxItemsPerCollection` the contextual engine applies, so a component
 * called by other page tooling reports no more than the engine would ask for.
 */
export const CLR_CONTEXT_DEFAULT_MAX_ITEMS = 25;

/**
 * Text as page-context tooling compares it: whitespace collapsed and trimmed, and
 * lowercased unless `lowercase` is false. Components that publish labels and the engine
 * that matches an agent's words against them use this one rule, so the two never
 * disagree about whether "Beta  cluster" and "beta cluster" are the same option.
 */
export function clrNormalizeContextText(text: string, lowercase = true): string {
  const collapsed = text.replace(/\s+/g, ' ').trim();
  return lowercase ? collapsed.toLowerCase() : collapsed;
}

/**
 * The text an element shows, as page-context tooling may report it. Text inside a
 * descendant marked `data-clr-context-redact` or `data-clr-context-ignore` is left out,
 * and so is text hidden from assistive technology (`aria-hidden`, `hidden`), so a row or
 * option labelled from its content never carries a value the application withheld.
 * `skip` leaves out further descendants, such as screen-reader-only additions.
 */
export function clrContextText(element: Element, skip?: (descendant: Element) => boolean): string {
  let text = '';
  element.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent ?? '';
    } else if (node.nodeType === Node.ELEMENT_NODE && !isWithheld(node as Element, skip)) {
      text += clrContextText(node as Element, skip);
    }
  });
  return text;
}

function isWithheld(element: Element, skip?: (descendant: Element) => boolean): boolean {
  return element.matches(CLR_CONTEXT_WITHHELD_SELECTOR) || !!skip?.(element);
}
