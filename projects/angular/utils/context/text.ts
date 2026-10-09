/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CLR_CONTEXT_WITHHELD_SELECTOR } from './attributes';

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
  return textWithin(element, skip, 0);
}

/**
 * How deep text is read. The HTML parser nests no deeper than 512, but script can, and
 * reading recurses once per level: what lies deeper is left out rather than the stack
 * running out.
 */
const MAX_TEXT_DEPTH = 512;

function textWithin(element: Element, skip: ((descendant: Element) => boolean) | undefined, depth: number): string {
  if (depth >= MAX_TEXT_DEPTH) {
    return '';
  }
  let text = '';
  element.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent ?? '';
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }
    const child = node as Element;
    if (child.matches(CLR_CONTEXT_WITHHELD_SELECTOR) || skip?.(child)) {
      return;
    }
    // Read once: a computed style costs a style lookup, and every descendant needs it.
    const style = renderedStyle(child);
    if (style && isStyleHidden(child, style)) {
      return;
    }
    const inner = textWithin(child, skip, depth + 1);
    text += isBlock(child, style) ? ` ${inner} ` : inner;
  });
  return text;
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

/** Whether an element's text stands apart from its neighbours'. A line break always does. */
function isBlock(element: Element, style: CSSStyleDeclaration | null): boolean {
  const tagName = element.tagName.toLowerCase();
  if (!style || tagName === 'br') {
    return BLOCK_TAGS.has(tagName);
  }
  return !style.display.startsWith('inline') && style.display !== 'contents';
}

/**
 * Whether style hides this element from sight. Its ancestors are judged on the way down
 * to it, so only its own style counts; `checkVisibility` resolves an inherited
 * `visibility` where the browser has it. A descendant that sets `visibility: visible`
 * again inside a hidden one is left out with it.
 */
function isStyleHidden(element: Element, style: CSSStyleDeclaration): boolean {
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
