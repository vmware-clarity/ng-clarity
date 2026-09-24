/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

export function triggerAllFormControlValidation(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
    } else if (control instanceof FormGroup) {
      triggerAllFormControlValidation(control);
    }
  });
}

/**
 * Whether a value is required of the control, however that requirement was expressed.
 *
 * `hasValidator(Validators.required)` only recognises the validator function itself,
 * which is what a reactive form registers. The template-driven spellings — a `required`
 * attribute, or a `[required]="expr"` binding — go through Angular's `RequiredValidator`
 * directive, which registers its own bound method instead, so they are found by asking
 * the composed validator what it makes of an empty value.
 */
export function hasRequiredValidator(control: AbstractControl | null | undefined): boolean {
  if (!control) {
    return false;
  }
  if (control.hasValidator(Validators.required)) {
    return true;
  }
  const validator = control.validator;
  if (!validator) {
    return false;
  }
  // Host bindings ask on every change detection cycle; the composed validator runs
  // once per recomputation of the control's validity instead (see `remember`).
  const remembered = REQUIRED_BY_CONTROL.get(control);
  if (remembered && remembered.validator === validator) {
    return remembered.required;
  }
  let required = false;
  try {
    // A control of its own for each probe: a validator is application code and may touch
    // the control it is given, which must not carry over into the next probe.
    required = validator(new FormControl<unknown>(null))?.required === true;
  } catch {
    // A custom validator that assumes a parent or a value is not one that expresses
    // "required", and must not take the host binding down with it.
  }
  remember(control, validator, required);
  return required;
}

/**
 * What a control's composed validator last said about emptiness. The composed function
 * keeps its identity when a `[required]` binding toggles — the directive only re-runs
 * validation — so the answer is forgotten whenever the control recomputes its validity,
 * and recomputed when its validator is replaced.
 */
const REQUIRED_BY_CONTROL = new WeakMap<AbstractControl, { validator: ValidatorFn; required: boolean }>();

/**
 * Controls already watched for recomputation. Kept apart from the cache itself: the cache
 * entry is dropped on every recomputation, and a control whose entry is missing must not
 * be subscribed to again — that would add one subscription per status change.
 */
const WATCHED_CONTROLS = new WeakSet<AbstractControl>();

function remember(control: AbstractControl, validator: ValidatorFn, required: boolean): void {
  if (!WATCHED_CONTROLS.has(control)) {
    // One subscription per control, for the control's lifetime: `statusChanges` emits on
    // every updateValueAndValidity, which is what a `[required]` toggle triggers.
    WATCHED_CONTROLS.add(control);
    control.statusChanges.subscribe(() => REQUIRED_BY_CONTROL.delete(control));
  }
  REQUIRED_BY_CONTROL.set(control, { validator, required });
}
