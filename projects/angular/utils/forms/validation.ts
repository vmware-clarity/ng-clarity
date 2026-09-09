/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

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

/** A control that is empty, for probing what a validator says about emptiness. */
const EMPTY_CONTROL = new FormControl<unknown>(null);

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
  try {
    return validator(EMPTY_CONTROL)?.required === true;
  } catch {
    // A custom validator that assumes a parent or a value is not one that expresses
    // "required", and must not take the host binding down with it.
    return false;
  }
}
