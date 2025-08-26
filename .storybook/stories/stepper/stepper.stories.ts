/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ClrConditionalModule, ClrInputModule, ClrStepper, ClrStepperModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';
import { action } from 'storybook/actions';

import { CommonModules, removeFocusOutline } from '../../helpers/common';

const formMappingKey = 'form-mapping-key';

export default {
  title: 'Stepper/Stepper',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrStepperModule, ClrConditionalModule, ClrInputModule],
    }),
  ],
  component: ClrStepper,
  argTypes: {
    // story helpers
    form: { control: { disable: true }, table: { disable: true }, mapping: { [formMappingKey]: getForm() } },
    ngSubmit: { control: { disable: true }, table: { disable: true } },
    createArray: { control: { disable: true }, table: { disable: true } },
    stepCount: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    // inputs
    clrInitialStep: '',
    // story helpers
    createArray: n => new Array(n),
    stepCount: 3,
    form: formMappingKey,
    ngSubmit: action('ngSubmit'),
    alignmentTest: false,
    showPreviousButton: false,
  },
};

const StepperTemplate: StoryFn = args => ({
  template: `
    <form clrStepper [clrInitialStep]="clrInitialStep" [formGroup]="form" (ngSubmit)="ngSubmit()">
      <clr-stepper-panel *ngFor="let _ of createArray(stepCount); let i = index" formGroupName="step{{ i + 1 }}">
        <clr-step-title>Step {{ i + 1 }} {{ alignmentTest && i === 2 ? '(alignment test)' : '' }}</clr-step-title>
        <clr-step-description>Step {{ i + 1 }} description.</clr-step-description>
        <clr-step-content *clrIfExpanded>
          <clr-input-container>
            <label>Value</label>
            <input clrInput formControlName="value" required />
          </clr-input-container>

          <br />
          <button class="btn" (click)="form.patchValue({})">Patch Form</button>
          <button class="btn" (click)="form.reset()">Reset Form</button>

          <br />
          <button *ngIf="showPreviousButton" clrStepButton="previous">previous</button>
          <button *ngIf="stepCount > i + 1" id="next-button-{{ i + 1 }}" clrStepButton="next">next</button>
          <button *ngIf="stepCount === i + 1" clrStepButton="submit">submit</button>
        </clr-step-content>
      </clr-stepper-panel>
    </form>
  `,
  props: { ...args },
});

function getForm({ firstStepControlValue = undefined }: { firstStepControlValue?: string } = {}) {
  const controls: { [key: string]: AbstractControl } = {};

  for (let i = 0; i < 100; i++) {
    controls[`step${i + 1}`] = new FormGroup({
      value: new FormControl(i === 0 ? firstStepControlValue : undefined),
    });
  }

  return new FormGroup(controls);
}

export const Stepper: StoryObj = {
  render: StepperTemplate,
};

export const StepperWithPreviousButton: StoryObj = {
  render: StepperTemplate,
  args: {
    showPreviousButton: true,
  },
};

export const StepperAlignmentTest: StoryObj = {
  render: StepperTemplate,
  args: {
    alignmentTest: true,
  },
};

export const StepperPanelStatusIndicators: StoryObj = {
  render: StepperTemplate,
  play({ canvasElement }) {
    canvasElement.querySelector<HTMLButtonElement>('#next-button-1').click();
    canvasElement.querySelector<HTMLButtonElement>('#next-button-2').click();
    removeFocusOutline({ canvasElement });
  },
  argTypes: {
    // story helpers
    form: {
      control: { disable: true },
      table: { disable: true },
      mapping: { [formMappingKey]: getForm({ firstStepControlValue: 'test value' }) },
    },
  },
};
