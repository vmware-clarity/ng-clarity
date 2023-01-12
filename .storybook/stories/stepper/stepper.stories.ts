/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ClrConditionalModule, ClrInputModule, ClrStepper, ClrStepperModule } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const formMappingKey = 'form-mapping-key';

const defaultStory: Story = args => ({
  template: `
    <form clrStepper [clrInitialStep]="clrInitialStep" [formGroup]="form" (ngSubmit)="ngSubmit()">
      <clr-stepper-panel *ngFor="let _ of createArray(stepCount); let i = index" formGroupName="step{{ i + 1 }}">
        <clr-step-title>Step {{ i + 1 }}</clr-step-title>
        <clr-step-description>Step {{ i + 1 }} description.</clr-step-description>
        <clr-step-content *clrIfExpanded>
          <clr-input-container>
            <label>Value</label>
            <input clrInput formControlName="value" />
          </clr-input-container>

          <br />
          <button class="btn" (click)="form.patchValue({})">Patch Form</button>
          <button class="btn" (click)="form.reset()">Reset Form</button>

          <button *ngIf="stepCount > i + 1" clrStepButton="next">next</button>
          <button *ngIf="stepCount === i + 1" clrStepButton="submit">submit</button>
        </clr-step-content>
      </clr-stepper-panel>
    </form>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Stepper/Stepper',
  component: ClrStepper,
  argTypes: {
    // inputs
    clrInitialStep: { defaultValue: '' },
    // story helpers
    form: { control: { disable: true }, table: { disable: true }, mapping: { [formMappingKey]: getForm() } },
    ngSubmit: { control: { disable: true }, table: { disable: true } },
    createArray: { control: { disable: true }, table: { disable: true } },
    stepCount: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    // story helpers
    createArray: n => new Array(n),
    stepCount: 3,
    form: formMappingKey,
    ngSubmit: action('ngSubmit'),
  },
};

const variants: Parameters[] = [];

setupStorybook([ClrStepperModule, ClrConditionalModule, ClrInputModule], defaultStory, defaultParameters, variants);

function getForm() {
  const controls: { [key: string]: AbstractControl } = {};

  for (let i = 0; i < 100; i++) {
    controls[`step${i + 1}`] = new FormGroup({
      value: new FormControl(),
    });
  }

  return new FormGroup(controls);
}
