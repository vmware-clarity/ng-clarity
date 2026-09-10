/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Normalizes whitespace and enforces a text budget, marking anything shortened with an
 * ellipsis so a reader can tell truncated text from a genuinely short value. The result
 * never exceeds `maxLength`, which is what keeps a snapshot's size predictable.
 */
export function truncate(text: string, maxLength: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1)}…` : normalized;
}

/** An element's text content, budgeted. */
export function textOf(element: Element | null | undefined, maxLength: number): string {
  return truncate(element?.textContent || '', maxLength);
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
 * Whether an element contributes nothing to a name: hidden from assistive technology,
 * not rendered at all, or rendered out of sight. The same rule the walk applies when it
 * decides what to describe, so a control that keeps both variants of its label in the
 * DOM and shows one at a time is named by the visible one only.
 */
function isExcludedFromName(element: Element): boolean {
  if (element.getAttribute('aria-hidden') === 'true' || element.hasAttribute('hidden')) {
    return true;
  }
  const view = element.ownerDocument.defaultView;
  if (!view) {
    return false;
  }
  const style = view.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden') {
    return true;
  }
  return isClipped(element, style);
}

function isClipped(element: Element, style: CSSStyleDeclaration): boolean {
  if (style.clipPath && style.clipPath !== 'none') {
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
 * accessibility tree, and content hidden from sight, are both left out.
 *
 * `exclude` leaves one descendant out — the control a wrapping `<label>` names, whose
 * own options or content are not part of its name.
 */
export function accessibleText(element: Element, exclude?: Element): string {
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
    if (isExcludedFromName(child)) {
      continue;
    }
    text += accessibleText(child, exclude);
  }
  return text;
}
