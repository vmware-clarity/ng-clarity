/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

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

/** `<input>` types that deliberately have no role: they expose no useful semantics. */
const ROLELESS_INPUT_TYPES = new Set(['hidden', 'color', 'image-map']);

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
 * Leaf roles that describe a unit of content rather than a single interactive widget.
 * A heading's, an alert's or a status's accessible name subsumes all descendant text —
 * that is correct, unlike-role computation — but ordinary markup routinely nests a
 * genuinely separate, independently focusable control inside one anyway: a heading with
 * a button, an alert with a dismiss action, a status with an undo action. That control
 * keeps its own role and state regardless of its container's, so the walk must still
 * find it. A widget leaf (`button`, `link`, `checkbox`, ...) has no such exception:
 * nothing inside it has independent semantics, so it stays fully terminal.
 */
const CONTENT_LEAF_ROLES = new Set(['heading', 'status', 'alert', 'term', 'caption', 'definition', 'tooltip']);

/** The two spellings of "this element carries no semantics of its own". */
const PRESENTATIONAL_ROLES = new Set(['presentation', 'none']);

/**
 * The ARIA role an element carries, explicit or implicit, or `null` when it has none.
 *
 * An explicit `role` always wins. Because `role` accepts a fallback list, only the first
 * token is honored — the same way assistive technology resolves it.
 */
export function resolveRole(element: Element): string | null {
  const explicit = element.getAttribute('role')?.trim().split(/\s+/)[0];
  if (explicit) {
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

function implicitRole(element: Element): string | null {
  const tagName = element.tagName.toLowerCase();

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
      return tagName === 'aside' || hasNameAttribute(element) ? IMPLICIT_ROLES_BY_TAG[tagName] : null;
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
      return IMPLICIT_ROLES_BY_TAG[tagName] ?? null;
  }
}

function inputRole(input: HTMLInputElement): string | null {
  const type = (input.getAttribute('type') || 'text').toLowerCase();
  if (ROLELESS_INPUT_TYPES.has(type)) {
    return null;
  }
  // Date and time inputs have no agreed ARIA role; treat anything unlisted as a textbox,
  // which is how they behave for a user typing into them.
  return INPUT_ROLES_BY_TYPE[type] ?? 'textbox';
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
