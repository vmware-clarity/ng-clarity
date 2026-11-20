/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  CLR_CONTEXT_EDITING_HOST_SELECTOR,
  CLR_CONTEXT_IGNORE_SELECTOR,
  CLR_CONTEXT_REDACT_SELECTOR,
} from '@clr/angular/utils';

import { IMPLICIT_ROLES_BY_TAG, INPUT_ROLES_BY_TYPE, ROW_HEADER_SCOPES, WRITABLE_ROLES } from './roles';

function withRole(...roles: string[]): string[] {
  return roles.map(role => `[role="${role}"]`);
}

/** Elements with any of `roles`: explicit, or native ones with that implicit role and no `role` attribute. */
function roleSelector(...roles: string[]): string {
  const natives = [
    ...Object.keys(IMPLICIT_ROLES_BY_TAG).filter(tag => roles.includes(IMPLICIT_ROLES_BY_TAG[tag])),
    ...Object.keys(INPUT_ROLES_BY_TYPE)
      .filter(type => roles.includes(INPUT_ROLES_BY_TYPE[type]))
      .map(type => `input[type="${type}"]`),
  ];
  return [...withRole(...roles), ...natives.map(native => `${native}:not([role])`)].join(', ');
}

/** What a user acts on; its text is not part of the surrounding name. */
export const ACTION_SELECTOR = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  '[contenteditable]',
  ...withRole(
    'button',
    'link',
    'checkbox',
    'radio',
    'switch',
    'textbox',
    'searchbox',
    'combobox',
    'listbox',
    'menu',
    'menuitem',
    'tab',
    'slider',
    'spinbutton'
  ),
].join(', ');

/** An action, or anything else focusable or interactive; a described-by target holding one is real content. */
export const CONTROL_SELECTOR = [
  ACTION_SELECTOR,
  '[tabindex]',
  ...withRole('option', 'treeitem', 'grid', 'table', 'dialog', 'alertdialog'),
].join(', ');

/** A control holding a value the user sets. */
export const VALUE_CONTROL_SELECTOR = [
  'input',
  'select',
  'textarea',
  '[contenteditable]',
  ...withRole(...WRITABLE_ROLES),
].join(', ');

/** Anything the walk would describe as a node of its own. */
export const DESCRIBABLE_SELECTOR = `[role], ${CONTROL_SELECTOR}, img, svg, iframe, frame, [aria-label], [aria-labelledby]`;

export const CELL_SELECTOR = 'td, [role="cell"], [role="gridcell"]';

/** Only a dialog that says it is modal; a non-modal dialog or side panel leaves the page in use. */
export const MODAL_SELECTOR =
  '[role="dialog"][aria-modal="true"], [role="alertdialog"][aria-modal="true"], dialog:modal';

/** Fallback for browsers without `:modal`: any open `<dialog>` counts as modal. */
export const LEGACY_MODAL_SELECTOR =
  '[role="dialog"][aria-modal="true"], [role="alertdialog"][aria-modal="true"], dialog[open]';

/** Only a page-level `<header>`/`<footer>` is a landmark, per HTML-AAM. */
export const SECTIONING_SELECTOR = 'article, aside, main, nav, section';

/** Never read into names: regions kept from agents, and editing hosts, whose text is a value. */
export const UNREADABLE_SELECTOR = `${CLR_CONTEXT_IGNORE_SELECTOR}, ${CLR_CONTEXT_REDACT_SELECTOR}, ${CLR_CONTEXT_EDITING_HOST_SELECTOR}`;

const COLUMN_HEADER_CELL = `th:not([role])${ROW_HEADER_SCOPES.map(scope => `:not([scope="${scope}"])`).join('')}`;

/** The items a collection summary counts, per item role. */
export const ITEM_SELECTORS: Readonly<Record<string, string>> = {
  columnheader: `${roleSelector('columnheader')}, ${COLUMN_HEADER_CELL}`,
  row: roleSelector('row'),
  tab: roleSelector('tab'),
  listitem: roleSelector('listitem'),
  option: roleSelector('option'),
  menuitem: roleSelector('menuitem', 'menuitemcheckbox', 'menuitemradio'),
  radio: roleSelector('radio'),
};

const TABLE_CONTAINER = 'table, [role="table"], [role="grid"], [role="treegrid"]';

/** The collection an item belongs to, per item role, so a nested collection's items are left to it. */
export const ITEM_CONTAINER_SELECTORS: Readonly<Record<string, string>> = {
  columnheader: TABLE_CONTAINER,
  row: TABLE_CONTAINER,
  tab: '[role="tablist"]',
  listitem: 'ul, ol, menu, [role="list"]',
  option: 'select, datalist, [role="listbox"], [role="combobox"]',
  menuitem: '[role="menu"], [role="menubar"]',
  radio: '[role="radiogroup"]',
};
