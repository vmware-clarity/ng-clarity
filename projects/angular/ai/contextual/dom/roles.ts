/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isContentEditable } from './aria-state';
import { ownEntry } from '../lookup';

/** Implicit ARIA role per HTML element, per HTML-AAM. Attribute-dependent ones are in {@link resolveRole}. */
const IMPLICIT_ROLES_BY_TAG: Record<string, string> = {
  article: 'article',
  aside: 'complementary',
  blockquote: 'blockquote',
  button: 'button',
  caption: 'caption',
  dd: 'definition',
  details: 'group',
  dialog: 'dialog',
  dl: 'list',
  dt: 'term',
  fieldset: 'group',
  figure: 'figure',
  form: 'form',
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  h5: 'heading',
  h6: 'heading',
  hr: 'separator',
  li: 'listitem',
  main: 'main',
  menu: 'list',
  meter: 'meter',
  nav: 'navigation',
  ol: 'list',
  optgroup: 'group',
  option: 'option',
  output: 'status',
  progress: 'progressbar',
  search: 'search',
  section: 'region',
  summary: 'button',
  table: 'table',
  tbody: 'rowgroup',
  td: 'cell',
  textarea: 'textbox',
  tfoot: 'rowgroup',
  thead: 'rowgroup',
  tr: 'row',
  ul: 'list',
};

/**
 * Roles an `<input>` carries by `type`. Password and file get one beyond HTML-AAM so they don't
 * vanish from a snapshot; their values are still withheld (see `isRedacted`).
 */
const INPUT_ROLES_BY_TYPE: Record<string, string> = {
  button: 'button',
  checkbox: 'checkbox',
  email: 'textbox',
  file: 'button',
  image: 'button',
  number: 'spinbutton',
  password: 'textbox',
  radio: 'radio',
  range: 'slider',
  reset: 'button',
  search: 'searchbox',
  submit: 'button',
  tel: 'textbox',
  text: 'textbox',
  url: 'textbox',
};

const SUGGESTING_INPUT_TYPES = new Set(['text', 'search', 'url', 'tel', 'email']);

const ROLELESS_INPUT_TYPES = new Set(['hidden', 'color']);

/** Only a page-level `<header>`/`<footer>` is a landmark, per HTML-AAM. */
const SECTIONING_SELECTOR = 'article, aside, main, nav, section';

/** Roles named from their own text (ARIA "name from contents"); a superset of {@link LEAF_ROLES}. */
const NAME_FROM_CONTENTS = new Set([
  'alert',
  'button',
  'caption',
  'cell',
  'checkbox',
  'columnheader',
  'definition',
  'gridcell',
  'heading',
  'link',
  'listitem',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'radio',
  'row',
  'rowheader',
  'status',
  'switch',
  'tab',
  'term',
  'tooltip',
  'treeitem',
]);

/** Roles of a single control or message, where descending would only repeat the label. */
const LEAF_ROLES = new Set([
  'alert',
  'button',
  'caption',
  'checkbox',
  'definition',
  'heading',
  'img',
  'link',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'meter',
  'option',
  'progressbar',
  'radio',
  'searchbox',
  'separator',
  'slider',
  'spinbutton',
  'status',
  'switch',
  'tab',
  'term',
  'textbox',
  'tooltip',
  'treeitem',
]);

/** Leaf roles that may still nest a separate control, such as a heading with a button. */
const CONTENT_LEAF_ROLES = new Set([
  'heading',
  'status',
  'alert',
  'term',
  'caption',
  'definition',
  'tooltip',
  'treeitem',
]);

const MAX_ROLE_LENGTH = 32;

/** An editing host with any other role would have what the user typed read as prose. */
const TEXT_ENTRY_ROLES = new Set(['textbox', 'searchbox', 'combobox']);

const PRESENTATIONAL_ROLES = new Set(['presentation', 'none']);

/** The element's explicit or implicit ARIA role, or `null`. Only the first token of `role` counts, as for AT. */
export function resolveRole(element: Element): string | null {
  // A token longer than any ARIA role falls back to the implicit role, so markup cannot inflate a snapshot.
  const explicit = element.getAttribute('role')?.trim().split(/\s+/)[0];
  if (
    explicit &&
    explicit.length <= MAX_ROLE_LENGTH &&
    (TEXT_ENTRY_ROLES.has(explicit) || !isContentEditable(element))
  ) {
    return explicit;
  }
  return implicitRole(element);
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
      const scope = element.getAttribute('scope')?.toLowerCase();
      return scope === 'row' || scope === 'rowgroup' ? 'rowheader' : 'columnheader';
    }
    case 'header':
      return element.parentElement?.closest(SECTIONING_SELECTOR) ? null : 'banner';
    case 'footer':
      return element.parentElement?.closest(SECTIONING_SELECTOR) ? null : 'contentinfo';
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
