/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  templateUrl: './password.demo.html',
  standalone: false,
})
export class PasswordDemo {
  disabled = true;
  verticalToggle = false;
  vertical = {
    one: '',
    two: '',
    three: '',
    four: '',
  };
  horizontal = {
    one: '',
    two: '',
    three: '',
    four: '',
  };
  compact = {
    one: '',
    two: '',
    three: '',
    four: '',
  };

  form: FormGroup = new FormGroup({
    password: new FormControl('', []),
  });

  constructor(public cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.setValidators();
  }

  setValidators() {
    if (this.form) {
      const ctrl = this.form.get('password');
      ctrl.setValidators([Validators.required, Validators.minLength(8), this.customValidator]);
      ctrl.updateValueAndValidity();
    }
  }

  customValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    if (!/[A-Z]/.test(value)) {
      return {
        customError: {
          customError: 'Must contain at least one uppercase letter',
        },
      };
    }
    return null;
  }

  onSubmit() {
    this.validateForm();
  }

  validateForm() {
    this.form.markAllAsTouched();
    const controlNames = Object.keys(this.form.controls);
    for (let i = 0; i < controlNames.length; i++) {
      this.form.controls[controlNames[i]].updateValueAndValidity();
    }
  }
}
