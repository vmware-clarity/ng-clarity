/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { getAriaReferenceIds } from '@angular/cdk/a11y';
import { CLR_CONTEXT_HIDDEN_SELECTOR } from '@clr/angular/utils';

import { readScope } from './read-scope';
import { ACTION_SELECTOR, UNREADABLE_SELECTOR } from './tables/selectors';
import { SKIPPED_TAGS } from './tables/tags';
import { isHiddenFromContext, isVisible } from './visibility';

/** Normalizes whitespace and truncates to `maxLength`, ending shortened text with an ellipsis. */
export function truncate(text: string, maxLength: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  // Don't cut a surrogate pair in half.
  return `${normalized.slice(0, maxLength - 1).replace(/[\ud800-\udbff]$/, '')}…`;
}

/** Whether an element is visually hidden but available to a screen reader (any library's sr-only idiom). */
export function isVisuallyHidden(element: Element): boolean {
  const style = computedStyle(element);
  return !!style && isClipped(element, style);
}

function computedStyle(element: Element): CSSStyleDeclaration | null {
  const styles = readScope()?.styles;
  const cached = styles?.get(element);
  if (cached) {
    return cached;
  }
  const style = element.ownerDocument.defaultView?.getComputedStyle(element);
  if (!style) {
    return null;
  }
  styles?.set(element, style);
  return style;
}

function isExcludedFromName(element: Element, style: CSSStyleDeclaration | null, includeClipped: boolean): boolean {
  if (element.matches(CLR_CONTEXT_HIDDEN_SELECTOR)) {
    return true;
  }
  if (!style) {
    return false;
  }
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return true;
  }
  return !includeClipped && isClipped(element, style);
}

function isClipped(element: Element, style: CSSStyleDeclaration): boolean {
  // The sr-only idiom clips with `inset(...)`; other shapes still show what they clip.
  if (style.clipPath?.startsWith('inset(')) {
    return true;
  }
  if (style.clip && style.clip !== 'auto') {
    return true;
  }
  if (style.overflow !== 'hidden') {
    return false;
  }
  const rect = element.getBoundingClientRect();
  return rect.width <= 1 && rect.height <= 1;
}

/**
 * An element's text as read for a name, without hidden content; sr-only text counts only when it is all there is.
 * `withheld` selects descendants whose text is never read, and `withholds` picks more of them.
 */
export function accessibleText(
  element: Element,
  exclude?: Element,
  withheld = '',
  withholds?: (child: Element) => boolean
): string {
  const visible = textFor(element, exclude, false, withheld, withholds);
  return visible.trim() ? visible : textFor(element, exclude, true, withheld, withholds);
}

/** Embedded choice lists name by their chosen value, which is user input, so they add nothing to a name. */
const CHOICE_LIST_SELECTOR = 'select, [role="listbox" i]';

/** Script can nest deeper than the parser's 512; deeper content is dropped rather than overflow the stack. */
export const MAX_NESTING_DEPTH = 512;

function textFor(
  element: Element,
  exclude: Element | undefined,
  includeClipped: boolean,
  withheld: string,
  withholds: ((child: Element) => boolean) | undefined,
  depth = 0,
  embedding = true
): string {
  if (depth >= MAX_NESTING_DEPTH) {
    return '';
  }
  let text = '';
  for (const node of Array.from(element.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent ?? '';
      continue;
    }
    // A node in a frame is an instance of that window's Element, so `instanceof` would fail.
    if (node.nodeType !== Node.ELEMENT_NODE || node === exclude) {
      continue;
    }
    const child = node as Element;
    // A `<style>` or `<script>` is text in the DOM, never on screen.
    if (
      SKIPPED_TAGS.has(child.tagName.toLowerCase()) ||
      child.matches(UNREADABLE_SELECTOR) ||
      child.matches(CHOICE_LIST_SELECTOR) ||
      (withheld && child.matches(withheld)) ||
      withholds?.(child)
    ) {
      continue;
    }
    // Judged before reading, so a hidden subtree is never walked.
    const style = computedStyle(child);
    if (isExcludedFromName(child, style, includeClipped)) {
      continue;
    }
    const embeds = embedding && !child.matches(ACTION_SELECTOR);
    const inner =
      (embeds ? embeddedName(child, withheld) : null) ??
      textFor(child, exclude, includeClipped, withheld, withholds, depth + 1, embeds);
    if (!inner.trim()) {
      continue;
    }
    // Block-level content reads as separate words.
    text += style && !style.display.startsWith('inline') && style.display !== 'contents' ? ` ${inner} ` : inner;
  }
  return text;
}

/**
 * The name a descendant gives itself (`aria-label`, an image's `alt`), or `null` to read its content.
 * `aria-labelledby` is not followed recursively, as in the ARIA name computation.
 */
function embeddedName(element: Element, withheld: string): string | null {
  const referenced = followingReference ? '' : referencedText(element, 'aria-labelledby', withheld);
  if (referenced) {
    return referenced;
  }
  const label = element.getAttribute('aria-label')?.trim();
  if (label) {
    return label;
  }
  const tagName = element.tagName.toLowerCase();
  const nativeImage = tagName === 'img' || tagName === 'area';
  if (!nativeImage && element.getAttribute('role')?.trim().split(/\s+/)[0] !== 'img') {
    return null;
  }
  return (nativeImage && element.getAttribute('alt')?.trim()) || element.getAttribute('title')?.trim() || '';
}

let followingReference = false;

export function referencedText(
  element: Element,
  attribute: string,
  withheld = '',
  skip: readonly string[] = []
): string {
  const ids = getAriaReferenceIds(element, attribute);
  if (!ids.length) {
    return '';
  }
  const following = followingReference;
  followingReference = true;
  try {
    return textOfReferences(element.ownerDocument, ids, withheld, skip);
  } finally {
    followingReference = following;
  }
}

function textOfReferences(scope: Document, ids: string[], withheld: string, skip: readonly string[]): string {
  return (
    ids
      .filter(id => !skip.includes(id))
      .map(id => scope.getElementById(id))
      // Page content can point `aria-describedby` at anything, so hidden or unreadable targets are
      // skipped (ARIA would include them, which would smuggle in text nobody sees).
      .filter(
        (referenced): referenced is HTMLElement =>
          !!referenced &&
          !referenced.closest(UNREADABLE_SELECTOR) &&
          !isHiddenFromContext(referenced, withheld) &&
          !isUnrendered(referenced)
      )
      .map(referenced => accessibleText(referenced, undefined, withheld).trim())
      .filter(text => text)
      .join(' ')
  );
}

export function isUnrendered(element: Element, judgeOpacity = true): boolean {
  return !!element.closest('[hidden]') || !isVisible(element, judgeOpacity);
}
