/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClrLoadingState } from '@clr/angular';

@Component({
  templateUrl: 'stepper.demo.html',
  styleUrls: ['./stepper.demo.scss'],
  standalone: false,
})
export class StepperDemo {
  @ViewChild('nextBtn') nxtBtn?: ElementRef<HTMLElement>;

  state: ClrLoadingState = ClrLoadingState.DEFAULT;
  expanded = false;
  showSecondStep = true;
  initialStep = 'name';
  form: FormGroup = this.getReactiveForm();
  templateForm: any = this.getTemplateForm();
  partiallyCompletedForm: FormGroup = this.getReactiveForm();
  nestedStepperForm: FormGroup = this.getNestedStepperForm();
  nestedInnerForm: FormGroup = this.nestedStepperForm.get('outer1.inner') as FormGroup;

  stepsExpandedState = {
    name: false,
    contact: false,
    password: false,
  };
  loading = false;

  // CDE-3088 demo form: required fields to observe whether typing in one incorrectly touches its siblings.
  validateNoSiblingForm = new FormGroup({
    person: new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    }),
  });

  get validateNoSiblingFormGroup(): FormGroup {
    return this.validateNoSiblingForm.get('person') as FormGroup;
  }

  resetValidateNoSiblingForm() {
    this.validateNoSiblingForm.reset();
  }

  loadingDemo() {
    this.state = ClrLoadingState.LOADING;
    setTimeout(() => {
      this.state = ClrLoadingState.SUCCESS;
    }, 1500);
  }

  submit() {
    console.log('reactive form submit', this.form.value);
  }

  templateFormSubmit(templateFormValues: unknown) {
    console.log('template form submit', templateFormValues);
  }

  toggleInitialStep() {
    this.initialStep = this.initialStep === 'contact' ? 'password' : 'contact';
  }

  log(value: any) {
    console.log('value', value);
  }

  changeStep() {
    this.loading = true;
    setTimeout(() => {
      this.initialStep = 'contact';
      this.loading = false;
    }, 400);
  }

  private getNestedStepperForm() {
    return new FormGroup({
      outer1: new FormGroup({
        value: new FormControl(''),
        inner: new FormGroup({
          inner1: new FormGroup({
            detail: new FormControl(''),
          }),
          inner2: new FormGroup({
            detail: new FormControl(''),
          }),
        }),
      }),
      outer2: new FormGroup({
        value: new FormControl(''),
      }),
      outer3: new FormGroup({
        summary: new FormControl(''),
      }),
    });
  }

  private getReactiveForm() {
    return new FormGroup({
      name: new FormGroup({
        first: new FormControl('', Validators.minLength(4)),
        last: new FormControl('Skywalker', Validators.required),
      }),
      contact: new FormGroup({
        email: new FormControl(),
        phone: new FormControl(),
      }),
      password: new FormGroup({
        password: new FormControl(),
        confirm: new FormControl(),
      }),
    });
  }

  private getTemplateForm() {
    return {
      name: {
        firstName: '',
        lastName: '',
      },
      contact: {
        email: '',
        phone: '',
      },
      password: {
        password: '',
        confirm: '',
      },
    };
  }
}
