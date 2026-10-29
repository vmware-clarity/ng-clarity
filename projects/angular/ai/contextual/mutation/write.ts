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
  CLR_CONTEXT_WITHHELD_SELECTOR,
  ClrContextSnapshotOptions,
  ClrElementMutation,
  ClrElementMutator,
  normalizeContextText,
  usableSelectors,
} from '@clr/angular/utils';

import { ContextRefTarget } from './context-ref-registry.service';
import { ClrMutationRefusal } from './mutation.interface';
import { DISTINGUISHING_WORDS, FILLER_WORDS, NATIVE_CONTROLS, NEGATING_WORDS, TYPED_INPUTS } from './tables';
import { writeObstacle } from './writability';
import { attempt } from '../attempt';
import { accessibleName } from '../dom/accessible-name';
import { readElementMutator } from '../dom/element-mutator';
import { resolveRole } from '../dom/roles';
import { isRedactedWithin } from '../dom/visibility';
import { jsonSafe, STATE_DEPTH } from '../json-safe';
import { ownEntry } from '../lookup';
import { CLR_CONTEXT_DEFAULT_OPTIONS } from '../snapshot-options';

const MAX_LABEL_LENGTH = CLR_CONTEXT_DEFAULT_OPTIONS.maxTextLength;

/**
 * How a control takes a value: written by the component (`custom`), chosen in the DOM (`select`,
 * radios), or set on the form control as a primitive or in a browser-exact format (`typed`).
 */
type ControlKind =
  'custom' | 'select' | 'radiogroup' | 'radio' | 'choice' | 'checkbox' | 'boolean' | 'number' | 'typed' | 'text';

export interface WriteTarget {
  element: Element;
  /** The element with the role: what the user sees and what is checked for obstacles. */
  control: Element;
  label: string;
  /** The label read from the page now; a ref keeps the one its snapshot showed. */
  shownLabel: string;
  type: string;
  kind: ControlKind;
  ngControl: NgControl | null;
  mutator: ClrElementMutator | null;
  options?: Required<ClrContextSnapshotOptions>;
  /** The only modal dialogs that count as obstacles, when not all open ones do. */
  knownModals?: ReadonlySet<Element>;
}

export type TargetResolution = { target: WriteTarget } | { refused: ClrMutationRefusal; detail: string };

export type Coerced =
  { value: unknown; display: unknown; refused?: never } | { refused: string; value?: never; display?: never };

export interface WriteOutcome {
  applied: boolean;
  value?: unknown;
  previous?: unknown;
  status?: string;
  errors?: Record<string, unknown>;
  refused?: ClrMutationRefusal;
  detail?: string;
}

/**
 * Private fields of Angular's select accessors (verified against `@angular/forms` 21.2);
 * write.spec.ts fails if they are renamed.
 */
interface SelectAccessor {
  onChange?: (value: unknown) => void;
  onTouched?: () => void;
}

type BoundSelectAccessor = SelectAccessor & { onChange: (value: unknown) => void };

const UNSUPPORTED_SELECT_DETAIL =
  'The select is bound through an accessor the engine cannot hand a choice to. Publish a mutator for it.';

const UNBOUND_DETAIL =
  'The control has no Angular form binding (formControlName, formControl or ngModel), which is required.';

const KEPT_CHOICE_DETAIL = 'The current choice is kept from agents, and cannot be changed by one.';

const STRUCTURED_VALUE_DETAIL =
  'The control holds an object or a list, which the value its role suggests would replace. It can publish a mutator (publishElementMutator from @clr/angular/utils).';

const CHOICE_VALUE_DETAIL =
  'The group holds something other than one of its radios’ labels, so choosing one by its label would store the wrong thing. It can publish a mutator (publishElementMutator from @clr/angular/utils).';

const OBSTACLE_DETAILS = {
  hidden: 'The control is not currently shown to the user, or sits behind an open modal dialog.',
  redacted: 'The control is in a region the application keeps from agents.',
  disabled: 'The control is disabled.',
  readOnly: 'The control is read-only.',
} as const;

/**
 * The outermost bound element is written to; the innermost is what the user sees. A control
 * owned by another Angular application on the page is that application's to fill.
 */
export function resolveWriteTarget(
  ref: ContextRefTarget,
  application: ApplicationRef | null,
  options?: Required<ClrContextSnapshotOptions>,
  knownModals?: ReadonlySet<Element>
): TargetResolution {
  const { elements, type } = ref;
  const control = elements[elements.length - 1];
  const obstacle = writeObstacle(control, knownModals);
  if (obstacle) {
    return { refused: obstacle, detail: OBSTACLE_DETAILS[obstacle] };
  }
  const shownLabel = labelOf(elements, withheldBy(control, options));
  const label = ref.label ?? shownLabel;
  const targetOf = (
    element: Element,
    kind: ControlKind,
    ngControl: NgControl | null,
    mutator: ClrElementMutator | null
  ): TargetResolution => ({
    target: { element, control, label, shownLabel, type, kind, ngControl, mutator, options, knownModals },
  });

  const element = boundElementOf(elements);
  if (element) {
    const mutator = readElementMutator(element);
    const ngControl = formControlOn(element);
    const bound = ngControl?.control;
    const refusal = bindingRefusal(element, mutator?.write ? null : bound, application);
    if (refusal) {
      return refusal;
    }
    if (mutator?.write) {
      return targetOf(element, 'custom', ngControl, mutator);
    }
    const kind = kindFor(element, control, type) ?? (mutator?.coerce ? 'text' : null);
    if (!kind) {
      return {
        refused: 'unsupported',
        detail:
          'This custom control does not say how it is written to. It can publish a mutator (publishElementMutator from @clr/angular/utils).',
      };
    }
    if (kind === 'select' && bound?.updateOn === 'submit') {
      return {
        refused: 'unsupported',
        detail: 'This select applies its value only when its form is submitted, which the engine never does.',
      };
    }
    // A custom control judged by its role holds text; one whose model holds an object would get a string.
    if (!NATIVE_CONTROLS.has(element.tagName.toLowerCase()) && !mutator?.coerce && isStructured(bound?.value)) {
      return { refused: 'unsupported', detail: STRUCTURED_VALUE_DETAIL };
    }
    if (kind === 'choice' && !holdsChoiceLabel(control, bound?.value)) {
      return { refused: 'unsupported', detail: CHOICE_VALUE_DETAIL };
    }
    return targetOf(element, kind, ngControl, mutator);
  }
  const radio = boundRadioOf(control);
  if (radio) {
    const ngControl = formControlOn(radio);
    return bindingRefusal(radio, ngControl?.control, application) ?? targetOf(control, 'radiogroup', ngControl, null);
  }
  return { refused: 'unbound', detail: UNBOUND_DETAIL };
}

/** Whether a node could be written to at all; disabled and similar states are judged at write time. */
export function offersWrite(ref: ContextRefTarget): boolean {
  return !!boundElementOf(ref.elements) || !!boundRadioOf(ref.elements[ref.elements.length - 1]);
}

function boundElementOf(elements: Element[]): Element | undefined {
  return elements.find(element => readElementMutator(element)?.write || formControlOn(element)?.control);
}

/** A radio group is summarised, so its ref is the group's while the binding is on the radios. */
function boundRadioOf(control: Element): HTMLInputElement | undefined {
  return resolveRole(control) === 'radiogroup'
    ? radiosOf(control).find(each => formControlOn(each)?.control)
    : undefined;
}

function bindingRefusal(
  element: Element,
  bound: AbstractControl | null | undefined,
  application: ApplicationRef | null
): TargetResolution | null {
  if (!sameApplication(element, application)) {
    return { refused: 'unbound', detail: 'The control belongs to another Angular application on this page.' };
  }
  return bound?.disabled ? { refused: 'disabled', detail: OBSTACLE_DETAILS.disabled } : null;
}

/**
 * Whether the description names the node: every word of the label, plus only filler. Requiring every word
 * tells "Email" from "Confirm email" in any language; a label cut with "…" is matched on the words kept.
 */
export function descriptionMatches(description: unknown, label: string, type = ''): boolean {
  if (typeof description !== 'string') {
    return false;
  }
  const typeWords = words(type);
  const given = words(description);
  if (!label) {
    return !given.length || given.every(word => typeWords.includes(word));
  }
  const labelWords = words(label);
  if (!given.length || given.some(word => NEGATING_WORDS.has(word) && !labelWords.includes(word))) {
    return false;
  }
  const cut = label.trimEnd().endsWith('…');
  // The last word of a cut label may itself be cut.
  const actual = cut ? labelWords.slice(0, -1) : labelWords;
  // A distinguishing word must be said even when the type contains it ("start" in `date-range-start`).
  if (actual.some(word => (DISTINGUISHING_WORDS.has(word) || NEGATING_WORDS.has(word)) && !given.includes(word))) {
    return false;
  }
  const said = actual.every(word => given.includes(word) || FILLER_WORDS.has(word) || typeWords.includes(word));
  if (cut) {
    return said;
  }
  const extra = given.some(word => !actual.includes(word) && !FILLER_WORDS.has(word) && !typeWords.includes(word));
  return said && given.some(word => actual.includes(word)) && !extra;
}

/**
 * What the form control will receive, where known before writing. A component that translates
 * the value itself is not asked: its model may hold what it keeps from agents.
 */
export function modelValueOf(target: WriteTarget, value: unknown): unknown {
  if (target.kind === 'radiogroup') {
    return value === null ? null : radioValue(value as HTMLInputElement);
  }
  return target.kind === 'select' || target.mutator?.coerce ? undefined : value;
}

/** What the control would be given for a proposal, and what a person would call it; `null` clears. */
export function coerceValue(target: WriteTarget, proposed: unknown): Coerced {
  const mutator = target.mutator;
  if (mutator?.coerce) {
    const coerced = safely(() => mutator.coerce?.(proposed, target.options));
    if (coerced.refused !== undefined) {
      return { refused: coerced.refused };
    }
    // The policy is shown the component's display value, never the model, which may hold an unseen selection.
    if (coerced.display !== undefined) {
      return { value: coerced.value, display: plain(coerced.display) };
    }
    return {
      value: coerced.value,
      display: target.kind === 'custom' || proposed === null ? plain(coerced.value) : proposed,
    };
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
    case 'choice':
      return coerceChoice(target, proposed);
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
        const text = String(proposed);
        // The model must not hold more than the field's `maxlength` would let a person type.
        const limit = maxLengthOf(target.element);
        if (limit !== null && text.length > limit) {
          return { refused: `The text must be at most ${limit} characters.` };
        }
        return { value: text, display: text };
      }
      return { refused: 'Text is expected.' };
  }
}

function maxLengthOf(element: Element): number | null {
  const tagName = element.tagName.toLowerCase();
  if (tagName !== 'input' && tagName !== 'textarea') {
    return null;
  }
  const limit = (element as HTMLInputElement | HTMLTextAreaElement).maxLength;
  return limit >= 0 ? limit : null;
}

/**
 * Writes the value as user input would arrive. Marked dirty and touched first, so the change is validated,
 * shown and emitted once.
 */
export function writeValue(target: WriteTarget, coerced: { value: unknown; display: unknown }): WriteOutcome {
  const previous = readValue(target);
  const mutator = target.mutator;
  if (target.kind === 'custom') {
    const written = safely(() => mutator?.write?.(coerced.value, target.options));
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
  const accessor = selectAccessorOf(target);
  if (target.kind === 'select' && !accessor) {
    return { applied: false, refused: 'unsupported', detail: UNSUPPORTED_SELECT_DETAIL, previous };
  }
  const valueBefore: unknown = control.value;
  const modelBefore = serialized(valueBefore);
  // A refused or throwing write leaves the control as the user left it.
  const wasDirty = control.dirty;
  const wasTouched = control.touched;
  const rollback = (bound: AbstractControl) => {
    if (!wasDirty) {
      bound.markAsPristine();
    }
    if (!wasTouched) {
      bound.markAsUntouched();
    }
  };
  control.markAsDirty();
  control.markAsTouched();
  try {
    if (target.kind === 'radiogroup') {
      control.setValue(coerced.value === null ? null : radioValue(coerced.value as HTMLInputElement));
    } else if (
      target.kind === 'select' &&
      !(target.element as HTMLSelectElement).multiple &&
      coerced.display === null
    ) {
      // A one-line select re-chooses its first option, so a cleared one is told through its control.
      control.setValue(null);
    } else if (target.kind === 'select' && accessor) {
      const taken = writeSelect(target.element as HTMLSelectElement, control, accessor, coerced, previous, modelBefore);
      if (!taken) {
        rollback(control);
        return { applied: false, refused: 'invalid', detail: 'The form control did not take the value.', previous };
      }
    } else {
      control.setValue(coerced.value);
    }
  } catch (error) {
    // `setValue` updates the view before validating, so a throw is undone quietly.
    try {
      control.setValue(valueBefore, { emitEvent: false });
    } catch {
      control.setValue(valueBefore, { emitModelToViewChange: false, emitEvent: false });
    }
    rollback(control);
    throw error;
  }

  const outcome: WriteOutcome = { applied: true, value: readValue(target), previous, status: control.status };
  const errors = jsonSafe(control.errors, STATE_DEPTH);
  if (errors && typeof errors === 'object') {
    outcome.errors = errors as Record<string, unknown>;
  }
  return outcome;
}

function selectAccessorOf(target: WriteTarget): BoundSelectAccessor | null {
  const accessor = target.ngControl?.valueAccessor as SelectAccessor | null | undefined;
  return typeof accessor?.onChange === 'function' ? (accessor as BoundSelectAccessor) : null;
}

/**
 * Hands the chosen options to the accessor as its `change` listener would, without dispatching DOM events
 * that would run the application's own handlers.
 */
function writeSelect(
  select: HTMLSelectElement,
  control: AbstractControl,
  accessor: BoundSelectAccessor,
  coerced: { value: unknown; display: unknown },
  previous: unknown,
  modelBefore: string
): boolean {
  const options = Array.from(select.options);
  const shown = options.map(option => option.selected);
  const restore = () => options.forEach((option, index) => (option.selected = shown[index]));
  const chosen = Array.isArray(coerced.value) ? coerced.value : [];
  options.forEach(option => (option.selected = chosen.includes(option)));
  try {
    accessor.onChange(select.multiple ? select : select.value);
    if (control.updateOn === 'blur') {
      accessor.onTouched?.();
    }
  } catch (error) {
    restore();
    throw error;
  }
  const moved = JSON.stringify(plain(previous)) !== JSON.stringify(plain(coerced.display));
  if (moved && serialized(control.value) === modelBefore) {
    restore();
    return false;
  }
  return true;
}

export function readValue(target: WriteTarget): unknown {
  const mutator = target.mutator;
  if (mutator?.read) {
    return attempt(() => plain(mutator.read?.(target.options)), null);
  }
  switch (target.kind) {
    case 'select': {
      const select = target.element as HTMLSelectElement;
      const labels = Array.from(select.selectedOptions)
        .filter(option => choiceShown(option, target))
        .map(option => optionLabel(option));
      return select.multiple ? labels : (labels[0] ?? null);
    }
    case 'checkbox':
    case 'radio':
      return (target.element as HTMLInputElement).checked;
    case 'radiogroup': {
      const chosen = radiosOf(target.element).find(radio => radio.checked && choiceShown(radio, target));
      return chosen ? radioLabelWithin(chosen, withheldBy(target.element, target.options)) : null;
    }
    default:
      return plain(target.ngControl?.control?.value);
  }
}

/** Marks the view for check, which an `OnPush` parent would otherwise skip. */
export function markViewForCheck(element: Element): void {
  // An element Angular does not render has no view to check.
  attempt(() => getDebugNode(element)?.injector.get(ChangeDetectorRef, null)?.markForCheck(), undefined);
}

function formControlOn(element: Element): NgControl | null {
  return attempt(() => getDebugNode(element)?.injector.get(NgControl, null, { self: true }) ?? null, null);
}

function sameApplication(element: Element, application: ApplicationRef | null): boolean {
  if (!application) {
    return true;
  }
  return attempt(() => getDebugNode(element)?.injector.get(ApplicationRef, null) === application, false);
}

/** A custom element is judged by the role of what it renders; a role that says nothing is not guessed at. */
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
    return ownEntry(TYPED_INPUTS, inputType) ? 'typed' : 'text';
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
    case 'radiogroup':
      return 'choice';
    default:
      return null;
  }
}

function coerceNumber(target: WriteTarget, proposed: unknown): Coerced {
  if (proposed === null) {
    return { value: null, display: null };
  }
  const blank = typeof proposed === 'string' && !proposed.trim();
  const number = blank ? NaN : typeof proposed === 'string' ? Number(proposed) : proposed;
  if (typeof number !== 'number' || !Number.isFinite(number)) {
    return { refused: 'A number is expected.' };
  }
  // A range input clamps silently and Angular's min/max validators skip it, so bounds are checked here.
  const input = target.element.tagName.toLowerCase() === 'input' ? (target.element as HTMLInputElement) : null;
  const [min, max] = input
    ? nativeBounds(input)
    : [ariaBound(target.control, 'aria-valuemin'), ariaBound(target.control, 'aria-valuemax')];
  if ((Number.isFinite(min) && number < min) || (Number.isFinite(max) && number > max)) {
    const bounds = [Number.isFinite(min) ? `at least ${min}` : '', Number.isFinite(max) ? `at most ${max}` : '']
      .filter(Boolean)
      .join(' and ');
    return { refused: `The number must be ${bounds}.` };
  }
  if (input) {
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

function nativeBounds(input: HTMLInputElement): [number, number] {
  const [min, max] = input.type === 'range' ? [0, 100] : [NaN, NaN];
  return [input.min !== '' ? Number(input.min) : min, input.max !== '' ? Number(input.max) : max];
}

function ariaBound(element: Element, attribute: string): number {
  const raw = element.getAttribute(attribute);
  return raw?.trim() ? Number(raw) : NaN;
}

function coerceTyped(target: WriteTarget, proposed: unknown): Coerced {
  if (proposed === null) {
    return { value: '', display: '' };
  }
  const input = target.element as HTMLInputElement;
  const format = ownEntry(TYPED_INPUTS, input.type) ?? '';
  if (typeof proposed !== 'string') {
    return { refused: `A value in the form ${format} is expected.` };
  }
  // The browser's sanitisation decides: the model must not hold what the field cannot show.
  const probe = input.ownerDocument.createElement('input');
  probe.type = input.type;
  probe.value = proposed;
  // A colour input lowercases, so compare in lowercase.
  const sameValue = input.type === 'color' ? probe.value === proposed.toLowerCase() : probe.value === proposed;
  if (!sameValue) {
    return { refused: `A value in the form ${format} is expected.` };
  }
  return { value: probe.value, display: probe.value };
}

function coerceSelect(target: WriteTarget, proposed: unknown): Coerced {
  const select = target.element as HTMLSelectElement;
  // An option the snapshot left out that is selected stays selected.
  const kept = select.multiple ? Array.from(select.selectedOptions).filter(option => !choiceShown(option, target)) : [];
  // Replacing a choice the agent was never shown would change what it cannot see or undo.
  if (!select.multiple && Array.from(select.selectedOptions).some(option => choiceKept(option, target))) {
    return { refused: KEPT_CHOICE_DETAIL };
  }
  if (proposed === null) {
    return { value: kept, display: select.multiple ? [] : null };
  }
  if (!select.multiple && Array.isArray(proposed)) {
    return { refused: 'The select takes one option.' };
  }
  const wanted = Array.isArray(proposed) ? proposed : [proposed];
  const all = Array.from(select.options).filter(option => choiceShown(option, target));
  const usable = all.filter(option => optionUsable(option));
  const options: HTMLOptionElement[] = [];
  for (const entry of wanted) {
    const matches = all.filter(candidate => optionMatches(candidate, entry));
    // Two options can read the same: only a value naming exactly one tells which.
    const byValue = matches.filter(
      candidate => typeof entry === 'string' && normalizeContextText(candidate.value) === normalizeContextText(entry)
    );
    const option = matches.length > 1 ? (byValue.length === 1 ? byValue[0] : undefined) : matches[0];
    if (matches.length > 1 && !option) {
      return {
        refused: `Several options read "${String(entry)}", and nothing tells which one is meant. Leave this choice to the user.`,
      };
    }
    if (!option) {
      return { refused: `No such option. The options are: ${listLabels(usable.map(optionLabel))}.` };
    }
    if (!optionUsable(option)) {
      return { refused: `The option "${optionLabel(option)}" cannot be chosen right now.` };
    }
    options.push(option);
  }
  const labels = options.map(optionLabel);
  return { value: [...kept, ...options], display: select.multiple ? labels : labels[0] };
}

function coerceRadio(target: WriteTarget, proposed: unknown): Coerced {
  if (radiosOf(target.element).some(radio => radio.checked && choiceKept(radio, target))) {
    return { refused: KEPT_CHOICE_DETAIL };
  }
  if (proposed === null) {
    return { value: null, display: null };
  }
  const radios = radiosOf(target.element).filter(radio => choiceShown(radio, target));
  const withheld = withheldBy(target.element, target.options);
  const radioLabel = (radio: HTMLInputElement) => radioLabelWithin(radio, withheld);
  const usable = radios.filter(radio => !writeObstacle(radio, target.knownModals));
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

function coerceChoice(target: WriteTarget, proposed: unknown): Coerced {
  const radios = customRadiosOf(target.control);
  if (radios.some(radio => radio.getAttribute('aria-checked') === 'true' && choiceKept(radio, target))) {
    return { refused: KEPT_CHOICE_DETAIL };
  }
  if (proposed === null) {
    return { value: null, display: null };
  }
  const withheld = withheldBy(target.control, target.options);
  const shown = radios.filter(radio => choiceShown(radio, target));
  const usable = shown.filter(radio => !writeObstacle(radio, target.knownModals));
  const labelOfRadio = (radio: Element) => accessibleName(radio, 'radio', MAX_LABEL_LENGTH, withheld);
  const chosen = shown.find(
    radio =>
      typeof proposed === 'string' && normalizeContextText(labelOfRadio(radio)) === normalizeContextText(proposed)
  );
  if (!chosen) {
    return { refused: `No such option. The options are: ${listLabels(usable.map(labelOfRadio))}.` };
  }
  const label = labelOfRadio(chosen);
  if (!usable.includes(chosen)) {
    return { refused: `The option "${label}" cannot be chosen right now.` };
  }
  return { value: label, display: label };
}

function holdsChoiceLabel(group: Element, value: unknown): boolean {
  if (value === null || value === undefined || value === '') {
    return true;
  }
  const labels = customRadiosOf(group).map(radio =>
    normalizeContextText(accessibleName(radio, 'radio', MAX_LABEL_LENGTH))
  );
  return typeof value === 'string' && labels.includes(normalizeContextText(value));
}

function customRadiosOf(group: Element): Element[] {
  return Array.from(group.querySelectorAll('[role="radio"]'));
}

function isStructured(value: unknown): boolean {
  return value !== null && typeof value === 'object';
}

/** Excluded or redacted, as opposed to merely hidden: a hidden "Choose…" placeholder may be replaced. */
function choiceKept(choice: Element, target: WriteTarget): boolean {
  const excluded = withheldBy(choice, target.options);
  if (excluded && choice.closest(excluded)) {
    return true;
  }
  return isRedactedWithin(choice, target.control);
}

function choiceShown(choice: Element, target: WriteTarget): boolean {
  return !choiceKept(choice, target) && !choice.matches(CLR_CONTEXT_WITHHELD_SELECTOR);
}

function optionUsable(option: HTMLOptionElement): boolean {
  return !option.disabled && !option.hidden && !option.closest('optgroup[disabled], [hidden]');
}

function radioValue(radio: HTMLInputElement): unknown {
  const accessor = formControlOn(radio)?.valueAccessor as { value?: unknown } | null | undefined;
  return accessor && 'value' in accessor && accessor.value !== undefined ? accessor.value : radio.value;
}

function radiosOf(group: Element): HTMLInputElement[] {
  return Array.from(group.querySelectorAll('input[type="radio"]'));
}

function radioLabelWithin(radio: HTMLInputElement, withheld = ''): string {
  return accessibleName(radio, 'radio', MAX_LABEL_LENGTH, withheld) || radio.value;
}

function withheldBy(element: Element, options?: Required<ClrContextSnapshotOptions>): string {
  return options ? usableSelectors(element.ownerDocument, options.excludeSelectors) : '';
}

function labelOf(elements: Element[], withheld: string): string {
  for (let index = elements.length - 1; index >= 0; index--) {
    const element = elements[index];
    const name = accessibleName(element, resolveRole(element), MAX_LABEL_LENGTH, withheld);
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

function words(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

function plain(value: unknown): unknown {
  if (value === undefined || value === null) {
    return null;
  }
  const safe = jsonSafe(value, STATE_DEPTH, true);
  return safe === undefined ? String(value) : safe;
}

function serialized(value: unknown): string {
  try {
    return JSON.stringify(value) ?? '';
  } catch {
    return String(value);
  }
}

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
