/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { getDebugNode } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ClrElementMutation, ClrElementMutator, readElementMutator } from '@clr/angular/utils';

import { ContextRefTarget } from './context-ref-registry.service';
import { ClrElementMutationResult, ClrMutationRefusal } from './mutation.interface';
import { writeObstacle } from './writability';
import { accessibleName } from '../dom/accessible-name';
import { resolveRole } from '../dom/roles';
import { jsonSafe } from '../json-safe';

/** How many option labels a refusal lists before it stops. */
const MAX_LISTED_CHOICES = 25;

/** The longest a label in a result or a refusal may be. */
const MAX_LABEL_LENGTH = 100;

/**
 * How a control takes a value once the engine has it:
 *
 * - `custom` — the component writes it itself, through a published `write`.
 * - `select` — the `<option>` is chosen in the DOM and the accessor supplies the value,
 *   which for an `[ngValue]` binding is an object the engine could not construct.
 * - `radiogroup` — the radio is chosen by its label and its own control takes its value.
 * - `checkbox`, `radio`, `number`, `text` — the form control takes the primitive.
 */
type ControlKind = 'custom' | 'select' | 'checkbox' | 'radio' | 'radiogroup' | 'number' | 'text';

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

/**
 * Finds what a ref's elements amount to: the outermost element with a form binding or a
 * published mutator is what gets written to; the innermost is what the user sees.
 */
export function resolveWriteTarget(ref: ContextRefTarget): TargetResolution {
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
    if (mutator?.write) {
      return { target: { element, control, label, type, kind: 'custom', ngControl, mutator } };
    }
    if (ngControl?.control) {
      return { target: { element, control, label, type, kind: kindOf(element), ngControl, mutator } };
    }
  }
  // A radio group is summarised rather than walked, so its ref is the group's; the
  // binding is on the radios inside it.
  if (resolveRole(control) === 'radiogroup') {
    const bound = radiosOf(control).find(radio => formControlOn(radio)?.control);
    if (bound) {
      return {
        target: {
          element: control,
          control,
          label,
          type,
          kind: 'radiogroup',
          ngControl: formControlOn(bound),
          mutator: null,
        },
      };
    }
  }
  return { refused: 'unbound', detail: UNBOUND_DETAIL };
}

const UNBOUND_DETAIL =
  'The control has no Angular form binding (formControlName, formControl or ngModel), which is required.';

const OBSTACLE_DETAILS = {
  hidden: 'The control is not currently shown to the user.',
  redacted: 'The control is in a region the application keeps from agents.',
  disabled: 'The control is disabled.',
  readOnly: 'The control is read-only.',
} as const;

/**
 * Whether the description an agent gave matches the node's actual name: both normalised,
 * equal or one containing the other. A node without a name has nothing to check against.
 */
export function descriptionMatches(description: unknown, label: string): boolean {
  if (!label) {
    return true;
  }
  if (typeof description !== 'string') {
    return false;
  }
  const given = normalise(description);
  const actual = normalise(label);
  return !!given && (given === actual || actual.includes(given) || given.includes(actual));
}

/**
 * What the control would be given for a proposal: the component's own coercion when it
 * published one, the primitive its kind takes otherwise. `null` proposes clearing.
 */
export function coerceValue(target: WriteTarget, proposed: unknown): ClrElementMutation {
  const mutator = target.mutator;
  if (mutator?.coerce) {
    return safely(() => mutator.coerce?.(proposed));
  }
  if (proposed === null) {
    return { value: target.kind === 'text' ? '' : null };
  }
  switch (target.kind) {
    case 'checkbox':
      if (typeof proposed === 'boolean') {
        return { value: proposed };
      }
      if (proposed === 'true' || proposed === 'false') {
        return { value: proposed === 'true' };
      }
      return { refused: 'A checkbox takes true or false.' };
    case 'radio':
      if (proposed === false || proposed === 'false') {
        return { refused: 'A radio cannot be unchecked on its own; set another radio in the group instead.' };
      }
      return { value: radioValue(target.element as HTMLInputElement) };
    case 'radiogroup': {
      const radios = radiosOf(target.element);
      const chosen = radios.find(
        radio => typeof proposed === 'string' && normalise(radioLabel(radio)) === normalise(proposed)
      );
      if (!chosen) {
        return { refused: `No such option. The options are: ${listLabels(radios.map(radio => radioLabel(radio)))}.` };
      }
      return { value: chosen };
    }
    case 'number': {
      const number = typeof proposed === 'number' ? proposed : typeof proposed === 'string' ? Number(proposed) : NaN;
      if (typeof proposed === 'string' && !proposed.trim()) {
        return { refused: 'A number is expected.' };
      }
      return Number.isFinite(number) ? { value: number } : { refused: 'A number is expected.' };
    }
    case 'select': {
      const select = target.element as HTMLSelectElement;
      const wanted = select.multiple ? (Array.isArray(proposed) ? proposed : [proposed]) : [proposed];
      if (!select.multiple && Array.isArray(proposed)) {
        return { refused: 'The select takes one option.' };
      }
      const options: HTMLOptionElement[] = [];
      for (const entry of wanted) {
        const option = Array.from(select.options).find(candidate => optionMatches(candidate, entry));
        if (!option) {
          return { refused: `No such option. The options are: ${listChoices(Array.from(select.options))}.` };
        }
        options.push(option);
      }
      return { value: options };
    }
    case 'custom':
      return { value: proposed };
    default:
      if (typeof proposed === 'string' || typeof proposed === 'number' || typeof proposed === 'boolean') {
        return { value: String(proposed) };
      }
      return { refused: 'Text is expected.' };
  }
}

/**
 * Writes a coerced value the way a user's input would arrive, then reports what is
 * true now. Through the form control, so the accessor updates the view and
 * `ngModelChange` fires — once — and with the control marked dirty and touched, so that
 * validation messages show as they would after a user left the field.
 */
export function writeValue(target: WriteTarget, coerced: unknown): ClrElementMutationResult {
  const previous = readValue(target);
  const mutator = target.mutator;
  if (target.kind === 'custom') {
    const written = safely(() => mutator?.write?.(coerced));
    if (written.refused !== undefined) {
      return { operation: 'setValue', ref: '', applied: false, refused: 'invalid', detail: written.refused };
    }
    const result: ClrElementMutationResult = { operation: 'setValue', ref: '', applied: true, previous };
    result.value = mutator?.read ? readValue(target) : jsonSafe(written.value, 3);
    return result;
  }

  let control = target.ngControl?.control;
  if (target.kind === 'radiogroup') {
    const radio = coerced as HTMLInputElement;
    control = formControlOn(radio)?.control;
  }
  if (!control) {
    return { operation: 'setValue', ref: '', applied: false, refused: 'unbound', detail: UNBOUND_DETAIL };
  }
  if (target.kind === 'radiogroup') {
    control.setValue(radioValue(coerced as HTMLInputElement));
  } else if (target.kind === 'select') {
    const select = target.element as HTMLSelectElement;
    const chosen = Array.isArray(coerced) ? (coerced as HTMLOptionElement[]) : [];
    for (const option of Array.from(select.options)) {
      option.selected = chosen.includes(option);
    }
    // The accessor listens for `change` and maps the option back to the bound value.
    select.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    control.setValue(coerced);
  }
  control.markAsDirty();
  control.markAsTouched();
  control.updateValueAndValidity();

  const result: ClrElementMutationResult = {
    operation: 'setValue',
    ref: '',
    applied: true,
    value: readValue(target),
    previous,
    status: control.status,
  };
  const errors = jsonSafe(control.errors, 3);
  if (errors && typeof errors === 'object') {
    result.errors = errors as Record<string, unknown>;
  }
  return result;
}

/** The control's value in the terms an agent sees: labels for choices, primitives otherwise. */
export function readValue(target: WriteTarget): unknown {
  if (target.mutator?.read) {
    try {
      return jsonSafe(target.mutator.read(), 3) ?? null;
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
      return (target.element as HTMLInputElement).checked;
    case 'radio':
      return (target.element as HTMLInputElement).checked;
    case 'radiogroup': {
      const chosen = radiosOf(target.element).find(radio => radio.checked);
      return chosen ? radioLabel(chosen) : null;
    }
    default: {
      const value = target.ngControl?.control?.value;
      if (value === undefined) {
        return null;
      }
      const safe = jsonSafe(value, 3);
      return safe === undefined ? String(value) : safe;
    }
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

function kindOf(element: Element): ControlKind {
  const tag = element.tagName.toLowerCase();
  if (tag === 'select') {
    return 'select';
  }
  if (tag === 'input') {
    const type = (element.getAttribute('type') ?? 'text').toLowerCase();
    if (type === 'checkbox') {
      return 'checkbox';
    }
    if (type === 'radio') {
      return 'radio';
    }
    if (type === 'number' || type === 'range') {
      return 'number';
    }
  }
  return 'text';
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
  const wanted = normalise(proposed);
  return normalise(optionLabel(option)) === wanted || normalise(option.value) === wanted;
}

function optionLabel(option: HTMLOptionElement): string {
  return (option.label || option.text).trim();
}

function listChoices(options: HTMLOptionElement[]): string {
  return listLabels(options.map(option => optionLabel(option)));
}

function listLabels(labels: string[]): string {
  const named = labels.filter(Boolean);
  const listed = named.slice(0, MAX_LISTED_CHOICES).map(label => `"${label}"`);
  return named.length > MAX_LISTED_CHOICES
    ? `${listed.join(', ')} and ${named.length - MAX_LISTED_CHOICES} more`
    : listed.join(', ');
}

function normalise(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
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
