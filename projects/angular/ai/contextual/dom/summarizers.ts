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
 * with a summarizer is not descended into.
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
  columnheader: '[role="columnheader"], th:not([role])',
  row: '[role="row"], tr:not([role])',
  tab: '[role="tab"]',
  listitem: '[role="listitem"], li:not([role])',
  option: '[role="option"], option:not([role])',
  radio: '[role="radio"], input[type="radio"]:not([role])',
};

const ROLE_SUMMARIZERS: Record<string, RoleSummarizer> = {
  grid: summarizeGrid,
  table: summarizeGrid,
  treegrid: summarizeGrid,
  tablist: summarizeTablist,
  list: summarizeList,
  listbox: summarizeOptions,
  menu: summarizeOptions,
  radiogroup: summarizeRadiogroup,
};

/**
 * The summary for this element's role, or `null` when the role has none and the element
 * should be walked instead.
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

/** Whether a role is described by a summary rather than by walking into it. */
export function hasRoleSummarizer(role: string | null): boolean {
  return !!role && role in ROLE_SUMMARIZERS;
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

function summarizeTablist(element: Element, options: Required<ClrContextSnapshotOptions>): Record<string, unknown> {
  const tabs = queryRole(element, 'tab').slice(0, options.maxItemsPerCollection);
  const state: Record<string, unknown> = { tabs: tabs.map(tab => nameOf(tab, options)) };
  const active = tabs.find(tab => tab.getAttribute('aria-selected') === 'true');
  if (active) {
    state.activeTab = nameOf(active, options);
  }
  return state;
}

function summarizeList(element: Element, options: Required<ClrContextSnapshotOptions>): Record<string, unknown> {
  const items = queryRole(element, 'listitem');
  if (!items.length) {
    return {};
  }
  return {
    itemCount: items.length,
    items: items.slice(0, options.maxItemsPerCollection).map(item => nameOf(item, options)),
  };
}

function summarizeOptions(element: Element, options: Required<ClrContextSnapshotOptions>): Record<string, unknown> {
  const entries = queryRole(element, 'option');
  if (!entries.length) {
    return {};
  }
  const state: Record<string, unknown> = {
    options: entries.slice(0, options.maxItemsPerCollection).map(entry => nameOf(entry, options)),
  };
  const selected = entries
    .filter(entry => entry.getAttribute('aria-selected') === 'true')
    .slice(0, options.maxItemsPerCollection)
    .map(entry => nameOf(entry, options));
  if (selected.length) {
    state.selected = selected;
  }
  return state;
}

function summarizeRadiogroup(element: Element, options: Required<ClrContextSnapshotOptions>): Record<string, unknown> {
  const radios = queryRole(element, 'radio');
  if (!radios.length) {
    return {};
  }
  const state: Record<string, unknown> = {
    options: radios.slice(0, options.maxItemsPerCollection).map(radio => nameOf(radio, options)),
  };
  // Which option a user picked is their data, so it waits for an explicit opt-in.
  if (options.includeFormValues) {
    const chosen = radios.find(
      radio => (radio as HTMLInputElement).checked || radio.getAttribute('aria-checked') === 'true'
    );
    if (chosen) {
      state.value = nameOf(chosen, options);
    }
  }
  return state;
}

/**
 * The rows carrying data. A row made of column headers names the columns rather than
 * holding a record, and counting it would misreport the size of the data.
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
