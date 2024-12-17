/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClrLoadingState } from '@clr/angular';

@Component({
  templateUrl: 'stepper.demo.html',
  styleUrls: ['./stepper.demo.scss'],
})
export class StepperDemo {
  state: ClrLoadingState = ClrLoadingState.DEFAULT;

  showSecondStep = true;
  initialStep = 'name';
  form: FormGroup = this.getReactiveForm();
  templateForm: any = this.getTemplateForm();
  partiallyCompletedForm: FormGroup = this.getReactiveForm();

  #fb = inject(FormBuilder);
  expanded = false;
  formGroup = this.#fb.group({
    group: this.#fb.group({
      step: new FormControl(null, Validators.required),
    }),
  });

  @ViewChild('nextBtn') nxtBtn?: ElementRef<HTMLElement>;

  stepsExpandedState = {
    name: false,
    contact: false,
    password: false,
  };
  loading = false;

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
