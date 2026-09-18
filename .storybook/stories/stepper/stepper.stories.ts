/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ClrConditionalModule, ClrInputModule, ClrStepper, ClrStepperModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';
import { action } from 'storybook/actions';

/**
 * `ClrStepper` aliases its input (`@Input('clrInitialStep') initialPanel`), so the component class cannot be
 * the args type. `form` and `nestedForm` are declared in `args` as their `mapping` key and reach the story
 * as the `FormGroup` that mapping resolves to, so both shapes are allowed.
 */
type StepperArgs = {
  clrInitialStep: string;
  createArray: (n: number) => unknown[];
  stepCount: number;
  form: FormGroup | string;
  nestedForm: FormGroup | string;
  ngSubmit: () => void;
  alignmentTest: boolean;
  showPreviousButton: boolean;
  showDescriptions: boolean;
};

const formMappingKey = 'form-mapping-key';
const nestedFormMappingKey = 'nested-form-mapping-key';

const longTitleTemplate = `
  <form clrStepper [formGroup]="form">
    <clr-stepper-panel formGroupName="step1">
      <clr-step-title>Step 1: A really long title that will wrap if any step has a description.</clr-step-title>
      <clr-step-content *clrIfExpanded>
        <button clrStepButton="next">next</button>
      </clr-step-content>
    </clr-stepper-panel>

    <clr-stepper-panel formGroupName="step2">
      <clr-step-title>Step 2 (can have a description)</clr-step-title>
      @if (showDescriptions) {
        <clr-step-description>Description of step 2.</clr-step-description>
      }
      <clr-step-content *clrIfExpanded>
        <button clrStepButton="previous">previous</button>
        <button clrStepButton="next">next</button>
      </clr-step-content>
    </clr-stepper-panel>

    <clr-stepper-panel formGroupName="step3">
      <clr-step-title>Step 3</clr-step-title>
      <clr-step-content *clrIfExpanded>
        <button clrStepButton="previous">previous</button>
        <button clrStepButton="submit">submit</button>
      </clr-step-content>
    </clr-stepper-panel>
  </form>
`;

const meta: Meta<StepperArgs> = {
  title: 'Stepper/Stepper',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrStepperModule, ClrConditionalModule, ClrInputModule],
    }),
  ],
  component: ClrStepper,
  argTypes: {
    // story helpers
    form: { ...hideControls('form').form, mapping: { [formMappingKey]: getForm() } },
    ...hideControls('ngSubmit', 'createArray'),
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
  render: args => ({
    template: `
      <form clrStepper [clrInitialStep]="clrInitialStep" [formGroup]="form" (ngSubmit)="ngSubmit()">
        @for (_ of createArray(stepCount); track $index; let i = $index) {
          <clr-stepper-panel formGroupName="step{{ i + 1 }}">
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
              @if (showPreviousButton) {
                <button clrStepButton="previous">previous</button>
              }
              @if (stepCount > i + 1) {
                <button id="next-button-{{ i + 1 }}" clrStepButton="next">next</button>
              }
              @if (stepCount === i + 1) {
                <button clrStepButton="submit">submit</button>
              }
            </clr-step-content>
          </clr-stepper-panel>
        }
      </form>
    `,
    props: { ...args },
  }),
};

export default meta;

type Story = StoryObj<StepperArgs>;

function getForm({ firstStepControlValue = undefined }: { firstStepControlValue?: string } = {}) {
  const controls: { [key: string]: AbstractControl } = {};

  for (let i = 0; i < 100; i++) {
    controls[`step${i + 1}`] = new FormGroup({
      value: new FormControl(i === 0 ? firstStepControlValue : undefined),
    });
  }

  return new FormGroup(controls);
}

export const Stepper: Story = {};

export const StepperWithPreviousButton: Story = {
  args: {
    showPreviousButton: true,
  },
};

export const StepperAlignmentTest: Story = {
  args: {
    alignmentTest: true,
  },
};

export const StepperLongTitleWithDescriptions: Story = {
  // render-override: this story uses a hand-written three-panel stepper with one very long title, which the step-count-driven meta template cannot express
  render: args => ({
    template: longTitleTemplate,
    props: { ...args },
  }),
  args: {
    showDescriptions: true,
  },
};

export const StepperLongTitleWithoutDescriptions: Story = {
  // render-override: same hand-written three-panel stepper as the story above, with the descriptions switched off
  render: args => ({
    template: longTitleTemplate,
    props: { ...args },
  }),
  args: {
    showDescriptions: false,
  },
};

function getNestedForm() {
  return new FormGroup({
    outer1: new FormGroup({
      value: new FormControl(''),
      inner: new FormGroup({
        inner1: new FormGroup({ detail: new FormControl('') }),
        inner2: new FormGroup({ detail: new FormControl('') }),
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

export const NestedStepper: Story = {
  // render-override: this story nests a second stepper inside the first panel and drives it from a second form group, which the meta template cannot express
  render: args => ({
    template: `
      <form clrStepper [formGroup]="nestedForm">
        <clr-stepper-panel formGroupName="outer1">
          <clr-step-title>Outer Step 1 – Has Nested Stepper</clr-step-title>
          <clr-step-description>This step contains a nested stepper workflow.</clr-step-description>
          <clr-step-content *clrIfExpanded>
            <clr-input-container>
              <label>Outer Value</label>
              <input clrInput formControlName="value" />
            </clr-input-container>

            <h4 style="margin: 0.5rem 0">Nested Stepper</h4>
            <form clrStepper [formGroup]="innerForm">
              <clr-stepper-panel formGroupName="inner1">
                <clr-step-title>Inner Step 1</clr-step-title>
                <clr-step-description>First nested sub-step.</clr-step-description>
                <clr-step-content *clrIfExpanded>
                  <clr-input-container>
                    <label>Detail</label>
                    <input clrInput formControlName="detail" />
                  </clr-input-container>
                  <button clrStepButton="next">next</button>
                </clr-step-content>
              </clr-stepper-panel>

              <clr-stepper-panel formGroupName="inner2">
                <clr-step-title>Inner Step 2</clr-step-title>
                <clr-step-description>Second nested sub-step.</clr-step-description>
                <clr-step-content *clrIfExpanded>
                  <clr-input-container>
                    <label>Detail</label>
                    <input clrInput formControlName="detail" />
                  </clr-input-container>
                  <button clrStepButton="submit">finish inner</button>
                </clr-step-content>
              </clr-stepper-panel>
            </form>

            <button clrStepButton="next">next</button>
          </clr-step-content>
        </clr-stepper-panel>

        <clr-stepper-panel formGroupName="outer2">
          <clr-step-title>Outer Step 2</clr-step-title>
          <clr-step-description>Continue with the outer workflow.</clr-step-description>
          <clr-step-content *clrIfExpanded>
            <clr-input-container>
              <label>Value</label>
              <input clrInput formControlName="value" />
            </clr-input-container>
            <button clrStepButton="next">next</button>
          </clr-step-content>
        </clr-stepper-panel>

        <clr-stepper-panel formGroupName="outer3">
          <clr-step-title>Outer Step 3 – Submit</clr-step-title>
          <clr-step-description>Review and submit.</clr-step-description>
          <clr-step-content *clrIfExpanded>
            <clr-input-container>
              <label>Summary</label>
              <input clrInput formControlName="summary" />
            </clr-input-container>
            <button clrStepButton="submit">submit</button>
          </clr-step-content>
        </clr-stepper-panel>
      </form>
    `,
    props: {
      ...args,
      nestedForm: args.nestedForm,
      innerForm: (args.nestedForm as FormGroup).get('outer1.inner'),
    },
  }),
  argTypes: {
    ...hideControls('form'),
    nestedForm: {
      ...hideControls('nestedForm').nestedForm,
      mapping: { [nestedFormMappingKey]: getNestedForm() },
    },
  },
  args: {
    nestedForm: nestedFormMappingKey,
  },
};

export const StepperPanelStatusIndicators: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const nextButton1 = await canvasElement.querySelector<HTMLButtonElement>('#next-button-1');
    await userEvent.click(nextButton1);
    const nextButton2 = await canvasElement.querySelector<HTMLButtonElement>('#next-button-2');
    await userEvent.click(nextButton2);
  },
  argTypes: {
    // story helpers
    form: {
      ...hideControls('form').form,
      mapping: { [formMappingKey]: getForm({ firstStepControlValue: 'test value' }) },
    },
  },
};
