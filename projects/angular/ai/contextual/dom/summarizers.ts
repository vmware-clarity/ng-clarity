/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrContextSnapshotOptions } from '@clr/angular/utils';

import { accessibleName } from './accessible-name';
import { resolveRole } from './roles';

/**
 * Produces a compact description of a whole subtree, keyed on ARIA role.
 *
 * Summarizers exist for roles whose children are a homogeneous collection: describing a
 * grid row by row would bury the useful facts and blow any budget, while "these columns,
 * this many rows, two selected, sorted by name" is what an agent actually needs. A role
 * whose summary says something is not descended into — except a list, whose links are
 * still reported (see the walk).
 *
 * Roles absent here are described by walking them, which is the right default: a dialog
 * or a form contains arbitrary content whose structure matters.
 */
export type RoleSummarizer = (
  element: Element,
  options: Required<ClrContextSnapshotOptions>
) => Record<string, unknown>;

/** Selectors matching a role explicitly or through the element's implicit role. */
const ROLE_SELECTORS: Record<string, string> = {
  columnheader: '[role="columnheader"], th:not([role]):not([scope="row"]):not([scope="rowgroup"])',
  row: '[role="row"], tr:not([role])',
  tab: '[role="tab"]',
  listitem: '[role="listitem"], li:not([role])',
  option: '[role="option"], option:not([role])',
  menuitem: '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]',
  radio: '[role="radio"], input[type="radio"]:not([role])',
};

const ROLE_SUMMARIZERS: Record<string, RoleSummarizer> = {
  combobox: summarizeCombobox,
  grid: summarizeGrid,
  table: summarizeGrid,
  treegrid: summarizeGrid,
  tablist: summarizeTablist,
  list: summarizeList,
  listbox: summarizeOptions,
  menu: summarizeMenu,
  radiogroup: summarizeRadiogroup,
};

/**
 * The summary for this element's role, or `null` when there is nothing to summarise —
 * either because the role has no summarizer or because the summarizer found none of the
 * items it understands. In both cases the element should be walked instead: a `<div
 * role="list">` whose items are custom elements rather than list items still has
 * content, and a summary that says nothing must not make it disappear.
 */
export function summarizeRole(
  element: Element,
  role: string | null,
  options: Required<ClrContextSnapshotOptions>
): Record<string, unknown> | null {
  const summarizer = role ? ROLE_SUMMARIZERS[role] : undefined;
  if (!summarizer) {
    return null;
  }
  const state = summarizer(element, options);
  return Object.keys(state).length ? state : null;
}

function summarizeGrid(element: Element, options: Required<ClrContextSnapshotOptions>): Record<string, unknown> {
  const state: Record<string, unknown> = {};

  const columns = queryRole(element, 'columnheader')
    .slice(0, options.maxItemsPerCollection)
    .map(header => nameOf(header, options));
  if (columns.length) {
    state.columns = columns;
  }

  // A paginated or virtualised grid holds only the current page, so its own declared
  // count is the only honest total. `aria-rowcount="-1"` means "unknown", and an absent
  // attribute must not be read as zero, so both fall back to counting what is rendered.
  // The declared count is reported as declared: ARIA says it includes header rows, but
  // the producers that actually set it (Clarity's virtual scroll among them) declare the
  // data rows, which is also what the fallback counts.
  const declared = element.getAttribute('aria-rowcount');
  const total = declared === null ? Number.NaN : Number(declared);
  state.rowCount = Number.isFinite(total) && total >= 0 ? total : dataRows(element).length;

  const selected = element.querySelectorAll('[aria-selected="true"]').length;
  if (selected) {
    state.selectedRows = selected;
  }

  const sorted = element.querySelector('[aria-sort]:not([aria-sort="none"])');
  if (sorted) {
    state.sort = { column: nameOf(sorted, options), direction: sorted.getAttribute('aria-sort') };
  }

  return state;
}

/**
 * Whether item lists are wanted at all. In summary mode a collection reports what it is
 * and what is selected — counts, the active tab, the chosen value — and nothing more.
 */
function listsItems(options: Required<ClrContextSnapshotOptions>): boolean {
  return options.collectionItems !== 'summary';
}

function summarizeTablist(element: Element, options: Required<ClrContextSnapshotOptions>): Record<string, unknown> {
  const tabs = queryRole(element, 'tab');
  if (!tabs.length) {
    return {};
  }
  const state: Record<string, unknown> = { tabCount: tabs.length };
  if (listsItems(options)) {
    state.tabs = tabs.slice(0, options.maxItemsPerCollection).map(tab => nameOf(tab, options));
  }
  // Looked for among all the tabs, not the reported few: the active one being past the
  // budget must not read as "nothing is selected".
  const active = tabs.find(tab => tab.getAttribute('aria-selected') === 'true');
  if (active) {
    state.activeTab = nameOf(active, options);
  }
  return state;
}

/**
 * A list is summarised by its items' text but, unlike the other collections, is still
 * walked afterwards (see the walk): a navigation list's links are the point of it, and
 * the summary alone would lose where they go.
 */
function summarizeList(element: Element, options: Required<ClrContextSnapshotOptions>): Record<string, unknown> {
  const items = queryRole(element, 'listitem');
  if (!items.length) {
    return {};
  }
  const state: Record<string, unknown> = { itemCount: items.length };
  if (listsItems(options)) {
    state.items = items.slice(0, options.maxItemsPerCollection).map(item => nameOf(item, options));
  }
  return state;
}

/**
 * A collapsed dropdown's choices, which are the whole point of it and are not otherwise
 * reachable: `combobox` is a leaf role, so nothing descends into a `<select>`'s options.
 *
 * The choices are authored markup describing what the UI permits, not anything a user
 * typed — the same reasoning that reports `min`, `max` and `pattern`. An agent needs
 * them to propose a legal value at all.
 *
 * Three shapes are covered: a native `<select>`, a combobox that owns a separate listbox
 * through `aria-owns`/`aria-controls`, and an input backed by a `<datalist>`.
 */
function summarizeCombobox(element: Element, options: Required<ClrContextSnapshotOptions>): Record<string, unknown> {
  const choices = comboboxChoices(element);
  if (!choices.length) {
    return {};
  }
  if (!listsItems(options)) {
    return { optionCount: choices.length };
  }
  return { options: choices.slice(0, options.maxItemsPerCollection).map(choice => nameOf(choice, options)) };
}

function comboboxChoices(element: Element): Element[] {
  const own = queryRole(element, 'option');
  if (own.length) {
    return own;
  }

  const document = element.ownerDocument;

  const listId = element.getAttribute('list');
  if (listId) {
    const datalist = document.getElementById(listId);
    if (datalist) {
      return Array.from(datalist.querySelectorAll('option'));
    }
  }

  const ownedIds = `${element.getAttribute('aria-owns') ?? ''} ${element.getAttribute('aria-controls') ?? ''}`.trim();
  for (const id of ownedIds.split(/\s+/).filter(Boolean)) {
    const owned = document.getElementById(id);
    const listed = owned ? queryRole(owned, 'option') : [];
    if (listed.length) {
      return listed;
    }
  }

  return [];
}

function summarizeOptions(element: Element, options: Required<ClrContextSnapshotOptions>): Record<string, unknown> {
  return summarizeChoices(queryRole(element, 'option'), isSelectedOption, options);
}

/**
 * A menu's commands. Menu items are not options — a different role, deliberately, in
 * ARIA — so they need looking for by name; a menu summarised through the option
 * selector would report nothing and hide every command it offers.
 */
function summarizeMenu(element: Element, options: Required<ClrContextSnapshotOptions>): Record<string, unknown> {
  return summarizeChoices(
    queryRole(element, 'menuitem'),
    item => item.getAttribute('aria-checked') === 'true',
    options
  );
}

function summarizeChoices(
  entries: Element[],
  isSelected: (entry: Element) => boolean,
  options: Required<ClrContextSnapshotOptions>
): Record<string, unknown> {
  if (!entries.length) {
    return {};
  }
  const state: Record<string, unknown> = { optionCount: entries.length };
  if (listsItems(options)) {
    state.options = entries.slice(0, options.maxItemsPerCollection).map(entry => nameOf(entry, options));
  }
  const selected = entries
    .filter(isSelected)
    .slice(0, options.maxItemsPerCollection)
    .map(entry => nameOf(entry, options));
  if (selected.length) {
    state.selected = selected;
  }
  // A choice that cannot currently be taken is still listed, since it tells an agent
  // what the UI can do, but proposing it would fail.
  const disabled = entries
    .filter(entry => entry.getAttribute('aria-disabled') === 'true' || (entry as HTMLOptionElement).disabled === true)
    .slice(0, options.maxItemsPerCollection)
    .map(entry => nameOf(entry, options));
  if (disabled.length && listsItems(options)) {
    state.disabledOptions = disabled;
  }
  return state;
}

/**
 * Whether an option is selected. A native `<option>` carries its selection as a
 * property the browser maintains; the browser never sets `aria-selected` on it.
 */
function isSelectedOption(entry: Element): boolean {
  if (entry.tagName.toLowerCase() === 'option') {
    return (entry as HTMLOptionElement).selected;
  }
  return entry.getAttribute('aria-selected') === 'true';
}

function summarizeRadiogroup(element: Element, options: Required<ClrContextSnapshotOptions>): Record<string, unknown> {
  const radios = queryRole(element, 'radio');
  if (!radios.length) {
    return {};
  }
  const state: Record<string, unknown> = { optionCount: radios.length };
  if (listsItems(options)) {
    state.options = radios.slice(0, options.maxItemsPerCollection).map(radio => nameOf(radio, options));
  }
  const chosen = radios.find(
    radio => (radio as HTMLInputElement).checked || radio.getAttribute('aria-checked') === 'true'
  );
  if (chosen) {
    state.value = nameOf(chosen, options);
  }
  return state;
}

/**
 * The rows carrying data. A row made of column headers names the columns rather than
 * holding a record, and counting it would misreport the size of the data. A row header
 * (`<th scope="row">`) names its own row and does not make it a header row.
 */
function dataRows(element: Element): Element[] {
  return queryRole(element, 'row').filter(row => !row.querySelector(ROLE_SELECTORS.columnheader));
}

function queryRole(element: Element, role: string): Element[] {
  return Array.from(element.querySelectorAll(ROLE_SELECTORS[role]));
}

function nameOf(element: Element, options: Required<ClrContextSnapshotOptions>): string {
  return accessibleName(element, resolveRole(element), options.maxTextLength);
}
