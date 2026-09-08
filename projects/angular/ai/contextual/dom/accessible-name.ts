/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isNameFromContents } from './roles';
import { accessibleText, truncate } from './text';

/** Elements whose name a `<label>` may supply. */
const LABELABLE = new Set(['button', 'input', 'meter', 'output', 'progress', 'select', 'textarea']);

/**
 * The element's accessible name, budgeted — a pragmatic subset of the ARIA accessible
 * name computation covering the sources that actually appear in application markup.
 *
 * Resolution order: `aria-labelledby`, `aria-label`, a native label source (an
 * associated or wrapping `<label>`, a `<legend>`, `<caption>`, `<figcaption>`, or `alt`),
 * `title`, and finally the element's own text — but only for roles that may name
 * themselves from their contents (see `isNameFromContents`).
 *
 * That last restriction is what keeps the result useful: without it a `region` or `form`
 * would take the whole page's prose as its label.
 */
export function accessibleName(element: Element, role: string | null, maxTextLength: number): string {
  const referenced = labelledByText(element);
  if (referenced) {
    return truncate(referenced, maxTextLength);
  }

  const label = element.getAttribute('aria-label');
  if (label?.trim()) {
    return truncate(label, maxTextLength);
  }

  const native = nativeName(element);
  if (native?.trim()) {
    return truncate(native, maxTextLength);
  }

  const title = element.getAttribute('title');
  if (title?.trim()) {
    return truncate(title, maxTextLength);
  }

  if (role && isNameFromContents(role)) {
    return truncate(accessibleText(element), maxTextLength);
  }

  return '';
}

/** The joined text of every element `aria-labelledby` points at. */
function labelledByText(element: Element): string {
  const ids = element.getAttribute('aria-labelledby')?.trim();
  if (!ids) {
    return '';
  }
  const document = element.ownerDocument;
  return ids
    .split(/\s+/)
    .map(id => document.getElementById(id))
    .map(referenced => (referenced ? accessibleText(referenced).trim() : ''))
    .filter(text => text)
    .join(' ');
}

/** The name HTML itself supplies for this element, or `null` when it supplies none. */
function nativeName(element: Element): string | null {
  const tagName = element.tagName.toLowerCase();

  if (tagName === 'img' || tagName === 'area') {
    return element.getAttribute('alt');
  }
  if (tagName === 'fieldset') {
    return scopedText(element, 'legend');
  }
  if (tagName === 'table') {
    return scopedText(element, 'caption');
  }
  if (tagName === 'figure') {
    return scopedText(element, 'figcaption');
  }
  if (LABELABLE.has(tagName)) {
    return labelText(element);
  }
  return null;
}

/** Text of a direct child matching `selector`, the only place these names may come from. */
function scopedText(element: Element, selector: string): string | null {
  const child = element.querySelector(`:scope > ${selector}`);
  return child ? accessibleText(child) : null;
}

/** The text of the `<label>` that names a form control, associated or wrapping. */
function labelText(control: Element): string | null {
  if (control.id) {
    const associated = control.ownerDocument.querySelector(`label[for="${CSS.escape(control.id)}"]`);
    if (associated) {
      return accessibleText(associated);
    }
  }
  const wrapping = control.closest('label');
  return wrapping ? accessibleText(wrapping) : null;
}
