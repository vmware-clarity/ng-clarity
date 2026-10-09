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
  CLR_CONTEXT_REDACT_SELECTOR,
  CLR_CONTEXT_WITHHELD_SELECTOR,
  ClrContextSnapshotOptions,
  ClrElementMutation,
  ClrElementMutator,
  clrNormalizeContextText,
  clrUsableSelectors,
} from '@clr/angular/utils';

import { ContextRefTarget } from './context-ref-registry.service';
import { ClrMutationRefusal } from './mutation.interface';
import { writeObstacle } from './writability';
import { accessibleName } from '../dom/accessible-name';
import { readElementMutator } from '../dom/element-mutator';
import { resolveRole } from '../dom/roles';
import { jsonSafe, STATE_DEPTH } from '../json-safe';
import { ownEntry } from '../lookup';
import { CLR_CONTEXT_DEFAULT_OPTIONS } from '../snapshot-options';

/** The longest a label in a result or a refusal may be: the default text budget. */
const MAX_LABEL_LENGTH = CLR_CONTEXT_DEFAULT_OPTIONS.maxTextLength;

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
  /** The snapshot options the write is judged against, handed to the element's mutator. */
  options?: Required<ClrContextSnapshotOptions>;
  /** The only modal dialogs that count as obstacles, when not all open ones do (see `writeObstacle`). */
  knownModals?: ReadonlySet<Element>;
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

/**
 * What Angular's select accessors (`SelectControlValueAccessor` and
 * `SelectMultipleControlValueAccessor`) keep for their own `change` and `blur` listeners.
 * These are implementation fields, not documented API — verified against
 * `@angular/forms` 21.2 — and a spec (write.spec.ts, "Angular's select accessors") fails
 * should they be renamed; until then every select write would be refused as unsupported.
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
  const label = ref.label ?? labelOf(elements, withheldBy(control, options));
  const targetOf = (
    element: Element,
    kind: ControlKind,
    ngControl: NgControl | null,
    mutator: ClrElementMutator | null
  ): TargetResolution => ({
    target: { element, control, label, type, kind, ngControl, mutator, options, knownModals },
  });

  for (const element of elements) {
    const mutator = readElementMutator(element);
    const ngControl = formControlOn(element);
    const bound = ngControl?.control;
    if (!mutator?.write && !bound) {
      continue;
    }
    // A component that writes itself is not judged by a form control it may also carry.
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
          'This custom control does not say how it is written to. It can publish a mutator (clrPublishElementMutator from @clr/angular/utils).',
      };
    }
    if (kind === 'select' && bound?.updateOn === 'submit') {
      return {
        refused: 'unsupported',
        detail: 'This select applies its value only when its form is submitted, which the engine never does.',
      };
    }
    return targetOf(element, kind, ngControl, mutator);
  }
  // A radio group is summarised rather than walked, so its ref is the group's; the
  // binding is on the radios inside it.
  const radio =
    resolveRole(control) === 'radiogroup' ? radiosOf(control).find(each => formControlOn(each)?.control) : null;
  if (radio) {
    const ngControl = formControlOn(radio);
    return bindingRefusal(radio, ngControl?.control, application) ?? targetOf(control, 'radiogroup', ngControl, null);
  }
  return { refused: 'unbound', detail: UNBOUND_DETAIL };
}

/** Why a bound element cannot be written to: another application renders it, or its form control is disabled. */
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
 * Whether the description an agent gave names the node. It must say every word of the
 * label, and may add filler — articles, "field", the node's type — but nothing else:
 * "email" does not name "Email address" nor "Confirm email", "last name" does not name
 * "Name", and "the wrong email" or "not email, the password" do not name "Email". Every
 * word being required is what tells a field from its pair in any language ("E-Mail
 * bestätigen", "Nouveau mot de passe"); the English lists below add what word order
 * cannot: a negating word is allowed only where the label itself says it ("Other
 * income"). A label the snapshot cut short (ending in "…") is matched on the words it
 * kept, and the description may go on where the label was cut. A node without a name can
 * only be described by nothing, or by what it is ("grid").
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
  // The last word of a cut label may itself be cut; only whole words are compared.
  const actual = cut ? labelWords.slice(0, -1) : labelWords;
  // Not covered by `said` below: that lets a word of the type go unsaid, and a
  // distinguishing word must be said even when the type contains it ("start" in a
  // `date-range-start`).
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

/** Words that describe the node rather than name it, and so do not count as extra. */
const FILLER_WORDS: ReadonlySet<string> = new Set([
  'the',
  'a',
  'an',
  'field',
  'input',
  'box',
  'control',
  'value',
  'option',
  'dropdown',
  'select',
  'textbox',
  'checkbox',
  'toggle',
  'of',
  'for',
  'in',
  'on',
  'my',
  'this',
  'that',
]);

/**
 * Words that tell a field from its pair — "Email" and "Confirm email", "Name" and "Last
 * name", a billing and a shipping address. Where a label has one, a description must too.
 */
const DISTINGUISHING_WORDS: ReadonlySet<string> = new Set([
  'confirm',
  'confirmation',
  'repeat',
  'retype',
  'new',
  'old',
  'current',
  'previous',
  'first',
  'middle',
  'last',
  'billing',
  'shipping',
  'primary',
  'secondary',
  'home',
  'work',
  'mobile',
  'start',
  'end',
  'from',
  'to',
  'min',
  'max',
  'minimum',
  'maximum',
]);

/** Words that turn a description into one of something else. */
const NEGATING_WORDS: ReadonlySet<string> = new Set(['not', 'no', 'wrong', 'other', 'except', 'instead', 'never']);

/**
 * What the form control will receive for a coerced value, where that is known before
 * writing: a radio group takes the chosen radio's value. A native select maps its options
 * to model values inside Angular's accessor, so its model value is only known once written.
 * A component that translates the value itself is not asked: its model may hold what it
 * keeps from agents — a selection they were never shown, fields of an option's object.
 */
export function modelValueOf(target: WriteTarget, value: unknown): unknown {
  if (target.kind === 'radiogroup') {
    return value === null ? null : radioValue(value as HTMLInputElement);
  }
  return target.kind === 'select' || target.mutator?.coerce ? undefined : value;
}

/**
 * What the control would be given for a proposal, and what a person would call it: the
 * component's own coercion when it published one, the primitive its kind takes
 * otherwise. `null` proposes clearing.
 */
export function coerceValue(target: WriteTarget, proposed: unknown): Coerced {
  const mutator = target.mutator;
  if (mutator?.coerce) {
    const coerced = safely(() => mutator.coerce?.(proposed, target.options));
    if (coerced.refused !== undefined) {
      return { refused: coerced.refused };
    }
    // What the component says the value is called — an option's label, the date as the
    // field shows it — is what the policy is shown, never the value itself, which may
    // keep a selection the agent was never shown. A component written through its own
    // `write` translates in agent terms — a datagrid's rows by their full labels.
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
        // A person typing stops at the field's `maxlength`; the model must not hold more
        // than the field would have let them enter. Counted as the browser counts it.
        const limit = maxLengthOf(target.element);
        if (limit !== null && text.length > limit) {
          return { refused: `The text must be at most ${limit} characters.` };
        }
        return { value: text, display: text };
      }
      return { refused: 'Text is expected.' };
  }
}

/** A text field's `maxlength`, or `null` when it sets none. */
function maxLengthOf(element: Element): number | null {
  const tagName = element.tagName.toLowerCase();
  if (tagName !== 'input' && tagName !== 'textarea') {
    return null;
  }
  const limit = (element as HTMLInputElement | HTMLTextAreaElement).maxLength;
  return limit >= 0 ? limit : null;
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
  // A write that is refused or throws leaves the control as the user left it: its value,
  // and neither dirty nor touched unless it was.
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
      // A one-line select with no option chosen chooses its first again — the browser
      // does — so a cleared one is told through its control that it holds nothing: the
      // accessor then shows no option, or the one bound to `null` if there is one.
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
    // `setValue` hands the value to the view before it validates, so a throw leaves the
    // refused value shown: it is put back quietly, through the accessor if that works.
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

/** A select's accessor, when it keeps the `change` listener a write is handed to (see `SelectAccessor`). */
function selectAccessorOf(target: WriteTarget): BoundSelectAccessor | null {
  const accessor = target.ngControl?.valueAccessor as SelectAccessor | null | undefined;
  return typeof accessor?.onChange === 'function' ? (accessor as BoundSelectAccessor) : null;
}

/**
 * Chooses a native select's options and hands them to its accessor the way its own
 * `change` listener would, so it maps them back to the bound values — without
 * dispatching DOM events, which would also run whatever `(change)` or `(blur)` handler
 * the application attached. A control that updates on blur is told the field was left.
 * Returns whether the form control took the value; when it did not, or the accessor
 * threw, the select shows the options it showed before.
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

/** The control's value in the terms an agent sees: labels for choices, primitives otherwise. */
export function readValue(target: WriteTarget): unknown {
  if (target.mutator?.read) {
    try {
      return plain(target.mutator.read(target.options));
    } catch {
      return null;
    }
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
  const format = ownEntry(TYPED_INPUTS, input.type) ?? '';
  if (typeof proposed !== 'string') {
    return { refused: `A value in the form ${format} is expected.` };
  }
  // The browser's own sanitisation decides: a value it would clear is one the field
  // cannot show, and the model must not hold what the screen does not.
  const probe = input.ownerDocument.createElement('input');
  probe.type = input.type;
  probe.value = proposed;
  // A colour is written in lower case whatever case it is given in: `#AABBCC` is valid,
  // and the field shows `#aabbcc`, which is what the model then holds.
  const sameValue = input.type === 'color' ? probe.value === proposed.toLowerCase() : probe.value === proposed;
  if (!sameValue) {
    return { refused: `A value in the form ${format} is expected.` };
  }
  return { value: probe.value, display: probe.value };
}

function coerceSelect(target: WriteTarget, proposed: unknown): Coerced {
  const select = target.element as HTMLSelectElement;
  // Only the options the snapshot named can be chosen, or named in a refusal; an option
  // it left out that is selected stays selected, cleared or not.
  const kept = select.multiple ? Array.from(select.selectedOptions).filter(option => !choiceShown(option, target)) : [];
  // One choice at a time: replacing one the agent was never shown would change what it
  // cannot see, and could not undo.
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
    // Two options can read the same: only a value naming exactly one of them tells which.
    const byValue = matches.filter(
      candidate =>
        typeof entry === 'string' && clrNormalizeContextText(candidate.value) === clrNormalizeContextText(entry)
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
    radio =>
      typeof proposed === 'string' && clrNormalizeContextText(radioLabel(radio)) === clrNormalizeContextText(proposed)
  );
  if (!chosen) {
    return { refused: `No such option. The options are: ${listLabels(usable.map(radioLabel))}.` };
  }
  if (!usable.includes(chosen)) {
    return { refused: `The option "${radioLabel(chosen)}" cannot be chosen right now.` };
  }
  return { value: chosen, display: radioLabel(chosen) };
}

/**
 * Whether a choice is kept from agents — excluded, or redacted — as opposed to merely
 * not shown: a hidden placeholder option ("Choose…") is no secret, and a write may
 * replace it.
 */
function choiceKept(choice: Element, target: WriteTarget): boolean {
  const excluded = withheldBy(choice, target.options);
  if (excluded && choice.closest(excluded)) {
    return true;
  }
  for (let current: Element | null = choice; current && current !== target.control; current = current.parentElement) {
    if (current.matches(CLR_CONTEXT_REDACT_SELECTOR)) {
      return true;
    }
  }
  return false;
}

/**
 * Whether a snapshot names this choice — an option or a radio — so that an agent may pick
 * it, and a refusal may list it: not kept from agents, and not withheld itself. The
 * control around it was judged already.
 */
function choiceShown(choice: Element, target: WriteTarget): boolean {
  return !choiceKept(choice, target) && !choice.matches(CLR_CONTEXT_WITHHELD_SELECTOR);
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

function radioLabelWithin(radio: HTMLInputElement, withheld = ''): string {
  return accessibleName(radio, 'radio', MAX_LABEL_LENGTH, withheld) || radio.value;
}

/** Selects what the options leave out, so that no label read here quotes it. */
function withheldBy(element: Element, options?: Required<ClrContextSnapshotOptions>): string {
  return options ? clrUsableSelectors(element.ownerDocument, options.excludeSelectors) : '';
}

/**
 * The name a node is known by when the snapshot gave it none: the accessible name of
 * the element carrying the role, or of the host that renders it.
 */
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
  const wanted = clrNormalizeContextText(proposed);
  return clrNormalizeContextText(optionLabel(option)) === wanted || clrNormalizeContextText(option.value) === wanted;
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
