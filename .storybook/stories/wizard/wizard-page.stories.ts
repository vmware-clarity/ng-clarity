/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { action } from '@storybook/addon-actions';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { ClrWizardModule, ClrWizardPage } from '../../../projects/angular/src';
import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
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
        <ng-template clrPageTitle>Story Page</ng-template>
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

const defaultParameters: Parameters = {
  title: 'Wizard/Wizard Page',
  component: ClrWizardPage,
  argTypes: {
    // inputs
    clrWizardPageHasError: { defaultValue: false },
    clrWizardPageNextDisabled: { defaultValue: false },
    clrWizardPagePreventDefault: { defaultValue: false, control: { type: 'boolean' } },
    clrWizardPagePreventDefaultCancel: { defaultValue: false },
    clrWizardPagePreventDefaultNext: { defaultValue: false },
    clrWizardPagePreviousDisabled: { defaultValue: false },
    id: { defaultValue: '', control: { type: 'text' } },
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
};

const variants: Parameters[] = [];

setupStorybook(ClrWizardModule, defaultStory, defaultParameters, variants);
