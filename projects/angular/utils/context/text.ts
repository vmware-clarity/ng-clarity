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
 * and so is text hidden from assistive technology (`aria-hidden`, `hidden`) or from sight
 * (`display: none`, `visibility: hidden`, full transparency), so a row or option labelled
 * from its content never carries a value the application withheld, nor text nobody sees.
 * Block-level parts read as separate words. `skip` leaves out further descendants, such
 * as screen-reader-only additions.
 *
 * Style is judged only while the element is on the page: a component's content that is
 * not rendered right now — the options of a closed combobox — is read from its markup.
 */
export function clrContextText(element: Element, skip?: (descendant: Element) => boolean): string {
  let text = '';
  element.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent ?? '';
    } else if (node.nodeType === Node.ELEMENT_NODE && !isWithheld(node as Element, skip)) {
      const inner = clrContextText(node as Element, skip);
      text += isBlock(node as Element) ? ` ${inner} ` : inner;
    }
  });
  return text;
}

function isWithheld(element: Element, skip?: (descendant: Element) => boolean): boolean {
  return element.matches(CLR_CONTEXT_WITHHELD_SELECTOR) || !!skip?.(element) || isStyleHidden(element);
}

/** Elements that start a new line when nothing says otherwise. */
const BLOCK_TAGS = new Set([
  'address',
  'article',
  'aside',
  'blockquote',
  'br',
  'dd',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hr',
  'li',
  'main',
  'nav',
  'ol',
  'p',
  'pre',
  'section',
  'table',
  'td',
  'th',
  'tr',
  'ul',
]);

function isBlock(element: Element): boolean {
  const style = renderedStyle(element);
  if (!style) {
    return BLOCK_TAGS.has(element.tagName.toLowerCase());
  }
  return !style.display.startsWith('inline') && style.display !== 'contents';
}

/**
 * Whether style hides this element from sight. Its ancestors are judged on the way down
 * to it, so only its own style counts; `checkVisibility` resolves an inherited
 * `visibility` where the browser has it. A descendant that sets `visibility: visible`
 * again inside a hidden one is left out with it.
 */
function isStyleHidden(element: Element): boolean {
  const style = renderedStyle(element);
  if (!style) {
    return false;
  }
  if (style.display === 'none' || style.opacity === '0') {
    return true;
  }
  const native = (element as HTMLElement).checkVisibility;
  if (typeof native === 'function' && style.display !== 'contents') {
    return !native.call(element, { visibilityProperty: true, opacityProperty: true });
  }
  return style.visibility === 'hidden';
}

/** The computed style of an element on the page, or `null` for one that is not. */
function renderedStyle(element: Element): CSSStyleDeclaration | null {
  const view = element.ownerDocument?.defaultView;
  return element.isConnected && view ? view.getComputedStyle(element) : null;
}
