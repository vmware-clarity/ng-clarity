/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ApplicationRef, ChangeDetectorRef, getDebugNode } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import {
  CLR_CONTEXT_DEFAULT_MAX_ITEMS,
  ClrElementMutation,
  ClrElementMutator,
  normalizeContextText,
  readElementMutator,
} from '@clr/angular/utils';

import { ContextRefTarget } from './context-ref-registry.service';
import { ClrMutationRefusal } from './mutation.interface';
import { writeObstacle } from './writability';
import { accessibleName } from '../dom/accessible-name';
import { resolveRole } from '../dom/roles';
import { jsonSafe } from '../json-safe';

/** The longest a label in a result or a refusal may be. */
const MAX_LABEL_LENGTH = 100;

/**
 * How a control takes a value once the engine has it:
 *
 * - `custom` — the component writes it itself, through a published `write`.
 * - `select` — the `<option>` is chosen in the DOM and the accessor supplies the value,
 *   which for an `[ngValue]` binding is an object the engine could not construct.
 * - `radiogroup` — the radio is chosen by its label and its own control takes its value.
 * - `radio` — a lone radio with a ref of its own; its control takes the radio's value.
 * - `checkbox` — a native checkbox; the control takes a boolean.
 * - `boolean`, `number`, `text` — the control takes the primitive. `boolean` is a custom
 *   control rendering a checkbox or switch.
 * - `typed` — a native date, time, month, week or colour input, which takes only the
 *   exact format the browser accepts.
 */
type ControlKind = 'custom' | 'select' | 'radiogroup' | 'radio' | 'checkbox' | 'boolean' | 'number' | 'typed' | 'text';

/** Native input types that accept only one exact string format. */
const TYPED_INPUTS: Record<string, string> = {
  date: 'YYYY-MM-DD',
  time: 'HH:MM',
  month: 'YYYY-MM',
  week: 'YYYY-W##',
  'datetime-local': 'YYYY-MM-DDTHH:MM',
  color: '#rrggbb',
};

/** An element a ref resolved to, with everything a write needs to know about it. */
export interface WriteTarget {
  /** The element carrying the form binding or the published mutator. */
  element: Element;
  /** The element carrying the role, which is what the user sees and what is checked for obstacles. */
  control: Element;
  label: string;
  type: string;
  kind: ControlKind;
  ngControl: NgControl | null;
  mutator: ClrElementMutator | null;
}

export type TargetResolution = { target: WriteTarget } | { refused: ClrMutationRefusal; detail: string };

/** A proposal turned into what the control takes, and into what a person would call it. */
export type Coerced =
  { value: unknown; display: unknown; refused?: never } | { refused: string; value?: never; display?: never };

/** What a write did, before the engine adds which operation and ref it was for. */
export interface WriteOutcome {
  applied: boolean;
  value?: unknown;
  previous?: unknown;
  status?: string;
  errors?: Record<string, unknown>;
  refused?: ClrMutationRefusal;
  detail?: string;
}

const UNBOUND_DETAIL =
  'The control has no Angular form binding (formControlName, formControl or ngModel), which is required.';

const OBSTACLE_DETAILS = {
  hidden: 'The control is not currently shown to the user, or sits behind an open modal dialog.',
  redacted: 'The control is in a region the application keeps from agents.',
  disabled: 'The control is disabled.',
  readOnly: 'The control is read-only.',
} as const;

/**
 * Finds what a ref's elements amount to: the outermost element with a form binding or a
 * published mutator is what gets written to; the innermost is what the user sees.
 * `application` is the Angular application the engine belongs to: a control another
 * application on the same page owns is that application's to fill, under its own policy.
 */
export function resolveWriteTarget(ref: ContextRefTarget, application: ApplicationRef | null): TargetResolution {
  const { elements, type } = ref;
  const control = elements[elements.length - 1];
  const obstacle = writeObstacle(control);
  if (obstacle) {
    return { refused: obstacle, detail: OBSTACLE_DETAILS[obstacle] };
  }
  const label = ref.label ?? labelOf(elements);

  for (const element of elements) {
    const mutator = readElementMutator(element);
    const ngControl = formControlOn(element);
    if (!mutator?.write && !ngControl?.control) {
      continue;
    }
    if (!sameApplication(element, application)) {
      return { refused: 'unbound', detail: 'The control belongs to another Angular application on this page.' };
    }
    if (mutator?.write) {
      return { target: { element, control, label, type, kind: 'custom', ngControl, mutator } };
    }
    const bound = ngControl?.control as AbstractControl;
    if (bound.disabled) {
      return { refused: 'disabled', detail: OBSTACLE_DETAILS.disabled };
    }
    const kind = kindFor(element, control, type) ?? (mutator?.coerce ? 'text' : null);
    if (!kind) {
      return {
        refused: 'unsupported',
        detail:
          'This custom control does not say how it is written to. It can publish a mutator (publishElementMutator from @clr/angular/utils).',
      };
    }
    if (kind === 'select' && bound.updateOn === 'submit') {
      return {
        refused: 'unsupported',
        detail: 'This select applies its value only when its form is submitted, which the engine never does.',
      };
    }
    return { target: { element, control, label, type, kind, ngControl, mutator } };
  }
  // A radio group is summarised rather than walked, so its ref is the group's; the
  // binding is on the radios inside it.
  if (resolveRole(control) === 'radiogroup') {
    const bound = radiosOf(control).find(radio => formControlOn(radio)?.control);
    if (bound) {
      if (!sameApplication(bound, application)) {
        return { refused: 'unbound', detail: 'The control belongs to another Angular application on this page.' };
      }
      const ngControl = formControlOn(bound);
      if (ngControl?.control?.disabled) {
        return { refused: 'disabled', detail: OBSTACLE_DETAILS.disabled };
      }
      return { target: { element: control, control, label, type, kind: 'radiogroup', ngControl, mutator: null } };
    }
  }
  return { refused: 'unbound', detail: UNBOUND_DETAIL };
}

/**
 * Whether the description an agent gave names the node: every word of one is a word of
 * the other ("the name field" names "Name"; "e" does not). A node without a name can
 * only be described by nothing, or by what it is ("grid").
 */
export function descriptionMatches(description: unknown, label: string, type = ''): boolean {
  if (typeof description !== 'string') {
    return false;
  }
  const given = words(description);
  if (!label) {
    return !given.length || given.every(word => words(type).includes(word));
  }
  const actual = words(label);
  if (!given.length) {
    return false;
  }
  return given.every(word => actual.includes(word)) || actual.every(word => given.includes(word));
}

/**
 * What the control would be given for a proposal, and what a person would call it: the
 * component's own coercion when it published one, the primitive its kind takes
 * otherwise. `null` proposes clearing.
 */
export function coerceValue(target: WriteTarget, proposed: unknown): Coerced {
  const mutator = target.mutator;
  if (mutator?.coerce && target.kind !== 'custom') {
    const coerced = safely(() => mutator.coerce?.(proposed));
    if (coerced.refused !== undefined) {
      return { refused: coerced.refused };
    }
    return { value: coerced.value, display: proposed === null ? plain(coerced.value) : proposed };
  }
  switch (target.kind) {
    case 'custom':
      return { value: proposed, display: proposed };
    case 'checkbox':
    case 'boolean':
      if (proposed === null) {
        return { value: false, display: false };
      }
      if (typeof proposed === 'boolean') {
        return { value: proposed, display: proposed };
      }
      if (proposed === 'true' || proposed === 'false') {
        return { value: proposed === 'true', display: proposed === 'true' };
      }
      return { refused: 'A checkbox takes true or false.' };
    case 'radio':
      if (proposed === false || proposed === 'false' || proposed === null) {
        return { refused: 'A radio cannot be unchecked on its own; set another radio in the group instead.' };
      }
      return { value: radioValue(target.element as HTMLInputElement), display: true };
    case 'radiogroup':
      return coerceRadio(target, proposed);
    case 'number':
      return coerceNumber(target, proposed);
    case 'typed':
      return coerceTyped(target, proposed);
    case 'select':
      return coerceSelect(target, proposed);
    default:
      if (proposed === null) {
        return { value: '', display: '' };
      }
      if (typeof proposed === 'string' || typeof proposed === 'number' || typeof proposed === 'boolean') {
        return { value: String(proposed), display: String(proposed) };
      }
      return { refused: 'Text is expected.' };
  }
}

/**
 * Writes a coerced value the way a user's input would arrive, then reports what is
 * true now. The control is marked dirty and touched first, as a user leaving the field
 * would leave it, so that the single value change that follows is validated, shown and
 * emitted once — `valueChanges`, `ngModelChange` and Clarity's error messages alike.
 */
export function writeValue(target: WriteTarget, coerced: { value: unknown; display: unknown }): WriteOutcome {
  const previous = readValue(target);
  const mutator = target.mutator;
  if (target.kind === 'custom') {
    const written = safely(() => mutator?.write?.(coerced.value));
    if (written.refused !== undefined) {
      return { applied: false, refused: 'invalid', detail: written.refused };
    }
    return { applied: true, previous, value: mutator?.read ? readValue(target) : plain(written.value) };
  }

  let control = target.ngControl?.control ?? null;
  if (target.kind === 'radiogroup' && coerced.value !== null) {
    control = formControlOn(coerced.value as HTMLInputElement)?.control ?? null;
  }
  if (!control) {
    return { applied: false, refused: 'unbound', detail: UNBOUND_DETAIL };
  }
  const modelBefore = serialized(control.value);
  control.markAsDirty();
  control.markAsTouched();
  if (target.kind === 'radiogroup') {
    control.setValue(coerced.value === null ? null : radioValue(coerced.value as HTMLInputElement));
  } else if (target.kind === 'select') {
    const select = target.element as HTMLSelectElement;
    const chosen = Array.isArray(coerced.value) ? (coerced.value as HTMLOptionElement[]) : [];
    for (const option of Array.from(select.options)) {
      option.selected = chosen.includes(option);
    }
    // The accessor listens for `change` and maps the option back to the bound value; a
    // control that updates on blur takes it when the field is left, as it would be.
    select.dispatchEvent(new Event('change', { bubbles: true }));
    if (control.updateOn === 'blur') {
      select.dispatchEvent(new FocusEvent('blur'));
    }
    const moved = JSON.stringify(plain(previous)) !== JSON.stringify(plain(coerced.display));
    if (moved && serialized(control.value) === modelBefore) {
      return { applied: false, refused: 'invalid', detail: 'The form control did not take the value.', previous };
    }
  } else {
    control.setValue(coerced.value);
  }

  const outcome: WriteOutcome = { applied: true, value: readValue(target), previous, status: control.status };
  const errors = jsonSafe(control.errors, 3);
  if (errors && typeof errors === 'object') {
    outcome.errors = errors as Record<string, unknown>;
  }
  return outcome;
}

/** The control's value in the terms an agent sees: labels for choices, primitives otherwise. */
export function readValue(target: WriteTarget): unknown {
  if (target.mutator?.read) {
    try {
      return plain(target.mutator.read());
    } catch {
      return null;
    }
  }
  switch (target.kind) {
    case 'select': {
      const select = target.element as HTMLSelectElement;
      const labels = Array.from(select.selectedOptions).map(option => optionLabel(option));
      return select.multiple ? labels : (labels[0] ?? null);
    }
    case 'checkbox':
    case 'radio':
      return (target.element as HTMLInputElement).checked;
    case 'radiogroup': {
      const chosen = radiosOf(target.element).find(radio => radio.checked);
      return chosen ? radioLabel(chosen) : null;
    }
    default:
      return plain(target.ngControl?.control?.value);
  }
}

/**
 * Asks Angular to check the view that shows this element on its next pass, which a view
 * under an `OnPush` parent would otherwise skip: the value it shows changed from outside.
 */
export function markViewForCheck(element: Element): void {
  try {
    getDebugNode(element)?.injector.get(ChangeDetectorRef, null)?.markForCheck();
  } catch {
    // An element Angular does not render has no view to check.
  }
}

/** The form control bound on this element itself — not one inherited from an ancestor. */
function formControlOn(element: Element): NgControl | null {
  try {
    return getDebugNode(element)?.injector.get(NgControl, null, { self: true }) ?? null;
  } catch {
    return null;
  }
}

/** Whether the element is rendered by the same Angular application as the engine. */
function sameApplication(element: Element, application: ApplicationRef | null): boolean {
  if (!application) {
    return true;
  }
  try {
    return getDebugNode(element)?.injector.get(ApplicationRef, null) === application;
  } catch {
    return false;
  }
}

/**
 * The kind of value a bound element takes. A native element says so itself; a custom
 * element carrying the binding — a third-party toggle, a slider wrapper — is judged by
 * the role of what it renders, and one whose role says nothing is not guessed at.
 */
function kindFor(bound: Element, rendered: Element, type: string): ControlKind | null {
  const tag = bound.tagName.toLowerCase();
  if (tag === 'select') {
    return 'select';
  }
  if (tag === 'textarea') {
    return 'text';
  }
  if (tag === 'input') {
    const inputType = (bound.getAttribute('type') ?? 'text').toLowerCase();
    if (inputType === 'checkbox') {
      return 'checkbox';
    }
    if (inputType === 'radio') {
      return 'radio';
    }
    if (inputType === 'number' || inputType === 'range') {
      return 'number';
    }
    return inputType in TYPED_INPUTS ? 'typed' : 'text';
  }
  switch (resolveRole(rendered) ?? type) {
    case 'checkbox':
    case 'switch':
      return 'boolean';
    case 'spinbutton':
    case 'slider':
      return 'number';
    case 'textbox':
    case 'searchbox':
      return 'text';
    default:
      return null;
  }
}

function coerceNumber(target: WriteTarget, proposed: unknown): Coerced {
  if (proposed === null) {
    return { value: null, display: null };
  }
  const number =
    typeof proposed === 'number' ? proposed : typeof proposed === 'string' && proposed.trim() ? Number(proposed) : NaN;
  if (!Number.isFinite(number)) {
    return { refused: 'A number is expected.' };
  }
  // A native input states its bounds; a range input clamps silently and Angular's min and
  // max validators do not apply to it, so a value outside them would reach the model only.
  const input = target.element.tagName.toLowerCase() === 'input' ? (target.element as HTMLInputElement) : null;
  if (input) {
    const min = input.min !== '' ? Number(input.min) : input.type === 'range' ? 0 : NaN;
    const max = input.max !== '' ? Number(input.max) : input.type === 'range' ? 100 : NaN;
    if ((Number.isFinite(min) && number < min) || (Number.isFinite(max) && number > max)) {
      const bounds = [Number.isFinite(min) ? `at least ${min}` : '', Number.isFinite(max) ? `at most ${max}` : '']
        .filter(Boolean)
        .join(' and ');
      return { refused: `The number must be ${bounds}.` };
    }
    const step = input.step && input.step !== 'any' ? Number(input.step) : NaN;
    if (Number.isFinite(step) && step > 0) {
      const offset = (number - (Number.isFinite(min) ? min : 0)) / step;
      if (Math.abs(offset - Math.round(offset)) > 1e-9) {
        return { refused: `The number must be a multiple of ${step}${Number.isFinite(min) ? ` from ${min}` : ''}.` };
      }
    }
  }
  return { value: number, display: number };
}

function coerceTyped(target: WriteTarget, proposed: unknown): Coerced {
  if (proposed === null) {
    return { value: '', display: '' };
  }
  const input = target.element as HTMLInputElement;
  const format = TYPED_INPUTS[input.type] ?? '';
  if (typeof proposed !== 'string') {
    return { refused: `A value in the form ${format} is expected.` };
  }
  // The browser's own sanitisation decides: a value it would clear is one the field
  // cannot show, and the model must not hold what the screen does not.
  const probe = input.ownerDocument.createElement('input');
  probe.type = input.type;
  probe.value = proposed;
  if (probe.value !== proposed) {
    return { refused: `A value in the form ${format} is expected.` };
  }
  return { value: proposed, display: proposed };
}

function coerceSelect(target: WriteTarget, proposed: unknown): Coerced {
  const select = target.element as HTMLSelectElement;
  if (proposed === null) {
    return { value: [], display: select.multiple ? [] : null };
  }
  if (!select.multiple && Array.isArray(proposed)) {
    return { refused: 'The select takes one option.' };
  }
  const wanted = Array.isArray(proposed) ? proposed : [proposed];
  const all = Array.from(select.options);
  const usable = all.filter(option => optionUsable(option));
  const options: HTMLOptionElement[] = [];
  for (const entry of wanted) {
    const option = all.find(candidate => optionMatches(candidate, entry));
    if (!option) {
      return { refused: `No such option. The options are: ${listLabels(usable.map(optionLabel))}.` };
    }
    if (!optionUsable(option)) {
      return { refused: `The option "${optionLabel(option)}" cannot be chosen right now.` };
    }
    options.push(option);
  }
  const labels = options.map(optionLabel);
  return { value: options, display: select.multiple ? labels : labels[0] };
}

function coerceRadio(target: WriteTarget, proposed: unknown): Coerced {
  if (proposed === null) {
    return { value: null, display: null };
  }
  const radios = radiosOf(target.element);
  const usable = radios.filter(radio => !writeObstacle(radio));
  const chosen = radios.find(
    radio => typeof proposed === 'string' && normalizeContextText(radioLabel(radio)) === normalizeContextText(proposed)
  );
  if (!chosen) {
    return { refused: `No such option. The options are: ${listLabels(usable.map(radioLabel))}.` };
  }
  if (!usable.includes(chosen)) {
    return { refused: `The option "${radioLabel(chosen)}" cannot be chosen right now.` };
  }
  return { value: chosen, display: radioLabel(chosen) };
}

/** Whether a person could pick this option: not disabled, alone or through its group, and shown. */
function optionUsable(option: HTMLOptionElement): boolean {
  return !option.disabled && !option.hidden && !option.closest('optgroup[disabled], [hidden]');
}

/** The value a radio's control receives when it is chosen: the bound one, else the DOM one. */
function radioValue(radio: HTMLInputElement): unknown {
  const accessor = formControlOn(radio)?.valueAccessor as { value?: unknown } | null | undefined;
  return accessor && 'value' in accessor && accessor.value !== undefined ? accessor.value : radio.value;
}

function radiosOf(group: Element): HTMLInputElement[] {
  return Array.from(group.querySelectorAll('input[type="radio"]'));
}

function radioLabel(radio: HTMLInputElement): string {
  return accessibleName(radio, 'radio', MAX_LABEL_LENGTH) || radio.value;
}

/**
 * The name a node is known by when the snapshot gave it none: the accessible name of
 * the element carrying the role, or of the host that renders it.
 */
function labelOf(elements: Element[]): string {
  for (let index = elements.length - 1; index >= 0; index--) {
    const element = elements[index];
    const name = accessibleName(element, resolveRole(element), MAX_LABEL_LENGTH);
    if (name) {
      return name;
    }
  }
  return '';
}

function optionMatches(option: HTMLOptionElement, proposed: unknown): boolean {
  if (typeof proposed !== 'string') {
    return false;
  }
  const wanted = normalizeContextText(proposed);
  return normalizeContextText(optionLabel(option)) === wanted || normalizeContextText(option.value) === wanted;
}

function optionLabel(option: HTMLOptionElement): string {
  return (option.label || option.text).trim();
}

function listLabels(labels: string[]): string {
  const named = labels.filter(Boolean);
  const listed = named.slice(0, CLR_CONTEXT_DEFAULT_MAX_ITEMS).map(label => `"${label}"`);
  return named.length > CLR_CONTEXT_DEFAULT_MAX_ITEMS
    ? `${listed.join(', ')} and ${named.length - CLR_CONTEXT_DEFAULT_MAX_ITEMS} more`
    : listed.join(', ');
}

/** The words of a text, for comparing descriptions: letters and digits, lowercased. */
function words(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

/** A value as a result reports it: its plain, serialisable part, with an empty selection kept as `[]`. */
function plain(value: unknown): unknown {
  if (value === undefined || value === null) {
    return null;
  }
  const safe = jsonSafe(value, 3, true);
  return safe === undefined ? String(value) : safe;
}

function serialized(value: unknown): string {
  try {
    return JSON.stringify(value) ?? '';
  } catch {
    return String(value);
  }
}

/** A component's own coercion or write, with a throw reported as a refusal rather than propagated. */
function safely(operation: () => ClrElementMutation | undefined): ClrElementMutation {
  try {
    const outcome = operation();
    if (outcome && typeof outcome === 'object' && ('value' in outcome || 'refused' in outcome)) {
      return outcome;
    }
    return { refused: 'The component did not say what it would take.' };
  } catch (error) {
    return { refused: error instanceof Error ? error.message : 'The component refused the value.' };
  }
}
