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

import { readScope } from './read-scope';
import { isNameFromContents } from './roles';
import { accessibleText, ACTION_SELECTOR, isUnrendered, referencedText, truncate } from './text';

const MESSAGE_ROLES = new Set(['alert', 'status']);

const LABELABLE = new Set(['button', 'input', 'meter', 'output', 'progress', 'select', 'textarea']);

/**
 * The element's accessible name, budgeted: a pragmatic subset of the ARIA name computation.
 * Only roles named from contents use their own text, so a region does not take the page's prose.
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

  if (inputType(element) === 'image') {
    return 'Submit';
  }

  const placeholder = element.getAttribute('aria-placeholder') || element.getAttribute('placeholder');
  if (placeholder?.trim()) {
    return truncate(placeholder, maxTextLength);
  }

  if (role && isNameFromContents(role)) {
    // An alert is named by its message, not its actions: "Saved", not "Saved Undo".
    const unread = MESSAGE_ROLES.has(role)
      ? withheld
        ? `${withheld}, ${ACTION_SELECTOR}`
        : ACTION_SELECTOR
      : withheld;
    return truncate(accessibleText(element, undefined, unread), maxTextLength);
  }

  return '';
}

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
    return labelText(element, withheld) || inputCaption(element);
  }
  return null;
}

function inputType(element: Element): string | null {
  return element.tagName.toLowerCase() === 'input' ? (element as HTMLInputElement).type : null;
}

/** The caption an input button shows; any other input's value is user input, never its name. */
function inputCaption(element: Element): string | null {
  const type = inputType(element);
  const value = element.getAttribute('value');
  switch (type) {
    case 'submit':
      return value ?? 'Submit';
    case 'reset':
      return value ?? 'Reset';
    case 'button':
      return value;
    case 'image':
      return element.getAttribute('alt')?.trim() ? element.getAttribute('alt') : value;
    default:
      return null;
  }
}

function scopedText(element: Element, selector: string, withheld: string): string | null {
  const child = element.querySelector(`:scope > ${selector}`);
  return child && readableNameSource(child, element, withheld) ? accessibleText(child, undefined, withheld) : null;
}

/** Whether a label, legend or caption may name `named`: not when hidden, unreadable, or itself redacted. */
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
  if (source.matches(CLR_CONTEXT_REDACT_SELECTOR)) {
    return false;
  }
  const redacting = source.closest(CLR_CONTEXT_REDACT_SELECTOR);
  return !redacting || redacting.contains(named);
}

function labelText(control: Element, withheld: string): string | null {
  const label = labelOf(control);
  if (!label || !readableNameSource(label, control, withheld)) {
    return null;
  }
  return accessibleText(label, control, withheld);
}

/** `labels` searches the document on every read, which makes a walk quadratic; the walk maps labels once. */
function labelOf(control: Element): Element | null {
  if (!('labels' in control) || !(control as HTMLInputElement).labels) {
    return control.closest('label');
  }
  const scope = readScope();
  if (!scope) {
    return (control as HTMLInputElement).labels?.[0] ?? null;
  }
  const document = control.ownerDocument;
  let labels = scope.labels.get(document);
  if (!labels) {
    labels = new Map();
    for (const label of Array.from(document.querySelectorAll('label'))) {
      const labelled = label.control;
      if (labelled && !labels.has(labelled)) {
        labels.set(labelled, label);
      }
    }
    scope.labels.set(document, labels);
  }
  return labels.get(control) ?? null;
}
