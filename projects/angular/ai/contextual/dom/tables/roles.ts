/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/** Implicit ARIA role per HTML element, per HTML-AAM. Attribute-dependent ones are in `resolveRole`. */
export const IMPLICIT_ROLES_BY_TAG: Readonly<Record<string, string>> = {
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
export const INPUT_ROLES_BY_TYPE: Readonly<Record<string, string>> = {
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

export const SUGGESTING_INPUT_TYPES: ReadonlySet<string> = new Set(['text', 'search', 'url', 'tel', 'email']);

export const ROLELESS_INPUT_TYPES: ReadonlySet<string> = new Set(['hidden', 'color']);

/** `<th scope>` values that make it a row header rather than a column header. */
export const ROW_HEADER_SCOPES: readonly string[] = ['row', 'rowgroup'];

/** Roles named from their own text (ARIA "name from contents"); a superset of {@link LEAF_ROLES}. */
export const NAME_FROM_CONTENTS: ReadonlySet<string> = new Set([
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
export const LEAF_ROLES: ReadonlySet<string> = new Set([
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
export const CONTENT_LEAF_ROLES: ReadonlySet<string> = new Set([
  'heading',
  'status',
  'alert',
  'term',
  'caption',
  'definition',
  'tooltip',
  'treeitem',
]);

/** An editing host with any other role would have what the user typed read as prose. */
export const TEXT_ENTRY_ROLES: ReadonlySet<string> = new Set(['textbox', 'searchbox', 'combobox']);

export const PRESENTATIONAL_ROLES: ReadonlySet<string> = new Set(['presentation', 'none']);

/** Roles holding a value the user sets; also the `forms` category, with `form`. */
export const WRITABLE_ROLES: ReadonlySet<string> = new Set([
  'textbox',
  'searchbox',
  'combobox',
  'listbox',
  'checkbox',
  'radio',
  'radiogroup',
  'switch',
  'slider',
  'spinbutton',
]);

/** Named by their message, not their actions: "Saved", not "Saved Undo". */
export const MESSAGE_ROLES: ReadonlySet<string> = new Set(['alert', 'status']);

/** Roles whose label is their content; in a redacted region it is withheld, unlike a control's label. */
export const CONTENT_ROLES: ReadonlySet<string> = new Set([
  'text',
  'heading',
  'cell',
  'gridcell',
  'row',
  'rowheader',
  'columnheader',
  'listitem',
  'caption',
  'note',
  'tooltip',
  'term',
  'definition',
  'paragraph',
  'blockquote',
  'status',
  'alert',
  'log',
  'marquee',
  'option',
]);
