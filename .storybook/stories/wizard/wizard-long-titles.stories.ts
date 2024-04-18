/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrWizard, ClrWizardModule, commonStringsDefault } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { removeFocusOutline } from '../../helpers/common';

export default {
  title: 'Wizard/Wizard Long Titles',
  component: ClrWizard,
  decorators: [
    moduleMetadata({
      imports: [ClrWizardModule],
    }),
  ],
  argTypes: {
    // inputs
    clrHeadingLevel: { control: { type: 'number', min: 1, max: 6 } },
    clrWizardSize: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
    // outputs
    clrWizardOpenChange: { control: { disable: true } },
    clrWizardCurrentPageChanged: { control: { disable: true } },
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
    // outputs
    clrWizardOpenChange: action('clrWizardOpenChange'),
    clrWizardCurrentPageChanged: action('clrWizardCurrentPageChanged'),
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
        iframeHeight: 700,
      },
    },
  },
};

const WizardLongTitlesTemplate: StoryFn = args => ({
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
      (clrWizardOpenChange)="clrWizardOpenChange($event)"
      (clrWizardCurrentPageChanged)="clrWizardCurrentPageChanged($event)"
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

      <clr-wizard-page *ngFor="let _ of createArray(pageCount); let i = index">
        <ng-template clrPageTitle>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua Page {{ i + 1 }}
        </ng-template>
        <p>Content for page {{ i + 1 }}.</p>
      </clr-wizard-page>
    </clr-wizard>
  `,
  props: { ...args },
});

export const WizardLongTitles: StoryObj = {
  render: WizardLongTitlesTemplate,
  play: removeFocusOutline,
};
