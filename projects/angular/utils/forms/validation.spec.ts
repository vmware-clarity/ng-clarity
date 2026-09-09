/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { hasRequiredValidator, triggerAllFormControlValidation } from './validation';

describe('triggerAllFormControlValidation', () => {
  it('should trigger all inputs in group to validate', () => {
    const form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      contact: new FormGroup({
        email: new FormControl(''),
      }),
    });

    expect(form.controls.name.touched).toBe(false);
    expect(form.controls.name.dirty).toBe(false);
    expect((form.controls.contact as FormGroup).controls.email.touched).toBe(false);
    expect((form.controls.contact as FormGroup).controls.email.dirty).toBe(false);

    triggerAllFormControlValidation(form);

    expect(form.controls.name.touched).toBe(true);
    expect(form.controls.name.dirty).toBe(true);
    expect((form.controls.contact as FormGroup).controls.email.touched).toBe(true);
    expect((form.controls.contact as FormGroup).controls.email.dirty).toBe(true);
  });
});

describe('hasRequiredValidator', () => {
  it('recognises a reactive Validators.required', () => {
    expect(hasRequiredValidator(new FormControl('', Validators.required))).toBe(true);
  });

  it('recognises a required validator registered by another function, as a [required] binding is', () => {
    const boundRequired = (control: AbstractControl) => Validators.required(control);
    expect(hasRequiredValidator(new FormControl('', boundRequired))).toBe(true);
  });

  it('recognises required among other validators', () => {
    expect(hasRequiredValidator(new FormControl('', [Validators.minLength(2), Validators.required]))).toBe(true);
  });

  it('does not report a control that only has other validators', () => {
    expect(hasRequiredValidator(new FormControl('', Validators.minLength(2)))).toBe(false);
  });

  it('does not report a control with no validators, or no control at all', () => {
    expect(hasRequiredValidator(new FormControl(''))).toBe(false);
    expect(hasRequiredValidator(null)).toBe(false);
  });

  it('treats a validator that throws on probing as not required', () => {
    const throwing = () => {
      throw new Error('needs a parent');
    };
    const control = new FormControl('');
    control.setValidators(throwing);
    expect(hasRequiredValidator(control)).toBe(false);
  });
});
