/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'regression-testing-demo',
  templateUrl: './regression-testing.demo.html',
  standalone: false,
})
export class RegressionTestingDemo implements OnInit {
  undefinedErrorForm: FormGroup = new FormGroup({
    password: new FormControl('', []),
  });

  @Output() userValue = new EventEmitter<string>();
  readonly formControls = {
    name: 'name',
  } as const;

  readonly maxLength = 10;
  forbiddenValue: string = 'forbidden';
  forbiddenFormValidation!: FormGroup;

  ngOnInit() {
    this.setValidators();

    this.forbiddenFormValidation = new FormGroup({
      [this.formControls.name]: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.maxLength),
        this.forbiddenValueValidator,
      ]),
    });

    this.forbiddenFormValidation.valueChanges.subscribe(() => {
      this.userValue.emit(this.undefinedErrorForm.get(this.formControls.name)?.value ?? '');
    });
  }

  onSubmit() {
    this.validateForm();
  }

  validateForm() {
    this.undefinedErrorForm.markAllAsTouched();
    const controlNames = Object.keys(this.undefinedErrorForm.controls);
    for (let i = 0; i < controlNames.length; i++) {
      this.undefinedErrorForm.controls[controlNames[i]].updateValueAndValidity();
    }
  }

  setValidators() {
    if (this.undefinedErrorForm) {
      const ctrl = this.undefinedErrorForm.get('password');
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

  private forbiddenValueValidator = (control: AbstractControl | null): ValidationErrors | null => {
    const value: string = (control?.value ?? '').trim();
    if (!value || !this.forbiddenValue) {
      return null;
    }
    return value === this.forbiddenValue ? { forbidden: true } : null;
  };
}
