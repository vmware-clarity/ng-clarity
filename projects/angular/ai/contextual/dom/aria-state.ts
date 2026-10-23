/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { getAriaReferenceIds } from '@angular/cdk/a11y';
import { CLR_CONTEXT_REDACT_SELECTOR, ClrComponentContext, ClrContextSnapshotOptions } from '@clr/angular/utils';

import { closestAcrossShadow } from './shadow';
import {
  CONTENT_STATE_KEYS,
  ENUM_ATTRIBUTES,
  FLAG_ATTRIBUTES,
  REDACTED_AUTOCOMPLETE_TOKENS,
  REDACTED_INPUT_TYPES,
  TRISTATE_ATTRIBUTES,
  VALUE_STATE_KEYS,
  VALUELESS_INPUT_TYPES,
} from './tables/aria';
import { CONTENT_ROLES } from './tables/roles';
import { accessibleText, referencedText, truncate } from './text';
import { isHiddenFromContext, isRedactedWithin } from './visibility';

export function ariaEnumValue(element: Element, attribute: string): string | null {
  const definition = ENUM_ATTRIBUTES.find(candidate => candidate.attribute === attribute);
  const raw = element.getAttribute(attribute)?.trim().toLowerCase();
  if (!definition || !raw || raw === definition.empty) {
    return null;
  }
  return definition.values.includes(raw) ? raw : definition.other;
}

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
  const errorIds = state.invalid === true ? getAriaReferenceIds(element, 'aria-errormessage') : [];
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
  if (isNativelyDisabled(element)) {
    state.disabled = true;
  }
  if ('required' in element && (element as HTMLInputElement).required) {
    state.required = true;
  }

  // A custom slider or spinbutton states its bounds through ARIA.
  for (const attribute of ['min', 'max', 'step'] as const) {
    const value =
      numberAttribute(element, attribute) ??
      (attribute === 'step' ? undefined : numberAttribute(element, `aria-value${attribute}`));
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
      .filter(option => !isHiddenFromContext(option, withheld) && !isRedactedWithin(option, element))
      .map(option => truncate(option.label || option.text, options.maxTextLength));
    if ((element as HTMLSelectElement).multiple) {
      state.value = chosen.slice(0, options.maxItemsPerCollection);
    } else if (chosen.length) {
      state.value = chosen[0];
    }
  }
}

/** `:disabled` also covers a control inside a disabled fieldset, which the property does not. */
export function isNativelyDisabled(element: Element): boolean {
  return 'disabled' in element && ((element as HTMLInputElement).disabled || element.matches(':disabled'));
}

/** Whether this control's value must be withheld, whatever the caller asked for. */
export function isRedacted(element: Element, insideRedactedRegion?: boolean): boolean {
  if (insideRedactedRegion ?? !!closestAcrossShadow(element, CLR_CONTEXT_REDACT_SELECTOR)) {
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
