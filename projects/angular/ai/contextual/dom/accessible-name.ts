/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  CLR_CONTEXT_EDITING_HOST_SELECTOR,
  CLR_CONTEXT_HIDDEN_SELECTOR,
  CLR_CONTEXT_REDACT_SELECTOR,
} from '@clr/angular/utils';

import { isNameFromContents } from './roles';
import { accessibleText, isUnrendered, referencedText, truncate } from './text';

/** Elements whose name a `<label>` may supply. */
const LABELABLE = new Set(['button', 'input', 'meter', 'output', 'progress', 'select', 'textarea']);

/**
 * The element's accessible name, budgeted — a pragmatic subset of the ARIA accessible
 * name computation covering the sources that actually appear in application markup.
 *
 * Resolution order: `aria-labelledby`, `aria-label`, a native label source (an
 * associated or wrapping `<label>`, a `<legend>`, `<caption>`, `<figcaption>`, or `alt`),
 * `title`, a placeholder, and finally the element's own text — but only for roles that
 * may name themselves from their contents (see `isNameFromContents`).
 *
 * That last restriction is what keeps the result useful: without it a `region` or `form`
 * would take the whole page's prose as its label.
 *
 * `withheld` is a selector for elements whose text is never read into a name (see
 * `accessibleText`).
 */
export function accessibleName(element: Element, role: string | null, maxTextLength: number, withheld = ''): string {
  const referenced = referencedText(element, 'aria-labelledby', withheld);
  if (referenced) {
    return truncate(referenced, maxTextLength);
  }

  const label = element.getAttribute('aria-label');
  if (label?.trim()) {
    return truncate(label, maxTextLength);
  }

  const native = nativeName(element, withheld);
  if (native?.trim()) {
    return truncate(native, maxTextLength);
  }

  const title = element.getAttribute('title');
  if (title?.trim()) {
    return truncate(title, maxTextLength);
  }

  // A placeholder is the last thing HTML-AAM lets a field be named by. Search boxes in
  // particular routinely have nothing else.
  const placeholder = element.getAttribute('aria-placeholder') || element.getAttribute('placeholder');
  if (placeholder?.trim()) {
    return truncate(placeholder, maxTextLength);
  }

  if (role && isNameFromContents(role)) {
    return truncate(accessibleText(element, undefined, withheld), maxTextLength);
  }

  return '';
}

/** The name HTML itself supplies for this element, or `null` when it supplies none. */
function nativeName(element: Element, withheld: string): string | null {
  const tagName = element.tagName.toLowerCase();

  if (tagName === 'img' || tagName === 'area') {
    return element.getAttribute('alt');
  }
  if (tagName === 'fieldset') {
    return scopedText(element, 'legend', withheld);
  }
  if (tagName === 'table') {
    return scopedText(element, 'caption', withheld);
  }
  if (tagName === 'figure') {
    return scopedText(element, 'figcaption', withheld);
  }
  if (LABELABLE.has(tagName)) {
    return labelText(element, withheld);
  }
  return null;
}

/** Text of a direct child matching `selector`, the only place these names may come from. */
function scopedText(element: Element, selector: string, withheld: string): string | null {
  const child = element.querySelector(`:scope > ${selector}`);
  return child && readableNameSource(child, element, withheld) ? accessibleText(child, undefined, withheld) : null;
}

/**
 * Whether a label, legend or caption may name `named`. Not when it is in a region the
 * engine may not read, or excluded, or in an editor; not when it is hidden — `hidden`,
 * `aria-hidden`, inert, or not rendered — since text nobody sees must not name what they
 * do (text clipped for screen readers is seen, and still names); and not when a redacted
 * region holds it without holding what it names — a label marked `data-clr-context-redact`
 * shows something sensitive, not a field's name. A label inside the same redacted region
 * as its field still names it: a region withholds values and content, not what fields
 * are called. A label that carries the mark itself does not.
 */
function readableNameSource(source: Element, named: Element, withheld: string): boolean {
  if (source.closest(CLR_CONTEXT_HIDDEN_SELECTOR) || source.closest(CLR_CONTEXT_EDITING_HOST_SELECTOR)) {
    return false;
  }
  if (isUnrendered(source)) {
    return false;
  }
  if (withheld && source.closest(withheld)) {
    return false;
  }
  // A label marked redacted itself shows something sensitive, even wrapped around its
  // field: the mark is on what it says.
  if (source.matches(CLR_CONTEXT_REDACT_SELECTOR)) {
    return false;
  }
  const redacting = source.closest(CLR_CONTEXT_REDACT_SELECTOR);
  return !redacting || redacting.contains(named);
}

/**
 * The text of the `<label>` that names a form control, associated or wrapping.
 *
 * The browser already maintains the association as `labels`, so reading it is a
 * constant-time lookup rather than a document-wide query per field — which on a long
 * form is the difference between a linear and a quadratic scrape. A wrapping label's
 * name leaves the control itself out: a `<select>`'s options are not part of its name.
 */
function labelText(control: Element, withheld: string): string | null {
  // The browser keeps the association for labelable elements; only an element that
  // cannot be labelled (a custom textbox) falls back to a label wrapped around it.
  const labels = (control as HTMLInputElement).labels;
  const label = labels ? labels[0] : control.closest('label');
  if (!label || !readableNameSource(label, control, withheld)) {
    return null;
  }
  return accessibleText(label, control, withheld);
}
