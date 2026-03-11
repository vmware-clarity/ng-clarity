/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrCommonFormsModule, ClrInputModule, ClrPasswordModule, ClrStepperModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const templateExample = `
<form clrStepper #contactForm="ngForm" (ngSubmit)="templateFormSubmit(contactForm.value)">
  <clr-stepper-panel ngModelGroup="name">
    <clr-step-title>Legal Name</clr-step-title>
    <clr-step-description>Description goes here.</clr-step-description>
    <clr-step-content>
      <clr-input-container>
        <label>First Name</label>
        <input clrInput [ngModel]="templateForm.name.firstName" name="firstName" required />
      </clr-input-container>

      <clr-input-container>
        <label>Last Name</label>
        <input clrInput [ngModel]="templateForm.name.lastName" name="lastName" required />
      </clr-input-container>

      <button clrStepButton="next">next</button>
    </clr-step-content>
  </clr-stepper-panel>

  <clr-stepper-panel ngModelGroup="contact">
    <clr-step-title>Contact Information</clr-step-title>
    <clr-step-description>...</clr-step-description>
    <clr-step-content>
      ...
      <button clrStepButton="next">next</button>
    </clr-step-content>
  </clr-stepper-panel>

  <clr-stepper-panel ngModelGroup="password">
    <clr-step-title>Password</clr-step-title>
    <clr-step-description>...</clr-step-description>
    <clr-step-content>
      ...
      <button clrStepButton="submit">submit</button>
    </clr-step-content>
  </clr-stepper-panel>
</form>
`;

const componentExample = `
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',

  imports: [ReactiveFormsModule, FormsModule, ClrFormsModule, ClrStepperModule],
})
export class ExampleComponent {
  templateForm = {
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

  templateFormSubmit(templateFormValues: {}) {
    console.log('template form submit', templateFormValues);
  }
}
`;

@Component({
  selector: 'clr-angular-stepper-template-demo',
  templateUrl: './angular-stepper-template.demo.html',
  imports: [
    FormsModule,
    ClrStepperModule,
    ClrInputModule,
    ClrCommonFormsModule,
    ClrPasswordModule,
    StackblitzExampleComponent,
  ],
})
export class AngularStepperTemplateDemo {
  templateExample = templateExample;
  componentExample = componentExample;

  templateForm = {
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

  templateFormSubmit(templateFormValues: object) {
    console.log('template form submit', templateFormValues);
  }
}
