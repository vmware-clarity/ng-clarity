/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CLR_CONTEXT_WITHHELD_SELECTOR } from './attributes';
import { BLOCK_TAGS } from './tags';

/** Text as page-context tooling compares it, shared so components and the engine agree on matches. */
export function clrNormalizeContextText(text: string, lowercase = true): string {
  const collapsed = text.replace(/\s+/g, ' ').trim();
  return lowercase ? collapsed.toLowerCase() : collapsed;
}

/**
 * The text an element shows, without redacted, ignored or hidden descendants, with whitespace collapsed.
 * Style is only judged while the element is on the page; a closed combobox's options are read from markup.
 */
export function clrContextText(element: Element, skip?: (descendant: Element) => boolean): string {
  return clrNormalizeContextText(textWithin(element, skip, 0), false);
}

/** Script can nest deeper than the parser's 512; deeper content is dropped rather than overflow the stack. */
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
    const style = renderedStyle(child);
    if (style && isStyleHidden(child, style)) {
      return;
    }
    const inner = textWithin(child, skip, depth + 1);
    text += isBlock(child, style) ? ` ${inner} ` : inner;
  });
  return text;
}

function isBlock(element: Element, style: CSSStyleDeclaration | null): boolean {
  const tagName = element.tagName.toLowerCase();
  if (!style || tagName === 'br') {
    return BLOCK_TAGS.has(tagName);
  }
  return !style.display.startsWith('inline') && style.display !== 'contents';
}

/** A descendant setting `visibility: visible` inside a hidden one is left out with it. */
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

function renderedStyle(element: Element): CSSStyleDeclaration | null {
  const view = element.ownerDocument?.defaultView;
  return element.isConnected && view ? view.getComputedStyle(element) : null;
}
