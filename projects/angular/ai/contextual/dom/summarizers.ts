/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  CLR_CONTEXT_HIDDEN_SELECTOR,
  CLR_CONTEXT_REDACT_SELECTOR,
  ClrContextSnapshotOptions,
} from '@clr/angular/utils';

import { accessibleName } from './accessible-name';
import { ariaEnumValue } from './aria-state';
import { resolveRole } from './roles';
import { isVisible } from './visibility';

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
export type RoleSummarizer = (element: Element, scope: SummaryScope) => Record<string, unknown>;

/** What a summary is taken with: the snapshot's options, and what it may not read. */
interface SummaryScope {
  readonly options: Required<ClrContextSnapshotOptions>;
  /** Selector for elements the snapshot leaves out (its `excludeSelectors`), or `''`. */
  readonly withheld: string;
}

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
 *
 * `withheld` selects elements the snapshot leaves out: they are not items, and their
 * text is not read into any item's name.
 */
export function summarizeRole(
  element: Element,
  role: string | null,
  options: Required<ClrContextSnapshotOptions>,
  withheld = ''
): Record<string, unknown> | null {
  const summarizer = role ? ROLE_SUMMARIZERS[role] : undefined;
  if (!summarizer) {
    return null;
  }
  const state = summarizer(element, { options, withheld });
  return Object.keys(state).length ? state : null;
}

function summarizeGrid(element: Element, scope: SummaryScope): Record<string, unknown> {
  const state: Record<string, unknown> = {};

  // A header cell in a row that also holds data names that row, not a column.
  const headers = queryRole(element, 'columnheader', scope).filter(
    header => !header.closest('tr, [role="row"]')?.querySelector(DATA_CELL_SELECTOR)
  );
  const columns = namesOf(headers, element, scope);
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
  state.rowCount = Number.isFinite(total) && total >= 0 ? total : dataRows(element, scope).length;

  // Only rows, and only this table's: a selected tab or option inside a cell is not a row.
  const selected = queryRole(element, 'row', scope).filter(row => row.getAttribute('aria-selected') === 'true').length;
  if (selected) {
    state.selectedRows = selected;
  }

  const sorted = headers.find(header => ariaEnumValue(header, 'aria-sort') !== null);
  const sortedBy = sorted ? nameOf(sorted, element, scope) : null;
  if (sorted && sortedBy !== null) {
    state.sort = { column: sortedBy, direction: ariaEnumValue(sorted, 'aria-sort') };
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

function summarizeTablist(element: Element, scope: SummaryScope): Record<string, unknown> {
  const tabs = queryRole(element, 'tab', scope);
  if (!tabs.length) {
    return {};
  }
  const state: Record<string, unknown> = { tabCount: tabs.length };
  if (listsItems(scope.options)) {
    state.tabs = namesOf(tabs, element, scope);
  }
  // Looked for among all the tabs, not the reported few: the active one being past the
  // budget must not read as "nothing is selected".
  const active = tabs.find(tab => tab.getAttribute('aria-selected') === 'true');
  const activeName = active ? nameOf(active, element, scope) : null;
  if (activeName !== null) {
    state.activeTab = activeName;
  }
  return state;
}

/**
 * A list is summarised by its items' text but, unlike the other collections, is still
 * walked afterwards (see the walk): a navigation list's links are the point of it, and
 * the summary alone would lose where they go.
 */
function summarizeList(element: Element, scope: SummaryScope): Record<string, unknown> {
  // Only this list's own items: a nested list is summarised when the walk reaches it,
  // and counting its items here would both inflate the count and name them twice.
  const items = queryRole(element, 'listitem', scope);
  if (!items.length) {
    return {};
  }
  const state: Record<string, unknown> = { itemCount: items.length };
  if (listsItems(scope.options)) {
    state.items = namesOf(items, element, scope);
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
function summarizeCombobox(element: Element, scope: SummaryScope): Record<string, unknown> {
  const choices = comboboxChoices(element, scope);
  if (!choices.length) {
    return {};
  }
  if (!listsItems(scope.options)) {
    return { optionCount: choices.length };
  }
  return { options: namesOf(choices, element, scope) };
}

function comboboxChoices(element: Element, scope: SummaryScope): Element[] {
  const own = queryRole(element, 'option', scope);
  if (own.length) {
    return own;
  }

  const document = element.ownerDocument;

  const listId = element.getAttribute('list');
  if (listId) {
    const datalist = document.getElementById(listId);
    if (datalist) {
      // A datalist is never rendered, so only what keeps the list itself from the engine
      // counts, not whether it shows.
      return Array.from(datalist.querySelectorAll('option')).filter(option => readable(option, scope));
    }
  }

  const ownedIds = `${element.getAttribute('aria-owns') ?? ''} ${element.getAttribute('aria-controls') ?? ''}`.trim();
  for (const id of ownedIds.split(/\s+/).filter(Boolean)) {
    const owned = document.getElementById(id);
    const listed = owned ? queryRole(owned, 'option', scope) : [];
    if (listed.length) {
      return listed;
    }
  }

  return [];
}

function summarizeOptions(element: Element, scope: SummaryScope): Record<string, unknown> {
  return summarizeChoices(element, queryRole(element, 'option', scope), isSelectedOption, scope);
}

/**
 * A menu's commands. Menu items are not options — a different role, deliberately, in
 * ARIA — so they need looking for by name; a menu summarised through the option
 * selector would report nothing and hide every command it offers.
 */
function summarizeMenu(element: Element, scope: SummaryScope): Record<string, unknown> {
  return summarizeChoices(
    element,
    queryRole(element, 'menuitem', scope),
    item => item.getAttribute('aria-checked') === 'true',
    scope
  );
}

function summarizeChoices(
  collection: Element,
  entries: Element[],
  isSelected: (entry: Element) => boolean,
  scope: SummaryScope
): Record<string, unknown> {
  if (!entries.length) {
    return {};
  }
  const state: Record<string, unknown> = { optionCount: entries.length };
  if (listsItems(scope.options)) {
    state.options = namesOf(entries, collection, scope);
  }
  const selected = namesOf(entries.filter(isSelected), collection, scope);
  if (selected.length) {
    state.selected = selected;
  }
  // A choice that cannot currently be taken is still listed, since it tells an agent
  // what the UI can do, but proposing it would fail.
  const disabled = namesOf(
    entries.filter(entry => entry.getAttribute('aria-disabled') === 'true' || (entry as HTMLOptionElement).disabled),
    collection,
    scope
  );
  if (disabled.length && listsItems(scope.options)) {
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

function summarizeRadiogroup(element: Element, scope: SummaryScope): Record<string, unknown> {
  const radios = queryRole(element, 'radio', scope);
  if (!radios.length) {
    return {};
  }
  const state: Record<string, unknown> = { optionCount: radios.length };
  if (listsItems(scope.options)) {
    state.options = namesOf(radios, element, scope);
  }
  const chosen = radios.find(
    radio => (radio as HTMLInputElement).checked || radio.getAttribute('aria-checked') === 'true'
  );
  const value = chosen ? nameOf(chosen, element, scope) : null;
  if (value !== null) {
    state.value = value;
  }
  return state;
}

/**
 * The rows carrying data. A row made of column headers names the columns rather than
 * holding a record, and counting it would misreport the size of the data. A row header
 * (`<th scope="row">`) names its own row and does not make it a header row.
 */
function dataRows(element: Element, scope: SummaryScope): Element[] {
  // A row of column headers names the columns; a row that also holds data cells is a
  // record whose first cell happens to be a header (`<th>` without `scope="row"`).
  return queryRole(element, 'row', scope).filter(
    row => !row.querySelector(ROLE_SELECTORS.columnheader) || row.querySelector(DATA_CELL_SELECTOR)
  );
}

const DATA_CELL_SELECTOR = 'td, [role="cell"], [role="gridcell"]';

/**
 * The collection an item of each role belongs to, so that a nested collection's items
 * are left to that collection: a sub-list's entries, the rows of a table inside an
 * expanded row, the options of a listbox inside a menu.
 */
const CONTAINER_SELECTORS: Record<string, string> = {
  columnheader: 'table, [role="table"], [role="grid"], [role="treegrid"]',
  row: 'table, [role="table"], [role="grid"], [role="treegrid"]',
  tab: '[role="tablist"]',
  listitem: 'ul, ol, menu, [role="list"]',
  option: 'select, datalist, [role="listbox"], [role="combobox"]',
  menuitem: '[role="menu"], [role="menubar"]',
  radio: '[role="radiogroup"]',
};

/**
 * The elements of a role inside `element` that belong to it: not hidden, not in an
 * ignored or excluded region, and not part of a collection nested inside this one.
 */
function queryRole(element: Element, role: string, scope: SummaryScope): Element[] {
  const container = CONTAINER_SELECTORS[role];
  const judgesStyle = STYLE_JUDGED_ROLES.has(role);
  return Array.from(element.querySelectorAll(ROLE_SELECTORS[role])).filter(
    item =>
      readable(item, scope) &&
      (!container || item.parentElement?.closest(container) === element) &&
      (!judgesStyle || isVisible(item))
  );
}

/**
 * Roles whose items are left out when a style hides them — a datagrid column hidden with
 * `display: none`, a tab or list item a stylesheet removed — as well as when an attribute
 * does. Not rows, which are counted, and where a style check per row would be a layout
 * read per record; nor options and radios, which are never rendered in a closed dropdown
 * or are drawn over by a custom control, and are what the collection offers all the same.
 */
const STYLE_JUDGED_ROLES = new Set(['columnheader', 'tab', 'listitem', 'menuitem']);

/** Items the user cannot see, or the snapshot leaves out, are not part of what a collection offers. */
function readable(item: Element, scope: SummaryScope): boolean {
  return !item.closest(CLR_CONTEXT_HIDDEN_SELECTOR) && !(scope.withheld && item.closest(scope.withheld));
}

/**
 * An item's name, or `null` when the item sits in a region the application marked
 * `data-clr-context-redact` inside the collection — a list with one sensitive entry, a
 * tab named after an account. Such an item still counts, as a redacted field is still
 * described, but what it says is withheld. A region around the whole collection is not
 * decided here: the walk redacts the collection's node, contents and all, while its
 * column names — which name fields rather than show values — stay.
 */
function nameOf(item: Element, collection: Element, scope: SummaryScope): string | null {
  const redacting = item.closest(CLR_CONTEXT_REDACT_SELECTOR);
  if (redacting && !redacting.contains(collection)) {
    return null;
  }
  return accessibleName(item, resolveRole(item), scope.options.maxTextLength, scope.withheld);
}

/** The names of the first items the budget allows, leaving out those withheld. */
function namesOf(items: Element[], collection: Element, scope: SummaryScope): string[] {
  return items
    .slice(0, scope.options.maxItemsPerCollection)
    .map(item => nameOf(item, collection, scope))
    .filter((name): name is string => name !== null);
}
