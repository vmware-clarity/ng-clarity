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
  const style = view.getComputedStyle(element);
  if (style.clipPath && style.clipPath !== 'none') {
    return true;
  }
  if (style.clip && style.clip !== 'auto') {
    return true;
  }
  const rect = element.getBoundingClientRect();
  return style.overflow === 'hidden' && rect.width <= 1 && rect.height <= 1;
}

/**
 * An element's text as it should be read for a name: content hidden from the
 * accessibility tree, and content hidden from sight, are both left out.
 */
export function accessibleText(element: Element): string {
  let text = '';
  for (const node of Array.from(element.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent ?? '';
      continue;
    }
    if (!(node instanceof Element)) {
      continue;
    }
    // Nothing to contribute, and checking style for an empty element would be a layout
    // read for no reason.
    if (!node.textContent?.trim()) {
      continue;
    }
    if (node.getAttribute('aria-hidden') === 'true' || node.hasAttribute('hidden') || isVisuallyHidden(node)) {
      continue;
    }
    text += accessibleText(node);
  }
  return text;
}
