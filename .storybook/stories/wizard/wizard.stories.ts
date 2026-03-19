/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrWizard, ClrWizardModule, commonStringsDefault } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';
import { action } from 'storybook/actions';

export default {
  title: 'Wizard/Wizard',
  component: ClrWizard,
  decorators: [
    moduleMetadata({
      imports: [ClrWizardModule],
    }),
  ],
  argTypes: {
    // inputs
    clrHeadingLevel: { control: { type: 'number', min: 1, max: 6 } },
    clrWizardSize: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg', 'xl', 'full-screen'] },
    clrWizardStepnavLayout: { control: { type: 'inline-radio' }, options: ['vertical', 'horizontal'] },
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
