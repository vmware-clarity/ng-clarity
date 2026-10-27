/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { getAriaReferenceIds } from '@angular/cdk/a11y';
import { ClrContextSnapshotOptions } from '@clr/angular/utils';

import { accessibleName } from './accessible-name';
import { ariaEnumValue } from './aria-state';
import { resolveRole } from './roles';
import { closestAcrossShadow, idScope, parentAcrossShadow, queryRendered } from './shadow';
import { CELL_SELECTOR, ITEM_CONTAINER_SELECTORS, ITEM_SELECTORS } from './tables/selectors';
import { isHiddenFromContext, isRedactedWithin, isVisible } from './visibility';
import { ownEntry } from '../lookup';

/** Describes a homogeneous collection by its ARIA role, so a grid is not walked row by row. */
export type RoleSummarizer = (element: Element, scope: SummaryScope) => Record<string, unknown>;

interface SummaryScope {
  readonly options: Required<ClrContextSnapshotOptions>;
  readonly withheld: string;
}

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

/** The summary for this element's role, or `null` when there is none and the element should be walked. */
export function summarizeRole(
  element: Element,
  role: string | null,
  options: Required<ClrContextSnapshotOptions>,
  withheld = ''
): Record<string, unknown> | null {
  const summarizer = role ? ownEntry(ROLE_SUMMARIZERS, role) : undefined;
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
    header => !header.closest('tr, [role="row"]')?.querySelector(CELL_SELECTOR)
  );
  const columns = namesOf(headers, element, scope);
  if (columns.length) {
    state.columns = columns;
  }

  // A paginated grid holds one page, so its declared count is the honest total;
  // `aria-rowcount="-1"` or no attribute falls back to counting rendered rows.
  const rows = queryRole(element, 'row', scope);
  const declared = element.getAttribute('aria-rowcount');
  const total = declared === null ? Number.NaN : Number(declared);
  state.rowCount = Number.isFinite(total) && total >= 0 ? total : dataRows(rows).length;

  const selected = rows.filter(row => row.getAttribute('aria-selected') === 'true').length;
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

function listsItems(options: Required<ClrContextSnapshotOptions>): boolean {
  return options.collectionItems !== 'summary';
}

function counted(
  entries: Element[],
  countKey: string,
  listKey: string,
  collection: Element,
  scope: SummaryScope
): Record<string, unknown> {
  const state: Record<string, unknown> = { [countKey]: entries.length };
  if (listsItems(scope.options)) {
    state[listKey] = namesOf(entries, collection, scope);
  }
  return state;
}

function summarizeTablist(element: Element, scope: SummaryScope): Record<string, unknown> {
  const tabs = queryRole(element, 'tab', scope);
  if (!tabs.length) {
    return {};
  }
  const state = counted(tabs, 'tabCount', 'tabs', element, scope);
  // The active tab may be past the budget, so it is looked for among all tabs.
  const active = tabs.find(tab => tab.getAttribute('aria-selected') === 'true');
  const activeName = active ? nameOf(active, element, scope) : null;
  if (activeName !== null) {
    state.activeTab = activeName;
  }
  return state;
}

/** A list is still walked after its summary: its links are the point of it. */
function summarizeList(element: Element, scope: SummaryScope): Record<string, unknown> {
  const items = queryRole(element, 'listitem', scope);
  if (!items.length) {
    return {};
  }
  return counted(items, 'itemCount', 'items', element, scope);
}

/** `combobox` is a leaf role, so its choices are only reachable here; they are authored markup, not user input. */
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

  const root = idScope(element);

  const listId = element.getAttribute('list');
  if (listId) {
    const datalist = root.getElementById(listId);
    if (datalist) {
      return Array.from(datalist.querySelectorAll('option')).filter(
        option => !isHiddenFromContext(option, scope.withheld)
      );
    }
  }

  const ownedIds = [...getAriaReferenceIds(element, 'aria-owns'), ...getAriaReferenceIds(element, 'aria-controls')];
  for (const id of ownedIds) {
    const owned = root.getElementById(id);
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

/** Menu items are not options, so a menu needs its own summarizer. */
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
  const state = counted(entries, 'optionCount', 'options', collection, scope);
  const selected = namesOf(entries.filter(isSelected), collection, scope);
  if (selected.length) {
    state.selected = selected;
  }
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

/** The browser never sets `aria-selected` on a native `<option>`. */
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
  const state = counted(radios, 'optionCount', 'options', element, scope);
  const chosen = radios.find(
    radio => (radio as HTMLInputElement).checked || radio.getAttribute('aria-checked') === 'true'
  );
  const value = chosen ? nameOf(chosen, element, scope) : null;
  if (value !== null) {
    state.value = value;
  }
  return state;
}

/** Rows carrying data; a column-header row is not a record. */
function dataRows(rows: Element[]): Element[] {
  return rows.filter(row => !row.querySelector(ITEM_SELECTORS.columnheader) || row.querySelector(CELL_SELECTOR));
}

function queryRole(element: Element, role: string, scope: SummaryScope): Element[] {
  const container = ITEM_CONTAINER_SELECTORS[role];
  const judgesStyle = STYLE_JUDGED_ROLES.has(role);
  return queryRendered(element, ITEM_SELECTORS[role]).filter(
    item =>
      !isHiddenFromContext(item, scope.withheld) &&
      (!container || closestContainer(item, container) === element) &&
      (!judgesStyle || isVisible(item))
  );
}

/** Roles hidden by a style are left out too; rows are not checked, to avoid a layout read per record. */
const STYLE_JUDGED_ROLES = new Set(['columnheader', 'tab', 'listitem', 'menuitem']);

/** `null` for an item in a redacted region inside the collection: it still counts, but its name is withheld. */
function nameOf(item: Element, collection: Element, scope: SummaryScope): string | null {
  if (isRedactedWithin(item, collection)) {
    return null;
  }
  return accessibleName(item, resolveRole(item), scope.options.maxTextLength, scope.withheld);
}

function namesOf(items: Element[], collection: Element, scope: SummaryScope): string[] {
  return items
    .slice(0, scope.options.maxItemsPerCollection)
    .map(item => nameOf(item, collection, scope))
    .filter((name): name is string => name !== null);
}

function closestContainer(item: Element, container: string): Element | null {
  const parent = parentAcrossShadow(item);
  return parent ? closestAcrossShadow(parent, container) : null;
}
