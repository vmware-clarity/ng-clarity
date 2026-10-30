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
 * Whether the control requires a value, from `Validators.required` or a template `required`/`[required]`.
 * `hasValidator` misses the template forms, so the composed validator is probed with an empty value.
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
  let remembered = REQUIRED_BY_CONTROL.get(control);
  if (!remembered) {
    const entry: RememberedRequirement = { validator: null, required: false };
    REQUIRED_BY_CONTROL.set(control, (remembered = entry));
    // `statusChanges` emits on every updateValueAndValidity, which a `[required]` toggle triggers.
    control.statusChanges.subscribe(() => (entry.validator = null));
  }
  if (remembered.validator !== validator) {
    remembered.validator = validator;
    remembered.required = false;
    try {
      // A fresh control per probe, as a validator may touch the control it is given. It sees the real
      // parent, so a validator that compares with a sibling field still runs.
      const probe = new FormControl<unknown>(null);
      probe.setParent(control.parent);
      remembered.required = validator(probe)?.required === true;
    } catch {
      // A validator that assumes a parent or value does not express "required".
    }
  }
  return remembered.required;
}

interface RememberedRequirement {
  validator: ValidatorFn | null;
  required: boolean;
}

/** The composed validator survives a `[required]` toggle, so the answer resets on each validity change. */
const REQUIRED_BY_CONTROL = new WeakMap<AbstractControl, RememberedRequirement>();
