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

/** Roles whose value is rendered output rather than something the user typed. */
const DISPLAYED_VALUE_ROLES = new Set(['progressbar', 'meter']);

/**
 * Everything the accessibility tree and native HTML say about an element's current state,
 * as a flat, JSON-safe object.
 *
 * One declarative map applied to every element, rather than per-component knowledge:
 * `aria-expanded` means the same thing on a Clarity accordion, a `@clr/ui` CSS-only
 * dropdown and a plain `<details>`.
 *
 * Values a user typed are withheld unless `includeFormValues` is set. A progress bar or
 * meter is exempt: its value is displayed content, not user input.
 */
export function ariaState(
  element: Element,
  role: string | null,
  options: Required<ClrContextSnapshotOptions>
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
  assignValueState(element, role, state, options);

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

/** The element's current value, gated on the application opting into user data. */
function assignValueState(
  element: Element,
  role: string | null,
  state: Record<string, unknown>,
  options: Required<ClrContextSnapshotOptions>
): void {
  const displayed = !!role && DISPLAYED_VALUE_ROLES.has(role);
  const ariaValue = numberAttribute(element, 'aria-valuenow');

  if (ariaValue !== undefined && (displayed || options.includeFormValues)) {
    state.value = ariaValue;
  }

  if (!options.includeFormValues) {
    return;
  }
  if ('checked' in element && (element as HTMLInputElement).type === 'checkbox') {
    state.value = (element as HTMLInputElement).checked;
    return;
  }
  if ('value' in element && typeof (element as HTMLInputElement).value === 'string') {
    state.value = truncate((element as HTMLInputElement).value, options.maxTextLength);
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

function numberAttribute(element: Element, attribute: string): number | undefined {
  const raw = element.getAttribute(attribute);
  if (raw === null || raw.trim() === '') {
    return undefined;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : undefined;
}
