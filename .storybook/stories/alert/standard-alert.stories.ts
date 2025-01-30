/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAlert, ClrAlertModule, ClrDropdownModule, commonStringsDefault } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryContext, StoryFn, StoryObj } from '@storybook/angular';

import { ALERT_TYPES } from '../../../projects/angular/src/emphasis/alert/utils/alert-types';
import { CommonModules, removeFocusOutline } from '../../helpers/common';

export default {
  title: 'Alert/Standard Alerts',
  component: ClrAlert,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrAlertModule, ClrDropdownModule],
    }),
  ],
  argTypes: {
    // inputs
    clrAlertIcon: {
      description: 'Changes the leading icon of an alert from the default icon to the icon cds-icon value specified.',
      control: 'radio',
      options: ['Default', 'settings'],
      mapping: { Default: '' },
    },
    clrAlertLightweight: {
      description: 'Less prominent type of alert. Not compatible with `clrAlertClosable` or `clrAlertAppLevel`',
      control: 'boolean',
    },
    clrCloseButtonAriaLabel: {
      description:
        'Application level alert. Intended to be used at the top of an application for application wide alerts',
      control: 'text',
      if: { arg: 'clrAlertClosable', exists: false },
    },
    clrAlertClosable: {
      description: 'Adds a close button and allows the user to dismiss this alert',
      control: 'boolean',
      if: { arg: 'clrAlertLightweight', eq: false },
    },
    clrAlertSizeSmall: {
      description: 'Renders the alert in a compact, smaller view',
      control: 'boolean',
    },
    // outputs
    clrAlertClosedChange: { control: { disable: true } },
    // methods
    close: { control: { disable: true } },
    open: { control: { disable: true } },
    // story helpers
    createArray: { control: { disable: true }, table: { disable: true } },
    ALERT_TYPES: { control: { disable: true }, table: { disable: true } },
    clrAlertType: { control: { disable: true }, table: { disable: true } },
    clrAlertClosed: { control: { disable: true }, table: { disable: true } },
    clrAlertAppLevel: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // inputs
    clrAlertIcon: 'Default',
    clrAlertLightweight: false,
    clrCloseButtonAriaLabel: commonStringsDefault.alertCloseButtonAriaLabel,
    clrAlertClosable: false,
    clrAlertSizeSmall: false,
    // outputs
    clrAlertClosedChange: action('clrAlertClosedChange'),
    // story helpers
    createArray: n => new Array(n),
    itemCount: 3,
    content: 'Hello World!',
    showActions: false,
    ALERT_TYPES,
  },
};

const template = `
  <div *ngFor="let alert of ALERT_TYPES" style="margin-top: 5px">
    <clr-alert
      [clrAlertClosable]="clrAlertClosable"
      [clrAlertIcon]="clrAlertIcon"
      [clrAlertLightweight]="clrAlertLightweight"
      [clrAlertSizeSmall]="clrAlertSizeSmall"
      [clrAlertType]="alert"
      [clrCloseButtonAriaLabel]="clrCloseButtonAriaLabel"
      (clrAlertClosedChange)="clrAlertClosedChange($event)"
    >
      <clr-alert-item *ngFor="let _ of createArray(itemCount); let i = index">
        <span class="alert-text">{{ content }} {{ i + 1 }}</span>
        <div *ngIf="showActions" class="alert-actions">
          <clr-dropdown>
            <button clrDropdownTrigger>
              Actions
              <cds-icon shape="angle" direction="down"></cds-icon>
            </button>
            <clr-dropdown-menu clrPosition="bottom-right">
              <button clrDropdownItem>Shutdown</button>
              <button clrDropdownItem>Delete</button>
              <button clrDropdownItem>Reboot</button>
            </clr-dropdown-menu>
          </clr-dropdown>
          <a class="alert-action" href="javascript://">Ignore</a>
        </div>
      </clr-alert-item>
    </clr-alert>
  </div>
`;

const AlertTemplate: StoryFn = args => ({
  template,
  props: args,
});

export const Alert: StoryObj = {
  render: AlertTemplate,
};

export const Small: StoryObj = {
  render: AlertTemplate,
  args: {
    clrAlertSizeSmall: true,
  },
};

export const SmallLightweight: StoryObj = {
  render: AlertTemplate,
  args: {
    clrAlertSizeSmall: true,
    clrAlertLightweight: true,
  },
};

export const Closable: StoryObj = {
  render: AlertTemplate,
  args: {
    clrAlertClosable: { value: true, table: { disable: true } },
  },
};

export const Lightweight: StoryObj = {
  render: AlertTemplate,
  args: {
    clrAlertLightweight: true,
    clrCloseButtonAriaLabel: { table: { disable: true } },
    clrAlertClosable: { value: false, table: { disable: true } },
  },
};

export const DifferentIcon: StoryObj = {
  render: AlertTemplate,
  args: {
    clrAlertIcon: 'settings',
  },
};

export const WithActions: StoryObj = {
  render: AlertTemplate,
  args: {
    showActions: true,
  },
};

export const WithOpenActionsDropdown: StoryObj = {
  render: AlertTemplate,
  play: openDropdown,
  args: {
    itemCount: 1,
    showActions: true,
    ALERT_TYPES: ['info'],
  },
};

export const WithLongContentAndOpenActionsDropdown: StoryObj = {
  render: AlertTemplate,
  play: openDropdown,
  args: {
    itemCount: 1,
    content: `
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
      voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
      non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    `,
    showActions: true,
    ALERT_TYPES: ['info'],
  },
};

function openDropdown({ canvasElement }: StoryContext) {
  canvasElement.querySelector<HTMLButtonElement>('button[clrDropdownTrigger]').click();

  setTimeout(() => {
    removeFocusOutline({ canvasElement });
  }, 0);
}
