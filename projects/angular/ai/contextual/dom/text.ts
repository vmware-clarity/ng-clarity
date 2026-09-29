/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CLR_CONTEXT_IGNORE_SELECTOR, CLR_CONTEXT_REDACT_SELECTOR } from '@clr/angular/utils';

import { checkVisibility } from './visibility';

/**
 * Normalizes whitespace and enforces a text budget, marking anything shortened with an
 * ellipsis so a reader can tell truncated text from a genuinely short value. The result
 * never exceeds `maxLength`, which is what keeps a snapshot's size predictable.
 */
export function truncate(text: string, maxLength: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1)}…` : normalized;
}

/**
 * Whether an element is hidden from sight while staying available to a screen reader.
 *
 * Detected from computed style rather than any library's class name, because the
 * technique is universal: Clarity's `.clr-sr-only`, Bootstrap's `.visually-hidden`,
 * Tailwind's `.sr-only` and the CDK's `.cdk-visually-hidden` all clip an absolutely
 * positioned one-pixel box.
 *
 * Such text is deliberate guidance for a screen reader — "Use left or right key to
 * resize the column" — and belongs in the accessibility tree, but it is not what a
 * component is called, so it is left out of names.
 */
export function isVisuallyHidden(element: Element): boolean {
  const view = element.ownerDocument.defaultView;
  if (!view) {
    return false;
  }
  return isClipped(element, view.getComputedStyle(element));
}

/**
 * Whether an element contributes nothing to a name: hidden from assistive technology or
 * not rendered at all, and — unless `includeClipped` — hidden from sight too. A control
 * that keeps both variants of its label in the DOM and shows one at a time hides the
 * other with `display: none`, and is named by the visible one.
 */
function isExcludedFromName(element: Element, style: CSSStyleDeclaration | null, includeClipped: boolean): boolean {
  if (
    element.getAttribute('aria-hidden') === 'true' ||
    element.hasAttribute('hidden') ||
    element.hasAttribute('inert')
  ) {
    return true;
  }
  if (!style) {
    return false;
  }
  if (style.display === 'none' || style.visibility === 'hidden') {
    return true;
  }
  return !includeClipped && isClipped(element, style);
}

function isClipped(element: Element, style: CSSStyleDeclaration): boolean {
  // The visually-hidden idiom clips to nothing with `inset(...)`; a shape — a circle
  // masking an avatar, a polygon — still shows what it clips.
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
 * An element's text as it should be read for a name: content hidden from the
 * accessibility tree is left out, and so is content hidden only from sight — the
 * `clr-sr-only` guidance a column header carries ("use left or right key to resize") is
 * an instruction, not part of what the column is called. Where hidden-from-sight text is
 * all an element has, though, it is the name: an icon button labelled by a `clr-sr-only`
 * span is called what that span says, as assistive technology calls it.
 *
 * `exclude` leaves one descendant out — the control a wrapping `<label>` names, whose
 * own options or content are not part of its name. `withheld` is a selector for further
 * descendants whose text is never read — the elements a snapshot's `excludeSelectors`
 * leave out, which must not come back as part of another element's name.
 */
export function accessibleText(element: Element, exclude?: Element, withheld = ''): string {
  const visible = textFor(element, exclude, false, withheld);
  return visible.trim() ? visible : textFor(element, exclude, true, withheld);
}

function textFor(element: Element, exclude: Element | undefined, includeClipped: boolean, withheld: string): string {
  let text = '';
  for (const node of Array.from(element.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent ?? '';
      continue;
    }
    // Checked by node type rather than `instanceof Element`: a node inside a frame's
    // document is an instance of that window's Element, not this one's.
    if (node.nodeType !== Node.ELEMENT_NODE || node === exclude) {
      continue;
    }
    const child = node as Element;
    // Nothing to contribute, and checking style for an empty element would be a layout
    // read for no reason.
    if (!child.textContent?.trim()) {
      continue;
    }
    // Text the application keeps from agents is never borrowed into a name, a label or a
    // description, whatever element above it is being named.
    if (child.matches(UNREADABLE_SELECTOR) || (withheld && child.matches(withheld))) {
      continue;
    }
    const style = child.ownerDocument.defaultView?.getComputedStyle(child) ?? null;
    if (isExcludedFromName(child, style, includeClipped)) {
      continue;
    }
    const inner = textFor(child, exclude, includeClipped, withheld);
    // Block-level content reads as separate words, as it does when a browser names an
    // element: two cells or two lines never run together into one word.
    text += style && !style.display.startsWith('inline') && style.display !== 'contents' ? ` ${inner} ` : inner;
  }
  return text;
}

/**
 * The joined text of every element an id-list attribute (`aria-labelledby`,
 * `aria-describedby`) points at, in the order the ids are given; missing and empty
 * targets are skipped, and so are targets inside anything `withheld` selects.
 */
export function referencedText(element: Element, attribute: string, withheld = ''): string {
  const ids = element.getAttribute(attribute)?.trim();
  if (!ids) {
    return '';
  }
  const document = element.ownerDocument;
  return (
    ids
      .split(/\s+/)
      .map(id => document.getElementById(id))
      // A reference must not reach into a region the engine may not read, nor into an
      // element that is not rendered at all: page content can point an `aria-describedby`
      // at anything with an id. (ARIA would include an unrendered target; for an agent
      // consumer that is a way to smuggle in text nobody sees. Text hidden only visually,
      // clipped for screen readers, is still read, as intended.)
      .filter(
        (referenced): referenced is HTMLElement =>
          !!referenced &&
          !referenced.closest(UNREADABLE_SELECTOR) &&
          !(withheld && referenced.closest(withheld)) &&
          !isUnrendered(referenced)
      )
      .map(referenced => accessibleText(referenced, undefined, withheld).trim())
      .filter(text => text)
      .join(' ')
  );
}

const UNREADABLE_SELECTOR = `${CLR_CONTEXT_IGNORE_SELECTOR}, ${CLR_CONTEXT_REDACT_SELECTOR}`;

/** Whether an element is not rendered: `hidden`, or `display: none` on it or an ancestor. */
function isUnrendered(element: Element): boolean {
  if (element.closest('[hidden]')) {
    return true;
  }
  // Without options this is exactly "not rendered": display: none here or above — or
  // `display: contents`, which has no box but renders its children in its place.
  if (checkVisibility(element, false)) {
    return false;
  }
  if (element.ownerDocument.defaultView?.getComputedStyle(element).display !== 'contents') {
    return true;
  }
  const parent = element.parentElement;
  return parent ? isUnrendered(parent) : false;
}
