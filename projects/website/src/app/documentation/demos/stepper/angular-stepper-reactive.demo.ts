/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ClrCommonFormsModule,
  ClrDatagridModule,
  ClrIfExpanded,
  ClrInputModule,
  ClrPasswordModule,
  ClrStepperModule,
} from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const templateExample = `
<form clrStepper [formGroup]="form" (ngSubmit)="submit()">
  <clr-stepper-panel formGroupName="name">
    <clr-step-title>Legal Name</clr-step-title>
    <clr-step-description>Description goes here.</clr-step-description>
    <clr-step-content *clrIfExpanded>
      <clr-input-container>
        <label>First Name</label>
        <input clrInput formControlName="first" />
        <clr-control-error *clrIfError="'required'">First Name Required</clr-control-error>
      </clr-input-container>

      <clr-input-container>
        <label>Last Name</label>
        <input clrInput formControlName="last" />
        <clr-control-error *clrIfError="'required'">Last Name Required</clr-control-error>
      </clr-input-container>

      <button clrStepButton="next">next</button>
    </clr-step-content>
  </clr-stepper-panel>

  <clr-stepper-panel formGroupName="contact">
    <clr-step-title>Contact Information</clr-step-title>
    <clr-step-description>Description goes here.</clr-step-description>
    <clr-step-content *clrIfExpanded>
      <clr-input-container>
        <label>Email</label>
        <input clrInput formControlName="email" />
      </clr-input-container>

      <clr-input-container>
        <label>Phone</label>
        <input clrInput formControlName="phone" />
      </clr-input-container>

      <button clrStepButton="next">next</button>
    </clr-step-content>
  </clr-stepper-panel>

  <clr-stepper-panel formGroupName="password">
    <clr-step-title>Password</clr-step-title>
    <clr-step-description>Description goes here.</clr-step-description>
    <clr-step-content *clrIfExpanded>
      <clr-password-container>
        <label>Password</label>
        <input clrPassword autocomplete="current-password" formControlName="password" />
      </clr-password-container>

      <clr-password-container>
        <label>Confirm Password</label>
        <input clrPassword autocomplete="current-password" formControlName="confirm" />
      </clr-password-container>

      <button clrStepButton="submit">submit</button>
    </clr-step-content>
  </clr-stepper-panel>
</form>
`;

const componentExample = `
import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',

  imports: [ReactiveFormsModule, ClrFormsModule, ClrStepperModule],
})
export class ExampleComponent {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      name: this.formBuilder.group({
        first: ['Luke', Validators.required],
        last: ['Skywalker', Validators.required],
      }),
      contact: this.formBuilder.group({
        email: [],
        phone: [],
      }),
      password: this.formBuilder.group({
        password: [],
        confirm: [],
      }),
    });
  }

  submit() {
    console.log('reactive form submit', this.form.value);
  }
}
`;

@Component({
  selector: 'clr-angular-stepper-reactive-demo',
  templateUrl: './angular-stepper-reactive.demo.html',
  imports: [
    FormsModule,
    ClrStepperModule,
    ReactiveFormsModule,
    ClrDatagridModule,
    ClrIfExpanded,
    ClrInputModule,
    ClrCommonFormsModule,
    ClrPasswordModule,
    StackblitzExampleComponent,
  ],
})
export class AngularStepperReactiveDemo {
  templateExample = templateExample;
  componentExample = componentExample;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      name: formBuilder.group({
        first: ['', Validators.required],
        last: ['', Validators.required],
      }),
      contact: formBuilder.group({
        email: [],
        phone: [],
      }),
      password: formBuilder.group({
        password: [],
        confirm: [],
      }),
    });
  }

  submit() {
    console.log('reactive form submit', this.form.value);
  }
}
