/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/** Reported only when on: `aria-disabled="false"` says nothing. */
export const FLAG_ATTRIBUTES: Readonly<Record<string, string>> = {
  'aria-disabled': 'disabled',
  'aria-readonly': 'readOnly',
  'aria-required': 'required',
  'aria-modal': 'modal',
  'aria-multiselectable': 'multiSelectable',
  'aria-busy': 'busy',
};

/** `false` is as meaningful as `true` here: a collapsed panel is real information. */
export const TRISTATE_ATTRIBUTES: Readonly<Record<string, string>> = {
  'aria-expanded': 'expanded',
  'aria-selected': 'selected',
  'aria-checked': 'checked',
  'aria-pressed': 'pressed',
};

interface EnumAttribute {
  attribute: string;
  key: string;
  empty: string;
  values: string[];
  other: string | null;
}

/** Only values ARIA defines are reported, so page markup cannot grow the snapshot. */
export const ENUM_ATTRIBUTES: readonly EnumAttribute[] = [
  { attribute: 'aria-sort', key: 'sort', empty: 'none', values: ['ascending', 'descending', 'other'], other: null },
  {
    attribute: 'aria-current',
    key: 'current',
    empty: 'false',
    values: ['page', 'step', 'location', 'date', 'time', 'true'],
    other: 'true',
  },
  { attribute: 'aria-live', key: 'live', empty: 'off', values: ['polite', 'assertive'], other: null },
  {
    attribute: 'aria-haspopup',
    key: 'hasPopup',
    empty: 'false',
    values: ['true', 'menu', 'listbox', 'tree', 'grid', 'dialog'],
    other: 'true',
  },
  { attribute: 'aria-invalid', key: 'invalid', empty: 'false', values: [], other: 'true' },
];

export const REDACTED_INPUT_TYPES: ReadonlySet<string> = new Set(['password', 'file']);

/** `autocomplete` tokens for credentials and payment details, which are never reported. */
export const REDACTED_AUTOCOMPLETE_TOKENS: ReadonlySet<string> = new Set([
  'current-password',
  'new-password',
  'one-time-code',
  'cc-number',
  'cc-exp',
  'cc-exp-month',
  'cc-exp-year',
  'cc-csc',
  'cc-name',
  'cc-given-name',
  'cc-additional-name',
  'cc-family-name',
  'cc-type',
]);

export const VALUELESS_INPUT_TYPES: ReadonlySet<string> = new Set([
  'button',
  'submit',
  'reset',
  'image',
  'checkbox',
  'radio',
  'hidden',
]);

/** State keys holding what the user entered or chose; withheld together. */
export const VALUE_STATE_KEYS: readonly string[] = [
  'value',
  'selected',
  'checked',
  'pressed',
  'selection',
  'selectedRows',
];

/**
 * State keys listing what a collection shows; inside a redacted region they go with the values.
 * Addresses count too: a path can carry the account number or token the region withholds.
 */
export const CONTENT_STATE_KEYS: readonly string[] = [
  'items',
  'options',
  'rows',
  'tabs',
  'activeTab',
  'disabledOptions',
  'href',
  'url',
];

/**
 * State keys the engine derives that are withheld from untrusted consumers because they reveal what the user
 * chose; published state is withheld unless marked public, so it needs no entry here.
 */
export const UNTRUSTED_WITHHELD_STATE_KEYS: readonly string[] = Object.freeze([
  'rows',
  'filteredColumns',
  'hiddenColumns',
  'fileCount',
  'matchingOptions',
  'redactedMatchingOptions',
  'matchingOptionsPending',
  'matchingOptionCount',
]);
