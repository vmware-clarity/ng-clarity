/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  CLR_CONTEXT_HIDDEN_SELECTOR,
  CLR_CONTEXT_REDACT_SELECTOR,
  ClrComponentContext,
  ClrContextSnapshotOptions,
} from '@clr/angular/utils';

import { accessibleText, referencedIds, referencedText, truncate } from './text';

/** Reported only when on: `aria-disabled="false"` says nothing. */
const FLAG_ATTRIBUTES: Record<string, string> = {
  'aria-disabled': 'disabled',
  'aria-readonly': 'readOnly',
  'aria-required': 'required',
  'aria-modal': 'modal',
  'aria-multiselectable': 'multiSelectable',
  'aria-busy': 'busy',
};

/** `false` is as meaningful as `true` here: a collapsed panel is real information. */
const TRISTATE_ATTRIBUTES: Record<string, string> = {
  'aria-expanded': 'expanded',
  'aria-selected': 'selected',
  'aria-checked': 'checked',
  'aria-pressed': 'pressed',
};

/** Only values ARIA defines are reported, so page markup cannot grow the snapshot. */
const ENUM_ATTRIBUTES: { attribute: string; key: string; empty: string; values: string[]; other: string | null }[] = [
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

export function ariaEnumValue(element: Element, attribute: string): string | null {
  const definition = ENUM_ATTRIBUTES.find(candidate => candidate.attribute === attribute);
  const raw = element.getAttribute(attribute)?.trim().toLowerCase();
  if (!definition || !raw || raw === definition.empty) {
    return null;
  }
  return definition.values.includes(raw) ? raw : definition.other;
}

const REDACTED_INPUT_TYPES = new Set(['password', 'file']);

/** `autocomplete` tokens for credentials and payment details, which are never reported. */
const REDACTED_AUTOCOMPLETE_TOKENS = new Set([
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

/** The element's ARIA and native state as a flat, JSON-safe object. */
export function ariaState(
  element: Element,
  options: Required<ClrContextSnapshotOptions>,
  insideRedactedRegion?: boolean,
  withheld = ''
): Record<string, unknown> {
  const state: Record<string, unknown> = {};

  for (const [attribute, key] of Object.entries(TRISTATE_ATTRIBUTES)) {
    const raw = element.getAttribute(attribute);
    if (raw === 'true' || raw === 'false') {
      state[key] = raw === 'true';
    } else if (raw === 'mixed') {
      state[key] = 'mixed';
    }
  }

  for (const [attribute, key] of Object.entries(FLAG_ATTRIBUTES)) {
    if (element.getAttribute(attribute) === 'true') {
      state[key] = true;
    }
  }

  for (const { attribute, key } of ENUM_ATTRIBUTES) {
    const value = ariaEnumValue(element, attribute);
    if (value !== null) {
      state[key] = key === 'invalid' ? true : value;
    }
  }

  const level = numberAttribute(element, 'aria-level');
  if (level !== undefined) {
    state.level = level;
  }

  const roleDescription = element.getAttribute('aria-roledescription')?.trim();
  if (roleDescription) {
    state.roleDescription = truncate(roleDescription, options.maxTextLength);
  }

  // Messages wired by `aria-describedby` are read there, so they do not show up as stray nodes;
  // `aria-errormessage` becomes `error` and only while the field is invalid.
  const errorIds = state.invalid === true ? referencedIds(element, 'aria-errormessage') : [];
  const description = truncate(referencedText(element, 'aria-describedby', withheld, errorIds), options.maxTextLength);
  if (description) {
    state.description = description;
  }
  const error = errorIds.length
    ? truncate(referencedText(element, 'aria-errormessage', withheld), options.maxTextLength)
    : '';
  if (error) {
    state.error = error;
  }

  assignNativeState(element, state, options);
  assignValueState(element, state, options, insideRedactedRegion, withheld);

  return state;
}

function assignNativeState(
  element: Element,
  state: Record<string, unknown>,
  options: Required<ClrContextSnapshotOptions>
): void {
  const tagName = element.tagName.toLowerCase();

  if ((tagName === 'details' || tagName === 'dialog') && element.hasAttribute('open')) {
    state.open = true;
  }
  // `:disabled` also covers a control inside a disabled fieldset, which the property does not.
  if ('disabled' in element && ((element as HTMLInputElement).disabled || element.matches(':disabled'))) {
    state.disabled = true;
  }
  if ('required' in element && (element as HTMLInputElement).required) {
    state.required = true;
  }

  for (const attribute of ['min', 'max', 'step'] as const) {
    const value = numberAttribute(element, attribute);
    if (value !== undefined) {
      state[attribute] = value;
    }
  }
  const pattern = element.getAttribute('pattern');
  if (pattern) {
    state.pattern = truncate(pattern, options.maxTextLength);
  }
  const maxLength = numberAttribute(element, 'maxlength');
  if (maxLength !== undefined) {
    state.maxLength = maxLength;
  }

  const href = element.getAttribute('href');
  if (href) {
    state.href = truncate(href, options.maxTextLength);
  }
}

const VALUELESS_INPUT_TYPES = new Set(['button', 'submit', 'reset', 'image', 'checkbox', 'radio', 'hidden']);

/** Native checked state uses `checked`, like `aria-checked`, and is withheld with the other values. */
function assignValueState(
  element: Element,
  state: Record<string, unknown>,
  options: Required<ClrContextSnapshotOptions>,
  insideRedactedRegion?: boolean,
  withheld = ''
): void {
  // Reported as withheld so an agent can tell a hidden field from an empty one.
  if (isRedacted(element, insideRedactedRegion)) {
    state.redacted = true;
    return;
  }

  const valueText = element.getAttribute('aria-valuetext')?.trim();
  if (valueText) {
    state.value = truncate(valueText, options.maxTextLength);
    return;
  }
  const ariaValue = numberAttribute(element, 'aria-valuenow');
  if (ariaValue !== undefined) {
    state.value = ariaValue;
    return;
  }

  const tagName = element.tagName.toLowerCase();
  if (tagName === 'progress' || tagName === 'meter') {
    if (tagName === 'meter' || element.hasAttribute('value')) {
      state.value = (element as HTMLProgressElement | HTMLMeterElement).value;
    }
    return;
  }
  if (tagName === 'input') {
    const input = element as HTMLInputElement;
    const type = (input.getAttribute('type') || 'text').toLowerCase();
    if (type === 'checkbox' || type === 'radio') {
      state.checked = type === 'checkbox' && input.indeterminate ? 'mixed' : input.checked;
      return;
    }
    if (type === 'number' || type === 'range') {
      state.value = input.value === '' || Number.isNaN(input.valueAsNumber) ? null : input.valueAsNumber;
    } else if (!VALUELESS_INPUT_TYPES.has(type)) {
      state.value = truncate(input.value, options.maxTextLength);
    }
    return;
  }
  if (tagName === 'textarea') {
    state.value = truncate((element as HTMLTextAreaElement).value, options.maxTextLength);
    return;
  }
  if (isContentEditable(element)) {
    state.value = truncate(accessibleText(element, undefined, withheld), options.maxTextLength);
    return;
  }
  if (tagName === 'select') {
    // An option's `value` may be an internal key (`[ngValue]` renders "3: Object"), so its text is used.
    const chosen = Array.from((element as HTMLSelectElement).selectedOptions)
      .filter(option => optionReadable(option, element, withheld))
      .map(option => truncate(option.label || option.text, options.maxTextLength));
    if ((element as HTMLSelectElement).multiple) {
      state.value = chosen.slice(0, options.maxItemsPerCollection);
    } else if (chosen.length) {
      state.value = chosen[0];
    }
  }
}

function optionReadable(option: Element, select: Element, withheld: string): boolean {
  if (option.closest(CLR_CONTEXT_HIDDEN_SELECTOR) || (withheld && option.closest(withheld))) {
    return false;
  }
  for (let current: Element | null = option; current && current !== select; current = current.parentElement) {
    if (current.matches(CLR_CONTEXT_REDACT_SELECTOR)) {
      return false;
    }
  }
  return true;
}

/** Whether this control's value must be withheld, whatever the caller asked for. */
export function isRedacted(element: Element, insideRedactedRegion?: boolean): boolean {
  if (insideRedactedRegion ?? !!element.closest(CLR_CONTEXT_REDACT_SELECTOR)) {
    return true;
  }
  const type = element.getAttribute('type')?.toLowerCase();
  if (type && REDACTED_INPUT_TYPES.has(type)) {
    return true;
  }
  const autocomplete = element.getAttribute('autocomplete')?.toLowerCase().trim();
  if (!autocomplete) {
    return false;
  }
  return autocomplete.split(/\s+/).some(token => REDACTED_AUTOCOMPLETE_TOKENS.has(token));
}

function numberAttribute(element: Element, attribute: string): number | undefined {
  const raw = element.getAttribute(attribute);
  if (raw === null || raw.trim() === '') {
    return undefined;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : undefined;
}

/** State keys holding what the user entered or chose; withheld together. */
export const VALUE_STATE_KEYS: readonly string[] = [
  'value',
  'selected',
  'checked',
  'pressed',
  'selection',
  'selectedRows',
];

const OUTPUT_VALUE_ROLES = new Set(['progressbar', 'meter']);

export function isContentEditable(element: Element): boolean {
  const editable = element.getAttribute('contenteditable');
  return editable !== null && editable.trim().toLowerCase() !== 'false';
}

const OUTPUT_WITHHELD_KEYS = VALUE_STATE_KEYS.filter(key => key !== 'value');

/** Removes every value key from the node and its descendants; see {@link withoutStateKeys}. */
export function withoutValues(node: ClrComponentContext, markWithheld = false): ClrComponentContext {
  return withoutStateKeys(
    node,
    ({ type }) => (OUTPUT_VALUE_ROLES.has(type) ? OUTPUT_WITHHELD_KEYS : VALUE_STATE_KEYS),
    markWithheld
  );
}

/**
 * Removes the keys `keysFor` names, recursively. With `markWithheld`, a node that lost a
 * non-empty value gets `withheld: true`; an empty value leaves no marker.
 */
export function withoutStateKeys(
  node: ClrComponentContext,
  keysFor: (node: ClrComponentContext) => readonly string[],
  markWithheld = false
): ClrComponentContext {
  let result = node;
  const state = node.state;
  const keys = keysFor(node);
  if (state && keys.some(key => key in state)) {
    const kept: Record<string, unknown> = { ...state };
    for (const key of keys) {
      delete kept[key];
    }
    if (markWithheld && keys.some(key => key in state && !isEmptyValue(state[key]))) {
      kept['withheld'] = true;
    }
    result = { ...result };
    if (Object.keys(kept).length) {
      result.state = kept;
    } else {
      delete result.state;
    }
  }
  const children = node.children;
  if (children?.length) {
    const reduced = children.map(child => withoutStateKeys(child, keysFor, markWithheld));
    if (reduced.some((child, index) => child !== children[index])) {
      result = { ...result, children: reduced };
    }
  }
  return result;
}

function isEmptyValue(value: unknown): boolean {
  return value === undefined || value === null || value === '' || (Array.isArray(value) && !value.length);
}

/**
 * State keys listing what a collection shows; inside a redacted region they go with the values.
 * Addresses count too: a path can carry the account number or token the region withholds.
 */
const CONTENT_STATE_KEYS: readonly string[] = [
  'items',
  'options',
  'rows',
  'tabs',
  'activeTab',
  'disabledOptions',
  'href',
  'url',
];

/** Roles whose label is their content; in a redacted region it is withheld, unlike a control's label. */
const CONTENT_ROLES: ReadonlySet<string> = new Set([
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

/** Strips values, collection contents and content labels, and marks the node `redacted: true`. */
export function redactNode(node: ClrComponentContext): ClrComponentContext {
  const reduced = withoutContentLabels(withoutStateKeys(withoutValues(node), () => CONTENT_STATE_KEYS));
  return { ...reduced, state: { ...reduced.state, redacted: true } };
}

function withoutContentLabels(node: ClrComponentContext): ClrComponentContext {
  const result: ClrComponentContext = { ...node };
  if (CONTENT_ROLES.has(node.type)) {
    delete result.label;
  }
  if (node.children?.length) {
    result.children = node.children.map(withoutContentLabels);
  }
  return result;
}
