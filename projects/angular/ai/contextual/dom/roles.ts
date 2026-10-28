/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isContentEditable } from './aria-state';
import { ownEntry } from '../lookup';
import {
  ARIA_ROLES,
  CONTENT_LEAF_ROLES,
  IMPLICIT_ROLES_BY_TAG,
  INPUT_ROLES_BY_TYPE,
  LEAF_ROLES,
  NAME_FROM_CONTENTS,
  PRESENTATIONAL_ROLES,
  ROLELESS_INPUT_TYPES,
  ROW_HEADER_SCOPES,
  SUGGESTING_INPUT_TYPES,
  TEXT_ENTRY_ROLES,
} from './tables/roles';
import { SECTIONING_SELECTOR } from './tables/selectors';

/**
 * The element's explicit or implicit ARIA role, or `null`. As for AT, the first recognised token of `role` counts,
 * in any case; markup with none falls back to the implicit role, so it cannot invent types.
 */
export function resolveRole(element: Element): string | null {
  const explicit = element.getAttribute('role')?.toLowerCase().split(/\s+/).find(isAriaRole);
  if (explicit && (TEXT_ENTRY_ROLES.has(explicit) || !isContentEditable(element))) {
    return explicit;
  }
  return implicitRole(element);
}

function isAriaRole(token: string): boolean {
  return ARIA_ROLES.has(token) || /^(doc|graphics)-[a-z]{1,24}$/.test(token);
}

export function isLeafRole(role: string): boolean {
  return LEAF_ROLES.has(role);
}

export function isNameFromContents(role: string): boolean {
  return NAME_FROM_CONTENTS.has(role);
}

export function mayContainControls(role: string): boolean {
  return CONTENT_LEAF_ROLES.has(role);
}

export function isPresentationalRole(role: string): boolean {
  return PRESENTATIONAL_ROLES.has(role);
}

/** Selector for every element that may resolve to one of `roles`, or `''` for none. */
export function roleCandidateSelector(roles: ReadonlySet<string>): string {
  if (!roles.size) {
    return '';
  }
  const selectors = new Set(['[role]']);
  for (const [tagName, role] of Object.entries(IMPLICIT_ROLES_BY_TAG)) {
    if (roles.has(role)) {
      selectors.add(tagName);
    }
  }
  const anyOf = (...candidates: string[]) => candidates.some(role => roles.has(role));
  if (anyOf('textbox')) {
    selectors.add('[contenteditable]');
  }
  if (anyOf(...Object.values(INPUT_ROLES_BY_TYPE))) {
    selectors.add('input');
  }
  if (anyOf('combobox', 'listbox')) {
    selectors.add('select');
  }
  if (anyOf('combobox')) {
    selectors.add('input[list]');
  }
  if (anyOf('link')) {
    selectors.add('a[href]').add('area[href]');
  }
  if (anyOf('img', 'presentation')) {
    selectors.add('img');
  }
  if (anyOf('columnheader', 'rowheader')) {
    selectors.add('th');
  }
  if (anyOf('banner')) {
    selectors.add('header');
  }
  if (anyOf('contentinfo')) {
    selectors.add('footer');
  }
  return Array.from(selectors).join(', ');
}

function implicitRole(element: Element): string | null {
  const tagName = element.tagName.toLowerCase();

  // An editing host holds user input, so it is a text field whatever element it is drawn on.
  if (isContentEditable(element)) {
    return 'textbox';
  }

  switch (tagName) {
    case 'input':
      return inputRole(element as HTMLInputElement);
    case 'select':
      return (element as HTMLSelectElement).multiple || (element as HTMLSelectElement).size > 1
        ? 'listbox'
        : 'combobox';
    case 'a':
    case 'area':
      return element.hasAttribute('href') ? 'link' : null;
    case 'img':
      // `alt=""` marks the image decorative.
      return element.getAttribute('alt') === '' ? 'presentation' : 'img';
    case 'section':
    case 'aside':
      // An unnamed section is not a region, or every wrapper would surface as one.
      return tagName === 'aside' || hasNameAttribute(element)
        ? (ownEntry(IMPLICIT_ROLES_BY_TAG, tagName) ?? null)
        : null;
    case 'th': {
      const scope = element.getAttribute('scope')?.toLowerCase() ?? '';
      return ROW_HEADER_SCOPES.includes(scope) ? 'rowheader' : 'columnheader';
    }
    case 'header':
      return closestAncestor(element, SECTIONING_SELECTOR) ? null : 'banner';
    case 'footer':
      return closestAncestor(element, SECTIONING_SELECTOR) ? null : 'contentinfo';
    default:
      return ownEntry(IMPLICIT_ROLES_BY_TAG, tagName) ?? null;
  }
}

function inputRole(input: HTMLInputElement): string | null {
  const type = (input.getAttribute('type') || 'text').toLowerCase();
  if (ROLELESS_INPUT_TYPES.has(type)) {
    return null;
  }
  if (input.hasAttribute('list') && SUGGESTING_INPUT_TYPES.has(type)) {
    return 'combobox';
  }
  // Date and time inputs have no agreed ARIA role; they behave as a textbox.
  return ownEntry(INPUT_ROLES_BY_TYPE, type) ?? 'textbox';
}

/** Narrower than the full name computation, which depends on the role and would be circular. */
function hasNameAttribute(element: Element): boolean {
  return (
    !!element.getAttribute('aria-label')?.trim() ||
    !!element.getAttribute('aria-labelledby')?.trim() ||
    !!element.getAttribute('title')?.trim()
  );
}

/** The nearest ancestor in the rendered tree matching `selector`, so a component's own markup sits in its page. */
function closestAncestor(element: Element, selector: string): Element | null {
  const parent = element.parentElement;
  return parent ? parent.closest(selector) : null;
}
