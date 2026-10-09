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

import { accessibleText, referencedText, truncate } from './text';

/**
 * ARIA attributes that are only worth reporting when they are on, reported as a flag.
 * `aria-disabled="false"` says nothing an agent needs, so it is left out entirely.
 */
const FLAG_ATTRIBUTES: Record<string, string> = {
  'aria-disabled': 'disabled',
  'aria-readonly': 'readOnly',
  'aria-required': 'required',
  'aria-modal': 'modal',
  'aria-multiselectable': 'multiSelectable',
  'aria-busy': 'busy',
};

/**
 * ARIA attributes whose `false` state is as meaningful as their `true` state — a
 * collapsed panel and an unselected tab are both real information.
 */
const TRISTATE_ATTRIBUTES: Record<string, string> = {
  'aria-expanded': 'expanded',
  'aria-selected': 'selected',
  'aria-checked': 'checked',
  'aria-pressed': 'pressed',
};

/**
 * ARIA attributes carrying an enumerated value: the value that means "nothing to report"
 * and is therefore omitted, the values ARIA defines, and what any other value means — for
 * some attributes `true`, for others nothing. Page markup can put anything in an
 * attribute, and only a value ARIA knows is reported, so a snapshot's size stays bounded.
 */
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

/** The value an enumerated ARIA attribute reports, or `null` for none; see {@link ENUM_ATTRIBUTES}. */
export function ariaEnumValue(element: Element, attribute: string): string | null {
  const definition = ENUM_ATTRIBUTES.find(candidate => candidate.attribute === attribute);
  const raw = element.getAttribute(attribute)?.trim().toLowerCase();
  if (!definition || !raw || raw === definition.empty) {
    return null;
  }
  return definition.values.includes(raw) ? raw : definition.other;
}

/** Input types whose value is never reported, whatever the caller asked for. */
const REDACTED_INPUT_TYPES = new Set(['password', 'file']);

/**
 * `autocomplete` tokens that declare a field holds a credential or a payment
 * instrument. The author has already told the browser what this field is for; that is
 * reason enough not to put it in a snapshot.
 */
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

/**
 * Everything the accessibility tree and native HTML say about an element's current state,
 * as a flat, JSON-safe object.
 *
 * One declarative map applied to every element, rather than per-component knowledge:
 * `aria-expanded` means the same thing on a Clarity accordion, a `@clr/ui` CSS-only
 * dropdown and a plain `<details>`.
 *
 * A control's current value is part of what the page is showing, so it is reported like
 * any other state — except where it must never be: see {@link isRedacted}. Which
 * consumers are allowed to see values is decided at the boundary that serves them, not
 * here.
 *
 * `insideRedactedRegion` is what the walk already knows about the element's ancestry;
 * when it is omitted the ancestry is checked here. `withheld` selects elements whose
 * text never becomes a description (see `accessibleText`).
 */
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

  // Helper guidance and validation messages are wired to a control with
  // aria-describedby, which is where an agent should read them from too — otherwise they
  // surface as unattached nodes beside the field and it has to guess which one they
  // belong to.
  const description = truncate(referencedText(element, 'aria-describedby', withheld), options.maxTextLength);
  if (description) {
    state.description = description;
  }

  assignNativeState(element, state, options);
  assignValueState(element, state, options, insideRedactedRegion, withheld);

  return state;
}

/** State HTML itself expresses, which authors reach for far more often than ARIA. */
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

  // Constraints bound what an agent may legitimately propose, so they are reported
  // whether or not values are.
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

  // Where a link goes is part of what it offers to do.
  const href = element.getAttribute('href');
  if (href) {
    state.href = truncate(href, options.maxTextLength);
  }
}

/** Input types whose `value` is a submission detail or a caption, never something typed. */
const VALUELESS_INPUT_TYPES = new Set(['button', 'submit', 'reset', 'image', 'checkbox', 'radio', 'hidden']);

/**
 * The element's current value, unless it is one that must never be reported.
 *
 * A native checked state is reported as `checked`, the same key `aria-checked` uses, so
 * a native and an ARIA checkbox read alike. `checked` is one of the value keys, so it is
 * withheld from a consumer served without form values, like any other choice.
 */
function assignValueState(
  element: Element,
  state: Record<string, unknown>,
  options: Required<ClrContextSnapshotOptions>,
  insideRedactedRegion?: boolean,
  withheld = ''
): void {
  // Reported as withheld rather than left out, so an agent can tell a field it may not
  // see from one that happens to be empty — and does not go looking for it elsewhere.
  if (isRedacted(element, insideRedactedRegion)) {
    state.redacted = true;
    return;
  }

  // The value as it is shown to the user, when the author spelled it out: a slider
  // displaying "Large" rather than 3.
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
    // How far along something is, as the bar shows it; its `max` is reported with the
    // other constraints. A progress bar without a value is indeterminate, and has none.
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
    if (!VALUELESS_INPUT_TYPES.has(type)) {
      state.value = truncate(input.value, options.maxTextLength);
    }
    return;
  }
  if (tagName === 'textarea') {
    state.value = truncate((element as HTMLTextAreaElement).value, options.maxTextLength);
    return;
  }
  if (isContentEditable(element)) {
    // A rich-text editor holds what the user typed the same way a textarea does; it is
    // a value, so that redaction and value-withholding apply to it.
    state.value = truncate(accessibleText(element, undefined, withheld), options.maxTextLength);
    return;
  }
  if (tagName === 'select') {
    // What the user sees is the option's text; its `value` may be an internal key — an
    // Angular `[ngValue]` binding renders as "3: Object" — that means nothing to an agent.
    // Only what the option list itself would name: an option hidden, redacted or excluded
    // is not the value either, however it is chosen.
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

/**
 * Whether an option of `select` may be named: not hidden, not excluded, and neither it nor
 * a group inside the select redacted — the same options the select's summary lists.
 */
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

/**
 * Whether this control's value must be withheld. Independent of what the caller asked
 * for: some values have no business being in a snapshot at all.
 *
 * `insideRedactedRegion` says whether an ancestor carries the redaction attribute, when
 * the caller already knows; the ancestry is only searched when it does not.
 */
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
  // `autocomplete` may be a space-separated list with section and address hints.
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

/**
 * The state keys that carry what the user entered or chose: what they typed, which
 * options they picked, whether they ticked a box or pressed a toggle button, which rows
 * they selected and how many.
 * Withheld together wherever values are withheld — a choice is as much the user's input
 * as typed text is.
 */
export const VALUE_STATE_KEYS: readonly string[] = [
  'value',
  'selected',
  'checked',
  'pressed',
  'selection',
  'selectedRows',
];

/**
 * Roles whose value is the application's output, not the user's input — how far an
 * upload has got, how full a disk is — and is kept wherever values are withheld.
 */
const OUTPUT_VALUE_ROLES = new Set(['progressbar', 'meter']);

/** Whether an element is an editing host: `contenteditable` on, in any spelling but `false`. */
export function isContentEditable(element: Element): boolean {
  const editable = element.getAttribute('contenteditable');
  return editable !== null && editable.trim().toLowerCase() !== 'false';
}

/** The value keys withheld from a node whose value is the application's output. */
const OUTPUT_WITHHELD_KEYS = VALUE_STATE_KEYS.filter(key => key !== 'value');

/**
 * The same node with every value key removed from its state, recursively, so that
 * neither the node nor anything published under it keeps what the user entered.
 * Returns the node itself when there is nothing to remove.
 */
export function withoutValues(node: ClrComponentContext): ClrComponentContext {
  return withoutStateKeys(node, ({ type }) => (OUTPUT_VALUE_ROLES.has(type) ? OUTPUT_WITHHELD_KEYS : VALUE_STATE_KEYS));
}

/**
 * The same node with the keys `keysFor` names removed from its state and from the state
 * of every node below it. Returns the node itself when there is nothing to remove.
 */
export function withoutStateKeys(
  node: ClrComponentContext,
  keysFor: (node: ClrComponentContext) => readonly string[]
): ClrComponentContext {
  let result = node;
  const state = node.state;
  const keys = keysFor(node);
  if (state && keys.some(key => key in state)) {
    const kept: Record<string, unknown> = { ...state };
    for (const key of keys) {
      delete kept[key];
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
    const reduced = children.map(child => withoutStateKeys(child, keysFor));
    if (reduced.some((child, index) => child !== children[index])) {
      result = { ...result, children: reduced };
    }
  }
  return result;
}

/**
 * State keys that list what a collection shows — its items, options, rows, tabs — as
 * opposed to its shape. Inside a region the application keeps from agents they go with
 * the values: the rows of a grid of account numbers are as sensitive as a typed one.
 */
// Addresses count as content: a link's or a frame's path carries the account number,
// the token or the record the region was marked to withhold.
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

/**
 * Nodes whose label is the content they show rather than a name an author gave them — a
 * heading, a cell, a list item, a line of text. Inside a redacted region that content is
 * withheld; a control keeps its label, which names the field rather than repeating it.
 */
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

/**
 * The node as it may appear from inside a region the application marked
 * `data-clr-context-redact`: no values anywhere below it, no collection contents, and no
 * text shown as content — only the shape of the UI and the names of its controls. The
 * node itself says it was withheld (`redacted: true`), so an agent can tell a field it may
 * not see from one that is empty.
 */
export function redactNode(node: ClrComponentContext): ClrComponentContext {
  const reduced = withoutContentLabels(withoutStateKeys(withoutValues(node), () => CONTENT_STATE_KEYS));
  return { ...reduced, state: { ...reduced.state, redacted: true } };
}

/** The same node with the label of every {@link CONTENT_ROLES} node in it removed. */
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
