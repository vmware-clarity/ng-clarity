/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormControl, FormGroup } from '@angular/forms';
import { ClrInputModule, ClrStepperModule, ClrWizard, ClrWizardModule, commonStringsDefault } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';
import { action } from 'storybook/actions';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Wizard/Wizard',
  component: ClrWizard,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrWizardModule, ClrStepperModule, ClrInputModule],
    }),
  ],
  argTypes: {
    // inputs
    clrHeadingLevel: { control: { type: 'number', min: 1, max: 6 } },
    clrWizardSize: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg', 'xl', 'full-screen'] },
    clrWizardStepnavLayout: { control: { type: 'inline-radio' }, options: ['vertical', 'horizontal'] },
    clrWizardFooterAlign: { control: { type: 'inline-radio' }, options: ['start', 'end'] },
    // outputs
    clrWizardOpenChange: { control: { disable: true } },
    clrWizardCurrentPageChange: { control: { disable: true } },
    clrWizardOnNext: { control: { disable: true } },
    clrWizardOnPrevious: { control: { disable: true } },
    clrWizardOnCancel: { control: { disable: true } },
    clrWizardOnFinish: { control: { disable: true } },
    clrWizardOnReset: { control: { disable: true } },
    // methods
    cancel: { control: { disable: true } },
    checkAndCancel: { control: { disable: true } },
    close: { control: { disable: true } },
    finish: { control: { disable: true } },
    forceFinish: { control: { disable: true } },
    forceNext: { control: { disable: true } },
    goTo: { control: { disable: true } },
    modalCancel: { control: { disable: true }, table: { disable: true } },
    next: { control: { disable: true } },
    open: { control: { disable: true } },
    previous: { control: { disable: true } },
    reset: { control: { disable: true } },
    toggle: { control: { disable: true } },
    // story helpers
    createArray: { control: { disable: true }, table: { disable: true } },
    pageCount: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    // inputs
    clrWizardOpen: true, // the default value is really false, but that doesn't really work for the story
    clrWizardSize: 'xl',
    clrHeadingLevel: 1,
    clrWizardClosable: true,
    clrWizardDisableStepnav: false,
    clrWizardPreventNavigation: false,
    clrWizardForceForwardNavigation: false,
    clrWizardPreventDefaultNext: false,
    clrWizardPreventDefaultCancel: false,
    clrWizardStepnavAriaLabel: commonStringsDefault.wizardStepnavAriaLabel,
    clrWizardStepnavLayout: 'vertical',
    clrWizardFooterAlign: undefined,
    // outputs
    clrWizardOpenChange: action('clrWizardOpenChange'),
    clrWizardCurrentPageChange: action('clrWizardCurrentPageChange'),
    clrWizardOnNext: action('clrWizardOnNext'),
    clrWizardOnPrevious: action('clrWizardOnPrevious'),
    clrWizardOnCancel: action('clrWizardOnCancel'),
    clrWizardOnFinish: action('clrWizardOnFinish'),
    clrWizardOnReset: action('clrWizardOnFinish'),
    // story helpers
    createArray: n => new Array(n),
    pageCount: 4,
  },
  parameters: {
    docs: {
      story: {
        inline: false,
        height: 700,
      },
    },
  },
};

const WizardTemplate: StoryFn = args => ({
  template: `
    <clr-wizard
      [clrWizardOpen]="clrWizardOpen"
      [clrWizardClosable]="clrWizardClosable"
      [clrWizardDisableStepnav]="clrWizardDisableStepnav"
      [clrWizardPreventNavigation]="clrWizardPreventNavigation"
      [clrWizardForceForwardNavigation]="clrWizardForceForwardNavigation"
      [clrWizardPreventDefaultNext]="clrWizardPreventDefaultNext"
      [clrWizardPreventDefaultCancel]="clrWizardPreventDefaultCancel"
      [clrWizardSize]="clrWizardSize"
      [clrWizardStepnavAriaLabel]="clrWizardStepnavAriaLabel"
      [clrWizardStepnavLayout]="clrWizardStepnavLayout"
      [clrWizardFooterAlign]="clrWizardFooterAlign"
      (clrWizardOpenChange)="clrWizardOpenChange($event)"
      (clrWizardCurrentPageChange)="clrWizardCurrentPageChange($event)"
      (clrWizardOnNext)="clrWizardOnNext($event)"
      (clrWizardOnPrevious)="clrWizardOnPrevious($event)"
      (clrWizardOnCancel)="clrWizardOnCancel($event)"
      (clrWizardOnFinish)="clrWizardOnFinish($event)"
      (clrWizardOnReset)="clrWizardOnReset($event)"
    >
      <clr-wizard-title [clrHeadingLevel]="clrHeadingLevel">Wizard</clr-wizard-title>

      <clr-wizard-button type="cancel">Cancel</clr-wizard-button>
      <clr-wizard-button type="previous">Previous</clr-wizard-button>
      <clr-wizard-button type="next">Next</clr-wizard-button>
      <clr-wizard-button type="finish">Finish</clr-wizard-button>

      @for (_ of createArray(pageCount); track $index; let i = $index) {
        <clr-wizard-page>
          <ng-template clrPageTitle>Page {{ i + 1 }}</ng-template>
          <p>Content for page {{ i + 1 }}.</p>
        </clr-wizard-page>
      }
    </clr-wizard>
  `,
  props: { ...args },
});

export const Wizard: StoryObj = {
  render: WizardTemplate,
};

export const FullScreenWizard: StoryObj = {
  render: WizardTemplate,
  args: {
    clrWizardSize: 'full-screen',
  },
};

export const HorizontalWizard: StoryObj = {
  render: WizardTemplate,
  args: {
    clrWizardStepnavLayout: 'horizontal',
    pageCount: 8,
  },
};

export const HorizontalWizardOverflow: StoryObj = {
  render: WizardTemplate,
  args: {
    clrWizardStepnavLayout: 'horizontal',
    pageCount: 20,
  },
};

const NestedWizardTemplate: StoryFn = args => ({
  template: `
    <clr-wizard
      #parentWizard
      [clrWizardOpen]="clrWizardOpen"
      [clrWizardSize]="clrWizardSize"
      [clrWizardStepnavLayout]="clrWizardStepnavLayout"
      [clrWizardStepnavAriaLabel]="clrWizardStepnavAriaLabel"
      [clrWizardHideFooter]="parentWizard.currentPage?.id == parentWizard.pages?.first?.id"
    >
      <clr-wizard-title>Outer Wizard</clr-wizard-title>

      <clr-wizard-button type="cancel">Cancel</clr-wizard-button>
      <clr-wizard-button type="previous">Previous</clr-wizard-button>
      <clr-wizard-button type="next">Next</clr-wizard-button>
      <clr-wizard-button type="finish">Finish</clr-wizard-button>

      <clr-wizard-page [clrWizardPageNextDisabled]="!nestedWizardComplete">
        <ng-template clrPageNavTitle>Configuration</ng-template>
        <clr-wizard
          [clrWizardInPage]="true"
          [clrWizardInPageFillContentArea]="true"
          [clrWizardClosable]="false"
          (clrWizardOnFinish)="nestedWizardComplete = true; parentWizard.forceNext()"
        >
          <clr-wizard-title>Nested Wizard</clr-wizard-title>

          <clr-wizard-button type="previous">Previous</clr-wizard-button>
          <clr-wizard-button type="next">Next</clr-wizard-button>
          <clr-wizard-button type="finish">Continue</clr-wizard-button>
          <clr-wizard-page>
            <ng-template clrPageTitle>Nested Step 1</ng-template>
            <p>Content for nested step 1.</p>
          </clr-wizard-page>
          <clr-wizard-page>
            <ng-template clrPageTitle>Nested Step 2</ng-template>
            <p>Content for nested step 2.</p>
          </clr-wizard-page>
          <clr-wizard-page>
            <ng-template clrPageTitle>Nested Step 3</ng-template>
            <p>Content for nested step 3.</p>
          </clr-wizard-page>
        </clr-wizard>
      </clr-wizard-page>

      <clr-wizard-page>
        <ng-template clrPageTitle>Review</ng-template>
        <p>Review the data from the nested wizard.</p>
      </clr-wizard-page>

      <clr-wizard-page>
        <ng-template clrPageTitle>Summary</ng-template>
        <p>All done.</p>
      </clr-wizard-page>
    </clr-wizard>
  `,
  props: { ...args, nestedWizardComplete: false },
});

export const NestedWizardHorizontal: StoryObj = {
  render: NestedWizardTemplate,
  args: {
    clrWizardStepnavLayout: 'horizontal',
  },
};

function getStepperForm() {
  return new FormGroup({
    name: new FormGroup({ value: new FormControl('') }),
    description: new FormGroup({ value: new FormControl('') }),
    details: new FormGroup({ value: new FormControl('') }),
  });
}

const stepperFormMappingKey = 'stepper-form-mapping-key';

const NestedStepperTemplate: StoryFn = args => ({
  template: `
    <clr-wizard
      #parentWizard
      [clrWizardOpen]="clrWizardOpen"
      [clrWizardSize]="clrWizardSize"
      [clrWizardStepnavLayout]="clrWizardStepnavLayout"
      [clrWizardStepnavAriaLabel]="clrWizardStepnavAriaLabel"
    >
      <clr-wizard-title>Wizard with Stepper</clr-wizard-title>

      <clr-wizard-button type="cancel">Cancel</clr-wizard-button>
      <clr-wizard-button type="previous">Previous</clr-wizard-button>
      <clr-wizard-button type="next">Next</clr-wizard-button>
      <clr-wizard-button type="finish">Finish</clr-wizard-button>

      <clr-wizard-page [clrWizardPageNextDisabled]="!stepperComplete">
        <ng-template clrPageNavTitle>Configuration</ng-template>

        <form clrStepper [formGroup]="stepperForm" (ngSubmit)="stepperComplete = true; parentWizard.forceNext()">
          <clr-stepper-panel formGroupName="name">
            <clr-step-title>Name</clr-step-title>
            <clr-step-description>Provide a name.</clr-step-description>
            <clr-step-content>
              <clr-input-container>
                <label>Name</label>
                <input clrInput formControlName="value" />
              </clr-input-container>
              <button clrStepButton="next">Next</button>
            </clr-step-content>
          </clr-stepper-panel>

          <clr-stepper-panel formGroupName="description">
            <clr-step-title>Description</clr-step-title>
            <clr-step-description>Add a description.</clr-step-description>
            <clr-step-content>
              <clr-input-container>
                <label>Description</label>
                <input clrInput formControlName="value" />
              </clr-input-container>
              <button clrStepButton="next">Next</button>
            </clr-step-content>
          </clr-stepper-panel>

          <clr-stepper-panel formGroupName="details">
            <clr-step-title>Details</clr-step-title>
            <clr-step-description>Final details.</clr-step-description>
            <clr-step-content>
              <clr-input-container>
                <label>Details</label>
                <input clrInput formControlName="value" />
              </clr-input-container>
              <button clrStepButton="submit">Continue</button>
            </clr-step-content>
          </clr-stepper-panel>
        </form>
      </clr-wizard-page>

      <clr-wizard-page>
        <ng-template clrPageTitle>Review</ng-template>
        <p>Review the stepper data.</p>
      </clr-wizard-page>

      <clr-wizard-page>
        <ng-template clrPageTitle>Summary</ng-template>
        <p>All done.</p>
      </clr-wizard-page>
    </clr-wizard>
  `,
  props: { ...args, stepperComplete: false },
});

export const NestedStepperHorizontal: StoryObj = {
  render: NestedStepperTemplate,
  argTypes: {
    stepperForm: {
      control: { disable: true },
      table: { disable: true },
      mapping: { [stepperFormMappingKey]: getStepperForm() },
    },
  },
  args: {
    clrWizardStepnavLayout: 'horizontal',
    stepperForm: stepperFormMappingKey,
  },
};
