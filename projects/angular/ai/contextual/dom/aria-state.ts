/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrContextSnapshotOptions } from '@clr/angular/utils';

import { accessibleText, truncate } from './text';

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
 * ARIA attributes carrying an enumerated value, with the value that means "nothing to
 * report" and is therefore omitted.
 */
const ENUM_ATTRIBUTES: { attribute: string; key: string; empty: string }[] = [
  { attribute: 'aria-sort', key: 'sort', empty: 'none' },
  { attribute: 'aria-current', key: 'current', empty: 'false' },
  { attribute: 'aria-live', key: 'live', empty: 'off' },
  { attribute: 'aria-haspopup', key: 'hasPopup', empty: 'false' },
  { attribute: 'aria-invalid', key: 'invalid', empty: 'false' },
];

/**
 * Marks a control, or a region containing controls, whose value must never appear in a
 * snapshot. Use it for anything sensitive that the input type alone does not reveal — an
 * account number or an API token in a plain text field.
 *
 * The field itself is still described, so an agent knows it exists and that its value is
 * being withheld rather than being absent.
 */
export const CLR_CONTEXT_REDACT_ATTRIBUTE = 'data-clr-context-redact';

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
 * when it is omitted the ancestry is checked here.
 */
export function ariaState(
  element: Element,
  options: Required<ClrContextSnapshotOptions>,
  insideRedactedRegion?: boolean
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

  for (const { attribute, key, empty } of ENUM_ATTRIBUTES) {
    const raw = element.getAttribute(attribute)?.trim();
    if (raw && raw !== empty) {
      state[key] = key === 'invalid' ? true : raw;
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
  const description = describedByText(element, options);
  if (description) {
    state.description = description;
  }

  assignNativeState(element, state, options);
  assignValueState(element, state, options, insideRedactedRegion);

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
  if ('disabled' in element && (element as HTMLInputElement).disabled) {
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
 * a native and an ARIA checkbox read alike — and so that a consumer served without form
 * values still sees whether a box is ticked, which is UI state rather than something
 * typed.
 */
function assignValueState(
  element: Element,
  state: Record<string, unknown>,
  options: Required<ClrContextSnapshotOptions>,
  insideRedactedRegion?: boolean
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
  if (tagName === 'select') {
    // What the user sees is the option's text; its `value` may be an internal key — an
    // Angular `[ngValue]` binding renders as "3: Object" — that means nothing to an agent.
    const chosen = Array.from((element as HTMLSelectElement).selectedOptions).map(option =>
      truncate(option.label || option.text, options.maxTextLength)
    );
    if ((element as HTMLSelectElement).multiple) {
      state.value = chosen.slice(0, options.maxItemsPerCollection);
    } else if (chosen.length) {
      state.value = chosen[0];
    }
  }
}

/** The joined text of every element that describes this one. */
function describedByText(element: Element, options: Required<ClrContextSnapshotOptions>): string {
  const ids = element.getAttribute('aria-describedby')?.trim();
  if (!ids) {
    return '';
  }
  const document = element.ownerDocument;
  const described = ids
    .split(/\s+/)
    .map(id => document.getElementById(id))
    .map(target => (target ? accessibleText(target).trim() : ''))
    .filter(text => text)
    .join(' ');
  return truncate(described, options.maxTextLength);
}

/**
 * Whether this control's value must be withheld. Independent of what the caller asked
 * for: some values have no business being in a snapshot at all.
 *
 * `insideRedactedRegion` says whether an ancestor carries the redaction attribute, when
 * the caller already knows; the ancestry is only searched when it does not.
 */
export function isRedacted(element: Element, insideRedactedRegion?: boolean): boolean {
  if (insideRedactedRegion ?? !!element.closest(`[${CLR_CONTEXT_REDACT_ATTRIBUTE}]`)) {
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
