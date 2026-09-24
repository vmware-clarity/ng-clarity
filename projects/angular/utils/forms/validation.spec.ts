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

  it('watches a control once however often its validity is recomputed', () => {
    const control = new FormControl('', Validators.minLength(3));
    const subscribe = spyOn(control.statusChanges, 'subscribe').and.callThrough();
    for (let edit = 0; edit < 5; edit++) {
      hasRequiredValidator(control);
      control.setValue(`value ${edit}`);
    }
    hasRequiredValidator(control);
    expect(subscribe).toHaveBeenCalledTimes(1);
  });

  it('still notices a requirement added after the first answer', () => {
    const control = new FormControl('', Validators.minLength(3));
    expect(hasRequiredValidator(control)).toBe(false);
    control.setValidators(control => Validators.required(control) ?? Validators.minLength(3)(control));
    control.updateValueAndValidity();
    expect(hasRequiredValidator(control)).toBe(true);
  });

  it('gives each probe a control of its own, so a validator that touches it cannot affect the next', () => {
    const marking = (probed: AbstractControl) => {
      probed.markAsTouched();
      return probed.touched && probed.value === null ? { required: true } : null;
    };
    const first = new FormControl('');
    first.setValidators(marking);
    const second = new FormControl('');
    second.setValidators(probed => (probed.touched ? { required: true } : null));
    expect(hasRequiredValidator(first)).toBe(true);
    expect(hasRequiredValidator(second)).toBe(false);
  });
});
