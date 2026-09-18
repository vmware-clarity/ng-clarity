/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrWizardModule, ClrWizardPage } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { action } from 'storybook/actions';

/**
 * `ClrWizardPage` aliases every one of its inputs and outputs (`@Input('clrWizardPageHasError')
 * hasError`), so the class cannot be the args type: none of the `clrWizardPage*` names the story binds
 * are properties of it. The args are therefore declared standalone, with `makeCurrent` picked from the
 * component so the `argTypes` entry that hides that method stays type-checked.
 */
type WizardPageArgs = Pick<ClrWizardPage, 'makeCurrent'> & {
  // inputs
  clrHeadingLevel: number;
  clrWizardPageHasError: boolean;
  clrWizardPageNextDisabled: boolean;
  clrWizardPagePreventDefault: boolean;
  clrWizardPagePreventDefaultCancel: boolean;
  clrWizardPagePreventDefaultNext: boolean;
  clrWizardPagePreviousDisabled: boolean;
  id: string;
  // outputs
  clrWizardPageCustomButton: (event: unknown) => void;
  clrWizardPageDanger: (event: unknown) => void;
  clrWizardPageFinish: (event: unknown) => void;
  clrWizardPageNext: (event: unknown) => void;
  clrWizardPageNextDisabledChange: (event: unknown) => void;
  clrWizardPageOnCancel: (event: unknown) => void;
  clrWizardPageOnCommit: (event: unknown) => void;
  clrWizardPageOnLoad: (event: unknown) => void;
  clrWizardPagePreventDefaultCancelChange: (event: unknown) => void;
  clrWizardPagePrevious: (event: unknown) => void;
  clrWizardPagePreviousDisabledChange: (event: unknown) => void;
  clrWizardPagePrimary: (event: unknown) => void;
};

const meta: Meta<WizardPageArgs> = {
  title: 'Components/Flows/Wizard/Page',
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
        height: 700,
      },
    },
  },
  render: args => ({
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
  }),
};

export default meta;

type Story = StoryObj<WizardPageArgs>;

export const WizardPage: Story = {};

export const WizardPageStatusIndicators: Story = {
  play: async ({ canvasElement, userEvent }) => {
    // navigate to the last page
    const nextButtonElement = await canvasElement.querySelector<HTMLButtonElement>(
      'clr-wizard-button[type="next"] button'
    );
    await userEvent.click(nextButtonElement);
    await userEvent.click(nextButtonElement);
  },
  args: {
    clrWizardPageHasError: true,
  },
};

export const WizardPageStatusIndicatorsWithCurrentStepError: Story = {
  play: async ({ canvasElement, userEvent }) => {
    // navigate to the last page
    const nextButtonElement = await canvasElement.querySelector<HTMLButtonElement>(
      'clr-wizard-button[type="next"] button'
    );
    await userEvent.click(nextButtonElement);
    await userEvent.click(nextButtonElement);

    // navigate back to the error step
    const previousButtonElement = await canvasElement.querySelector<HTMLButtonElement>(
      'clr-wizard-button[type="previous"] button'
    );
    await userEvent.click(previousButtonElement);
  },
  args: {
    clrWizardPageHasError: true,
  },
};
