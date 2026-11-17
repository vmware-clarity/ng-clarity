/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * SPIKE, demo only. A generic form writer with two paths and no component-specific code:
 *   1. the element (or an ancestor up to its custom-element host) has an Angular form binding:
 *      write through its NgControl, so Angular forwards to whatever ControlValueAccessor it has;
 *   2. no binding: set the native property through the prototype setter, then dispatch input and change.
 * Anything else is refused as unsupported.
 */

import { getDebugNode, Injector } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { FORM_FIELD } from '@angular/forms/signals';

export type WritePath = 'ng-control' | 'signal-field' | 'native' | 'none';
export type WriteRefusal = 'unsupported' | 'invalid-value' | 'no-option' | 'disabled' | 'no-debug-node';

export interface WriteOptions {
  /** Turn agent strings into the model's type (boolean, number, Date, array), judged from the current model. */
  coerce?: boolean;
  /** Map a visible option label to the option's bound value. */
  resolveLabels?: boolean;
  /** Also call NgControl.viewToModelUpdate after setValue, to show it is not needed (ngModelChange fires twice). */
  viewToModelUpdate?: boolean;
  /** Ignore the Angular binding and use the native path, to compare. */
  forceNative?: boolean;
  /** Refuse a write to a control with a listbox popup whose options cannot be enumerated (option b). */
  refuseUnlistedOptions?: boolean;
}

export interface WriteResult {
  applied: boolean;
  path: WritePath;
  refused?: WriteRefusal;
  detail?: string;
  /** The value actually handed to the control after coercion and label lookup. */
  written?: unknown;
  before: unknown;
  after: unknown;
  dirty?: boolean;
  touched?: boolean;
  valid?: boolean;
  errors?: unknown;
}

interface FoundControl {
  ngControl: NgControl | null;
  signalField: { state: () => any } | null;
  host: Element;
  candidates: number;
}

const NATIVE_FORM_ELEMENT = 'input, select, textarea';

export function writeControl(element: Element, value: unknown, options: WriteOptions = {}): WriteResult {
  const opts = { coerce: true, resolveLabels: true, ...options };
  if (!getDebugNode(element)) {
    return {
      applied: false,
      path: 'none',
      refused: 'no-debug-node',
      detail: 'getDebugNode returned null',
      before: undefined,
      after: undefined,
    };
  }
  const bound = findControl(element);
  const found = opts.forceNative ? null : bound;

  if (found?.ngControl && typeof found.ngControl.control?.setValue === 'function') {
    return writeThroughNgControl(found, value, opts);
  }
  if (found?.signalField) {
    return writeThroughSignalField(found, value, opts);
  }
  const native = nativeTarget(element);
  if (native) {
    const result = writeNative(
      native,
      value,
      opts,
      found?.ngControl ? 'NgControl without setValue; native path' : undefined
    );
    const control = bound?.ngControl?.control;
    if (control) {
      // Report what the binding saw of the native events.
      Object.assign(result, {
        dirty: control.dirty,
        touched: control.touched,
        valid: control.valid,
        errors: control.errors,
      });
    }
    return result;
  }
  return {
    applied: false,
    path: 'none',
    refused: 'unsupported',
    detail: 'no form binding, not a native form element',
    before: undefined,
    after: undefined,
  };
}

/** NgControl on the element or an ancestor, up to and including the first custom-element host. The outermost wins. */
function findControl(element: Element): FoundControl | null {
  const hits: FoundControl[] = [];
  let node: Element | null = element;
  for (let depth = 0; node && depth < 8; depth++, node = node.parentElement) {
    const injector = getDebugNode(node)?.injector as Injector | undefined;
    const ngControl = injector?.get(NgControl, null, { self: true }) ?? null;
    const signalField = (injector?.get(FORM_FIELD as any, null, { self: true }) as any) ?? null;
    if (ngControl || signalField) {
      hits.push({ ngControl, signalField, host: node, candidates: 0 });
    }
    if (node.tagName.includes('-')) {
      break;
    }
  }
  if (!hits.length) {
    return null;
  }
  // A custom control may bind its own internal inputs (clr-combobox binds its search box with ngModel):
  // the binding on the host is the one the application owns.
  const outer = hits[hits.length - 1];
  outer.candidates = hits.length;
  return outer;
}

function writeThroughNgControl(found: FoundControl, value: unknown, opts: WriteOptions): WriteResult {
  const dir = found.ngControl as NgControl;
  const control = dir.control as AbstractControl;
  const before = control.value;
  if (control.disabled) {
    return { applied: false, path: 'ng-control', refused: 'disabled', before, after: before };
  }
  const prepared = prepareValue(found.host, value, before, opts);
  if ('refused' in prepared) {
    return {
      applied: false,
      path: 'ng-control',
      refused: prepared.refused,
      detail: prepared.detail,
      before,
      after: before,
    };
  }
  control.setValue(prepared.value);
  // setValue alone reaches the accessor (writeValue) and, for NgModel, emits ngModelChange.
  if (opts.viewToModelUpdate) {
    dir.viewToModelUpdate(prepared.value);
  }
  control.markAsDirty();
  control.markAsTouched();
  const notes = [
    prepared.detail,
    found.candidates > 1 ? `${found.candidates} bindings on the way up; used the host's` : '',
  ]
    .filter(Boolean)
    .join('; ');
  return {
    applied: true,
    path: 'ng-control',
    detail: notes || undefined,
    written: prepared.value,
    before,
    after: control.value,
    dirty: control.dirty,
    touched: control.touched,
    valid: control.valid,
    errors: control.errors,
  };
}

function writeThroughSignalField(found: FoundControl, value: unknown, opts: WriteOptions): WriteResult {
  const state = (found.signalField as { state: () => any }).state();
  const before = state.value();
  const prepared = prepareValue(found.host, value, before, opts);
  if ('refused' in prepared) {
    return {
      applied: false,
      path: 'signal-field',
      refused: prepared.refused,
      detail: prepared.detail,
      before,
      after: before,
    };
  }
  state.value.set(prepared.value);
  state.markAsDirty?.();
  state.markAsTouched?.();
  return {
    applied: true,
    path: 'signal-field',
    detail: ['NgControl here is InteropNgControl (no setValue); wrote FieldState.value', prepared.detail]
      .filter(Boolean)
      .join('; '),
    written: prepared.value,
    before,
    after: state.value(),
    dirty: state.dirty(),
    touched: state.touched(),
    valid: state.valid(),
    errors: state.errors().map((e: any) => e.kind),
  };
}

function nativeTarget(element: Element): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null {
  if (element.matches(NATIVE_FORM_ELEMENT)) {
    return element as any;
  }
  return null;
}

function writeNative(
  el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  value: unknown,
  opts: WriteOptions,
  note?: string
): WriteResult {
  const before = readDom(el);
  if (el.disabled) {
    return { applied: false, path: 'native', refused: 'disabled', before, after: before };
  }
  if (el instanceof HTMLSelectElement) {
    const wanted = (Array.isArray(value) ? value : [value]).map(v => String(v));
    const options = Array.from(el.options);
    const pick = (w: string) =>
      options.find(o => o.value === w) ?? (opts.resolveLabels ? options.find(o => labelOf(o) === w) : undefined);
    const picked = wanted.map(pick);
    if (picked.some(o => !o)) {
      return {
        applied: false,
        path: 'native',
        refused: 'no-option',
        detail: `no option with value or label ${JSON.stringify(wanted)}`,
        before,
        after: before,
      };
    }
    const selected = nativeSetter(HTMLOptionElement.prototype, 'selected');
    options.forEach(o => selected.call(o, picked.includes(o)));
  } else if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
    const bool = toBoolean(value);
    if (bool === undefined) {
      return {
        applied: false,
        path: 'native',
        refused: 'invalid-value',
        detail: 'checkbox needs true or false',
        before,
        after: before,
      };
    }
    nativeSetter(HTMLInputElement.prototype, 'checked').call(el, bool);
  } else {
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    nativeSetter(proto, 'value').call(el, value === null || value === undefined ? '' : String(value));
  }
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
  const after = readDom(el);
  const sticky =
    JSON.stringify(after) !== JSON.stringify(before) || JSON.stringify(after) === JSON.stringify(String(value));
  return { applied: sticky, path: 'native', detail: note, written: value, before, after };
}

type Prepared = { value: unknown; detail?: string } | { refused: WriteRefusal; detail: string };

/** Agent strings into the model's type, judged from the current model and the element, plus label lookup. */
function prepareValue(host: Element, value: unknown, before: unknown, opts: WriteOptions): Prepared {
  const notes: string[] = [];
  let v = value;
  const input = host.matches('input') ? (host as HTMLInputElement) : null;

  if (opts.resolveLabels && (typeof v === 'string' || (Array.isArray(v) && v.every(x => typeof x === 'string')))) {
    const lookup = lookupOptions(host);
    if (lookup.options.length) {
      const labels = Array.isArray(v) ? (v as string[]) : [v as string];
      const resolved = labels.map(label => lookup.options.find(o => o.label === label));
      if (resolved.every(Boolean)) {
        const values = resolved.map(o => o?.value);
        v = Array.isArray(v) ? values : values[0];
        notes.push(`label lookup via ${lookup.source}`);
      } else if (
        isPlainObject(before) ||
        (Array.isArray(before) && before.some(isPlainObject)) ||
        lookup.objectValued
      ) {
        return { refused: 'no-option', detail: `no option labelled ${JSON.stringify(value)} (${lookup.source})` };
      }
    } else if (isPlainObject(before) || (Array.isArray(before) && before.some(isPlainObject))) {
      return { refused: 'no-option', detail: `model holds objects and no options are reachable (${lookup.source})` };
    } else if (opts.refuseUnlistedOptions && host.querySelector('[aria-haspopup="listbox"], [role="combobox"]')) {
      return {
        refused: 'no-option',
        detail: `listbox options are not reachable, cannot check the label (${lookup.source})`,
      };
    }
  }

  if (!opts.coerce) {
    return { value: v, detail: notes.join('; ') || undefined };
  }
  const kind =
    typeof before === 'boolean' || input?.type === 'checkbox'
      ? 'boolean'
      : typeof before === 'number' || input?.type === 'number' || input?.type === 'range'
        ? 'number'
        : before instanceof Date
          ? 'date'
          : Array.isArray(before)
            ? 'array'
            : 'as-is';
  if (kind === 'boolean' && typeof v !== 'boolean') {
    const bool = toBoolean(v);
    if (bool === undefined) {
      return { refused: 'invalid-value', detail: `${JSON.stringify(v)} is not true or false` };
    }
    v = bool;
    notes.push('coerced to boolean');
  } else if (kind === 'number' && typeof v !== 'number') {
    const num = typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN;
    if (Number.isNaN(num)) {
      return { refused: 'invalid-value', detail: `${JSON.stringify(v)} is not a number` };
    }
    v = num;
    notes.push('coerced to number');
  } else if (kind === 'date' && !(v instanceof Date)) {
    const match = typeof v === 'string' ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(v) : null;
    if (!match) {
      return { refused: 'invalid-value', detail: `${JSON.stringify(v)} is not yyyy-mm-dd` };
    }
    v = new Date(+match[1], +match[2] - 1, +match[3]);
    notes.push('coerced to Date');
  } else if (kind === 'array' && !Array.isArray(v)) {
    v = [v];
    notes.push('wrapped in array');
  }
  return { value: v, detail: notes.join('; ') || undefined };
}

interface OptionLookup {
  options: { label: string; value: unknown }[];
  objectValued: boolean;
  source: string;
}

/**
 * Options the agent can name by label, without knowing the component: a native select's options
 * (their bound value comes from the select's ControlValueAccessor option map), or role="option"
 * elements in the host or in the listbox its combobox input controls. An option element's bound
 * value is read from its own component or directive as a `value` property.
 */
function lookupOptions(host: Element): OptionLookup {
  if (host instanceof HTMLSelectElement) {
    const accessor = (getDebugNode(host)?.injector.get(NgControl, null, { self: true }) as any)?.valueAccessor;
    const map: Map<string, unknown> | undefined = accessor?._optionMap;
    const options = Array.from(host.options).map(o => {
      const id = o.value.split(':')[0];
      const hasMapped = map?.has(id);
      return { label: labelOf(o), value: hasMapped ? map?.get(id) : o.value };
    });
    return {
      options,
      objectValued: options.some(o => isPlainObject(o.value)),
      source: map ? 'native options + SelectControlValueAccessor._optionMap (private)' : 'native options',
    };
  }
  const ids = Array.from(host.querySelectorAll('[aria-controls], [aria-owns]'))
    .flatMap(el => `${el.getAttribute('aria-controls') ?? ''} ${el.getAttribute('aria-owns') ?? ''}`.split(/\s+/))
    .filter(Boolean);
  const listboxes = ids.map(id => document.getElementById(id)).filter(Boolean) as Element[];
  let elements = [host, ...listboxes].flatMap(root => Array.from(root.querySelectorAll('[role="option"]')));
  let source = 'role=option elements in the DOM';
  if (!elements.length) {
    // Content children that are not projected (a closed popover) are not in the document; the debug tree may have them.
    elements =
      (getDebugNode(host) as any)
        ?.queryAll?.((d: any) => d.nativeElement?.getAttribute?.('role') === 'option')
        ?.map((d: any) => d.nativeElement) ?? [];
    source = elements.length
      ? 'DebugElement.queryAll (not in the DOM)'
      : 'no role=option element in the DOM or the debug tree';
  }
  const options = elements.map(el => {
    const debug = getDebugNode(el) as any;
    const value = debug?.componentInstance?.value ?? debug?.injector?.get?.(NgControl, null)?.value;
    return { label: labelOf(el), value: value === undefined ? labelOf(el) : value };
  });
  return {
    options,
    objectValued: options.some(o => isPlainObject(o.value)),
    source,
  };
}

export function readDom(el: Element | null): unknown {
  if (!el) {
    return null;
  }
  if (el instanceof HTMLSelectElement) {
    const labels = Array.from(el.selectedOptions).map(labelOf);
    return el.multiple ? labels : (labels[0] ?? '');
  }
  if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
    return el.checked;
  }
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    return el.value;
  }
  const inner = el.querySelector('input');
  const text = labelOf(el);
  return inner && inner.value && !text.includes(inner.value) ? [text, inner.value].filter(Boolean).join(' | ') : text;
}

/** The prototype's own setter, so a framework or app override on the instance cannot intercept the write. */
function nativeSetter(proto: object, property: string): (this: unknown, value: unknown) => void {
  const setter = Object.getOwnPropertyDescriptor(proto, property)?.set;
  if (!setter) {
    throw new Error(`no native setter for ${property}`);
  }
  return setter;
}

function labelOf(el: Element): string {
  return (el.textContent ?? '').replace(/\s+/g, ' ').trim();
}

function toBoolean(v: unknown): boolean | undefined {
  if (typeof v === 'boolean') {
    return v;
  }
  if (v === 'true' || v === 'on' || v === 'yes' || v === 1 || v === '1') {
    return true;
  }
  if (v === 'false' || v === 'off' || v === 'no' || v === 0 || v === '0') {
    return false;
  }
  return undefined;
}

function isPlainObject(v: unknown): boolean {
  return typeof v === 'object' && v !== null && !Array.isArray(v) && !(v instanceof Date);
}
