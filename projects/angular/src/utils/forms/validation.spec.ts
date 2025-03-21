/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { triggerAllFormControlValidation } from './validation';

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
