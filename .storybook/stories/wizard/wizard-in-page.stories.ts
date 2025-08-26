/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ClrMainContainerModule,
  ClrNavigationModule,
  ClrWizard,
  ClrWizardModule,
  commonStringsDefault,
} from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';
import { action } from 'storybook/actions';

export default {
  title: 'Wizard/Wizard (in-page)',
  component: ClrWizard,
  decorators: [
    moduleMetadata({
      imports: [ClrMainContainerModule, ClrNavigationModule, ClrWizardModule],
    }),
  ],
  argTypes: {
    // inputs
    clrHeadingLevel: { control: { type: 'number', min: 1, max: 6 } },
    // hidden inputs (these are not relevant to this story)
    clrWizardOpen: { control: { disable: true }, table: { disable: true } },
    clrWizardClosable: { control: { disable: true }, table: { disable: true } },
    clrWizardSize: { control: { disable: true }, table: { disable: true } },
    clrWizardInPage: { control: { disable: true }, table: { disable: true } },
    clrWizardPreventModalAnimation: { control: { disable: true }, table: { disable: true } },
    // outputs
    clrWizardCurrentPageChanged: { control: { disable: true } },
    clrWizardOnNext: { control: { disable: true } },
    clrWizardOnPrevious: { control: { disable: true } },
    clrWizardOnCancel: { control: { disable: true } },
    clrWizardOnFinish: { control: { disable: true } },
    clrWizardOnReset: { control: { disable: true } },
    // hidden outputs (these are not relevant to this story)
    clrWizardOpenChange: { control: { disable: true }, table: { disable: true } },
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
    clrHeadingLevel: 1,
    clrWizardDisableStepnav: false,
    clrWizardPreventNavigation: false,
    clrWizardForceForwardNavigation: false,
    clrWizardPreventDefaultNext: false,
    clrWizardPreventDefaultCancel: false,
    clrWizardInPageFillContentArea: false,
    clrWizardStepnavAriaLabel: commonStringsDefault.wizardStepnavAriaLabel,
    // outputs
    clrWizardCurrentPageChanged: action('clrWizardCurrentPageChanged'),
    clrWizardOnNext: action('clrWizardOnNext'),
    clrWizardOnPrevious: action('clrWizardOnPrevious'),
    clrWizardOnCancel: function (...args) {
      action('clrWizardOnCancel').apply(this, args);
      alert(
        'The application should handle cancelling an in-page wizard by navigating to a different page or taking some other appropriate action.'
      );
    },
    clrWizardOnFinish: function (...args) {
      action('clrWizardOnFinish').apply(this, args);
      alert(
        'The application should handle submitting an in-page wizard by navigating to a different page or taking some other appropriate action.'
      );
    },
    clrWizardOnReset: action('clrWizardOnFinish'),
    // story helpers
    createArray: n => new Array(n),
    pageCount: 4,
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

const InPageWizardTemplate: StoryFn = args => ({
  template: `
    <style>
      ::ng-deep body.sb-main-padded.sb-main-padded {
        padding: 0;
      }
    </style>
    <clr-main-container>
      <clr-header>
        <div class="branding">
          <a href="javascript://" class="nav-link">
            <cds-icon shape="vm-bug"></cds-icon>
            <span class="title">Page Header</span>
          </a>
        </div>
      </clr-header>
      <div class="content-container">
        <div class="content-area">
          <clr-wizard
            [clrWizardInPage]="true"
            [clrWizardInPageFillContentArea]="clrWizardInPageFillContentArea"
            [clrWizardClosable]="false"
            [clrWizardDisableStepnav]="clrWizardDisableStepnav"
            [clrWizardPreventNavigation]="clrWizardPreventNavigation"
            [clrWizardForceForwardNavigation]="clrWizardForceForwardNavigation"
            [clrWizardPreventDefaultNext]="clrWizardPreventDefaultNext"
            [clrWizardPreventDefaultCancel]="clrWizardPreventDefaultCancel"
            [clrWizardStepnavAriaLabel]="clrWizardStepnavAriaLabel"
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
              <ng-template clrPageTitle>Page {{ i + 1 }}</ng-template>
              <p>Content for page {{ i + 1 }}.</p>
            </clr-wizard-page>
          </clr-wizard>
        </div>
      </div>
    </clr-main-container>
  `,
  props: { ...args },
});

export const InPageWizard: StoryObj = {
  render: InPageWizardTemplate,
};

export const InPageWizardFillContentArea: StoryObj = {
  render: InPageWizardTemplate,
  args: {
    clrWizardInPageFillContentArea: true,
  },
};
