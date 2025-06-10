/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrWizardModule, ClrWizardPage } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { removeFocusOutline } from '../../helpers/common';

export default {
  title: 'Wizard/Wizard Page',
  component: ClrWizardPage,
  decorators: [
    moduleMetadata({
      imports: [ClrWizardModule],
    }),
  ],
  argTypes: {
    // inputs
    clrHeadingLevel: { control: { type: 'number', min: 1, max: 6 } },
    // outputs
    clrWizardPageCustomButton: { control: { disable: true } },
    clrWizardPageDanger: { control: { disable: true } },
    clrWizardPageFinish: { control: { disable: true } },
    clrWizardPageNext: { control: { disable: true } },
    clrWizardPageNextDisabledChange: { control: { disable: true } },
    clrWizardPageOnCancel: { control: { disable: true } },
    clrWizardPageOnCommit: { control: { disable: true } },
    clrWizardPageOnLoad: { control: { disable: true } },
    clrWizardPagePreventDefaultCancelChange: { control: { disable: true } },
    clrWizardPagePrevious: { control: { disable: true } },
    clrWizardPagePreviousDisabledChange: { control: { disable: true } },
    clrWizardPagePrimary: { control: { disable: true } },
    // methods
    makeCurrent: { control: { disable: true } },
  },
  args: {
    // inputs
    clrHeadingLevel: 1,
    clrWizardPageHasError: false,
    clrWizardPageNextDisabled: false,
    clrWizardPagePreventDefault: false,
    clrWizardPagePreventDefaultCancel: false,
    clrWizardPagePreventDefaultNext: false,
    clrWizardPagePreviousDisabled: false,
    id: '',
    // outputs
    clrWizardPageCustomButton: action('clrWizardPageCustomButton'),
    clrWizardPageDanger: action('clrWizardPageDanger'),
    clrWizardPageFinish: action('clrWizardPageFinish'),
    clrWizardPageNext: action('clrWizardPageNext'),
    clrWizardPageNextDisabledChange: action('clrWizardPageNextDisabledChange'),
    clrWizardPageOnCancel: action('clrWizardPageOnCancel'),
    clrWizardPageOnCommit: action('clrWizardPageOnCommit'),
    clrWizardPageOnLoad: action('clrWizardPageOnLoad'),
    clrWizardPagePreventDefaultCancelChange: action('clrWizardPagePreventDefaultCancelChange'),
    clrWizardPagePrevious: action('clrWizardPagePrevious'),
    clrWizardPagePreviousDisabledChange: action('clrWizardPagePreviousDisabledChange'),
    clrWizardPagePrimary: action('clrWizardPagePrimary'),
  },
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 500,
      },
    },
  },
};

const WizardPageTemplate: StoryFn = args => ({
  template: `
    <clr-wizard [clrWizardOpen]="true">
      <clr-wizard-title>Wizard</clr-wizard-title>

      <clr-wizard-button type="cancel">Cancel</clr-wizard-button>
      <clr-wizard-button type="previous">Previous</clr-wizard-button>
      <clr-wizard-button type="next">Next</clr-wizard-button>
      <clr-wizard-button type="finish">Finish</clr-wizard-button>

      <clr-wizard-page>
        <ng-template clrPageTitle>First Page</ng-template>
        <p>Content for first page. Click next to see story page.</p>
      </clr-wizard-page>

      <clr-wizard-page
        [id]="id"
        [clrWizardPageHasError]="clrWizardPageHasError"
        [clrWizardPageNextDisabled]="clrWizardPageNextDisabled"
        [clrWizardPagePreventDefaultCancel]="clrWizardPagePreventDefaultCancel"
        [clrWizardPagePreventDefaultNext]="clrWizardPagePreventDefaultNext"
        [clrWizardPagePreviousDisabled]="clrWizardPagePreviousDisabled"
        (clrWizardPageCustomButton)="clrWizardPageCustomButton($event)"
        (clrWizardPageDanger)="clrWizardPageDanger($event)"
        (clrWizardPageFinish)="clrWizardPageFinish($event)"
        (clrWizardPageNext)="clrWizardPageNext($event)"
        (clrWizardPageNextDisabledChange)="clrWizardPageNextDisabledChange($event)"
        (clrWizardPageOnCancel)="clrWizardPageOnCancel($event)"
        (clrWizardPageOnCommit)="clrWizardPageOnCommit($event)"
        (clrWizardPageOnLoad)="clrWizardPageOnLoad($event)"
        (clrWizardPagePreventDefaultCancelChange)="clrWizardPagePreventDefaultCancelChange($event)"
        (clrWizardPagePrevious)="clrWizardPagePrevious($event)"
        (clrWizardPagePreviousDisabledChange)="clrWizardPagePreviousDisabledChange($event)"
        (clrWizardPagePrimary)="clrWizardPagePrimary($event)"
      >
        <ng-template clrPageTitle [clrHeadingLevel]="clrHeadingLevel">Story Page</ng-template>
        <p>Content for story page.</p>
      </clr-wizard-page>

      <clr-wizard-page>
        <ng-template clrPageTitle>Last Page</ng-template>
        <p>Content for last page. Click previous to see story page.</p>
      </clr-wizard-page>
    </clr-wizard>
  `,
  props: { ...args },
});

export const WizardPage: StoryObj = {
  render: WizardPageTemplate,
  play: removeFocusOutline,
};

export const WizardPageStatusIndicators: StoryObj = {
  render: WizardPageTemplate,
  play({ canvasElement }) {
    removeFocusOutline({ canvasElement });

    // navigate to the last page
    const nextButtonElement = canvasElement.querySelector<HTMLButtonElement>('clr-wizard-button[type="next"] button');
    nextButtonElement.click();
    nextButtonElement.click();
  },
  args: {
    clrWizardPageHasError: true,
  },
};

export const WizardPageStatusIndicatorsWithCurrentStepError: StoryObj = {
  render: WizardPageTemplate,
  play({ canvasElement }) {
    removeFocusOutline({ canvasElement });

    // navigate to the last page
    const nextButtonElement = canvasElement.querySelector<HTMLButtonElement>('clr-wizard-button[type="next"] button');
    nextButtonElement.click();
    nextButtonElement.click();

    // navigate back to the error step
    canvasElement.querySelector<HTMLButtonElement>('clr-wizard-button[type="previous"] button').click();
  },
  args: {
    clrWizardPageHasError: true,
  },
};
