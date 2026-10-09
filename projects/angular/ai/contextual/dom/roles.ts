/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isContentEditable } from './aria-state';
import { ownEntry } from '../lookup';

/**
 * Mapping from HTML element to the ARIA role it carries implicitly, following HTML-AAM.
 *
 * This is the collector's one lookup table, and it is defined by the HTML and ARIA
 * specifications rather than by any component library — which is what lets one
 * implementation describe Clarity Angular components, `@clr/ui` CSS-only markup, other
 * component libraries and plain semantic HTML alike.
 *
 * Elements whose role depends on their attributes (`input`, `select`, `section`, `a`,
 * `img`) are resolved in {@link resolveRole} rather than listed here.
 */
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
 * Roles an `<input>` carries, by its `type`. Types absent here have no ARIA role.
 *
 * Two entries go beyond HTML-AAM, which gives password and file inputs no role at all. A
 * field with no role and no label would vanish from a snapshot, and an agent asked to
 * fill a login form must at least learn that a password field exists — its value is
 * withheld regardless (see `isRedacted`). A password field behaves as a textbox for the
 * user typing into it; a file input is exposed by browsers as the button that opens the
 * picker.
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

/** `<input>` types that are a combobox when they have a `list` of suggestions. */
const SUGGESTING_INPUT_TYPES = new Set(['text', 'search', 'url', 'tel', 'email']);

/** `<input>` types that deliberately have no role: they expose no useful semantics. */
const ROLELESS_INPUT_TYPES = new Set(['hidden', 'color']);

/**
 * Sectioning ancestors that turn a `<header>` or `<footer>` into a plain container: only
 * a page-level one is the banner or contentinfo landmark, per HTML-AAM.
 */
const SECTIONING_SELECTOR = 'article, aside, main, nav, section';

/**
 * Roles that may take their accessible name from their own text, per ARIA's
 * "name from author and contents".
 *
 * A superset of {@link LEAF_ROLES}: a table cell or a list item names itself from its
 * text without being a single control, and a grid that is not summarised still needs its
 * rows walked. Keeping the two questions apart is what stops a container from absorbing
 * the whole page as its label while still letting a cell report what it says.
 */
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

/**
 * Roles describing a single control or a self-contained message, where descending would
 * only repeat what the label already says.
 */
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

/**
 * Leaf roles that describe a unit of content rather than a single widget. Their name
 * already carries the text inside them, but markup routinely nests a separate control in
 * one — a heading with a button, an alert with a dismiss action, a tree item with its
 * link — and the walk must still find it. Nothing inside a widget leaf, such as a button
 * or a checkbox, has semantics of its own.
 */
const CONTENT_LEAF_ROLES = new Set([
  'heading',
  'status',
  'alert',
  'term',
  'caption',
  'definition',
  'tooltip',
  // A tree item names itself from its text, but holds the link it navigates by and the
  // items nested under it.
  'treeitem',
]);

/** Longer than the longest ARIA role, `menuitemcheckbox`, with room for DPUB and graphics roles. */
const MAX_ROLE_LENGTH = 32;

/**
 * Roles an editing host may keep: those of a field the user types into. Any other role on
 * one — `document`, `heading`, `presentation` — would have what the user typed read as
 * prose or as a name.
 */
const TEXT_ENTRY_ROLES = new Set(['textbox', 'searchbox', 'combobox']);

/** The two spellings of "this element carries no semantics of its own". */
const PRESENTATIONAL_ROLES = new Set(['presentation', 'none']);

/**
 * The ARIA role an element carries, explicit or implicit, or `null` when it has none.
 *
 * An explicit `role` wins, except on an editing host, which is a text field whatever else
 * it says it is. Because `role` accepts a fallback list, only the first token is honored —
 * the same way assistive technology resolves it.
 */
export function resolveRole(element: Element): string | null {
  // A token longer than any ARIA role is not one, and page markup must not be able to
  // inflate a snapshot through it: the element falls back to its implicit role.
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

/** Whether a role describes a single control or message the walk should not descend into. */
export function isLeafRole(role: string): boolean {
  return LEAF_ROLES.has(role);
}

/** Whether a role may take its accessible name from its own text content. */
export function isNameFromContents(role: string): boolean {
  return NAME_FROM_CONTENTS.has(role);
}

/** Whether a leaf role may still contain a genuinely separate, independent control. */
export function mayContainControls(role: string): boolean {
  return CONTENT_LEAF_ROLES.has(role);
}

/** Whether a role means "ignore this element but keep looking at its children". */
export function isPresentationalRole(role: string): boolean {
  return PRESENTATIONAL_ROLES.has(role);
}

/**
 * A selector matching every element that may resolve to one of `roles` — any explicit
 * role, and the elements whose implicit role could be one of them — or `''` for no roles.
 * Checking {@link resolveRole} on what it matches, rather than on every element, is what
 * keeps a search for a role proportional to the elements that could have it.
 */
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
    // A text field with a list of suggestions.
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

  // An editing host is a text field whatever element it is drawn on: what a rich-text
  // editor holds was typed by the user, and must be treated as a value, never as prose.
  if (isContentEditable(element)) {
    return 'textbox';
  }

  switch (tagName) {
    case 'input':
      return inputRole(element as HTMLInputElement);
    case 'select':
      // A dropdown presents one value at a time; an expanded or multiple select is a list.
      return (element as HTMLSelectElement).multiple || (element as HTMLSelectElement).size > 1
        ? 'listbox'
        : 'combobox';
    case 'a':
    case 'area':
      // Only a navigable anchor is a link; without href it is a placeholder.
      return element.hasAttribute('href') ? 'link' : null;
    case 'img':
      // `alt=""` is the author declaring the image decorative.
      return element.getAttribute('alt') === '' ? 'presentation' : 'img';
    case 'section':
    case 'aside':
      // A generic landmark only earns its role once it is named, otherwise every
      // wrapper section would surface as an indistinguishable region.
      return tagName === 'aside' || hasNameAttribute(element)
        ? (ownEntry(IMPLICIT_ROLES_BY_TAG, tagName) ?? null)
        : null;
    case 'th': {
      // A header cell at the start of a row names that row, not a column.
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
  // A text field offering suggestions from a `<datalist>` is a combobox (HTML-AAM), and
  // is summarised with the options it offers.
  if (input.hasAttribute('list') && SUGGESTING_INPUT_TYPES.has(type)) {
    return 'combobox';
  }
  // Date and time inputs have no agreed ARIA role; treat anything unlisted as a textbox,
  // which is how they behave for a user typing into them.
  return ownEntry(INPUT_ROLES_BY_TYPE, type) ?? 'textbox';
}

/**
 * Whether an element carries a name directly. Deliberately narrower than full accessible
 * name computation, which depends on role resolution and would make this circular.
 */
function hasNameAttribute(element: Element): boolean {
  return (
    !!element.getAttribute('aria-label')?.trim() ||
    !!element.getAttribute('aria-labelledby')?.trim() ||
    !!element.getAttribute('title')?.trim()
  );
}
