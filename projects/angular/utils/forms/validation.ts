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
export function clrHasRequiredValidator(control: AbstractControl | null | undefined): boolean {
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
  // once per recomputation of the control's validity instead (see `REQUIRED_BY_CONTROL`).
  let remembered = REQUIRED_BY_CONTROL.get(control);
  if (!remembered) {
    const entry: RememberedRequirement = { validator: null, required: false };
    REQUIRED_BY_CONTROL.set(control, (remembered = entry));
    // One subscription per control, for the control's lifetime: `statusChanges` emits on
    // every updateValueAndValidity, which is what a `[required]` toggle triggers.
    control.statusChanges.subscribe(() => (entry.validator = null));
  }
  if (remembered.validator !== validator) {
    remembered.validator = validator;
    remembered.required = false;
    try {
      // A control of its own for each probe: a validator is application code and may touch
      // the control it is given, which must not carry over into the next probe.
      remembered.required = validator(new FormControl<unknown>(null))?.required === true;
    } catch {
      // A custom validator that assumes a parent or a value is not one that expresses
      // "required", and must not take the host binding down with it.
    }
  }
  return remembered.required;
}

interface RememberedRequirement {
  /** The validator the answer is for; `null` once the control has recomputed its validity. */
  validator: ValidatorFn | null;
  required: boolean;
}

/**
 * What a control's composed validator last said about emptiness. The composed function
 * keeps its identity when a `[required]` binding toggles — the directive only re-runs
 * validation — so the answer is forgotten whenever the control recomputes its validity,
 * and recomputed when its validator is replaced.
 */
const REQUIRED_BY_CONTROL = new WeakMap<AbstractControl, RememberedRequirement>();
