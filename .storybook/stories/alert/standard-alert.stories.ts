/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAlert, ClrAlertModule } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { argsToTemplate, moduleMetadata, StoryContext, StoryObj } from '@storybook/angular';

import { CommonModules, removeFocusOutline } from '../../helpers/common';
import { StandardAlertStorybookComponent } from './standard-alert.storybook.component';

export default {
  title: 'Alert/Standard Alerts',
  component: ClrAlert,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrAlertModule, StandardAlertStorybookComponent],
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
    clrAlertClosable: false,
    clrAlertLightweight: false,
    clrAlertClosedChange: action('clrAlertClosedChange'),
  },
  render: (args: StandardAlertStorybookComponent) => ({
    props: {
      ...args,
    },
    template: `
      <storybook-standard-alert ${argsToTemplate(args)}></storybook-standard-alert>
    `,
  }),
};

export const SingleAlert: StoryObj = {
  args: {
    alertCount: 1,
    alertTypes: ['info'],
  },
};

export const Alert: StoryObj = {};

export const Small: StoryObj = {
  args: {
    clrAlertSizeSmall: true,
  },
};

export const SmallLightweight: StoryObj = {
  args: {
    clrAlertSizeSmall: true,
    clrAlertLightweight: true,
  },
};

export const Closable: StoryObj = {
  args: {
    clrAlertClosable: true,
  },
};

export const Lightweight: StoryObj = {
  args: {
    clrAlertLightweight: true,
    clrCloseButtonAriaLabel: { table: { disable: true } },
    clrAlertClosable: { value: false, table: { disable: true } },
  },
};

export const DifferentIcon: StoryObj = {
  args: {
    clrAlertIcon: 'settings',
  },
};

export const WithActions: StoryObj = {
  args: {
    showActions: true,
  },
};

export const WithOpenActionsDropdown: StoryObj = {
  play: openDropdown,
  args: {
    alertCount: 1,
    showActions: true,
    alertTypes: ['info'],
  },
};

export const WithLongContentAndOpenActionsDropdown: StoryObj = {
  play: openDropdown,
  args: {
    alertCount: 1,
    content: `
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
      voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
      non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    `,
    showActions: true,
    alertTypes: ['info'],
  },
};

function openDropdown({ canvasElement }: StoryContext) {
  canvasElement.querySelector<HTMLButtonElement>('button[clrDropdownTrigger]').click();

  setTimeout(() => {
    removeFocusOutline({ canvasElement });
  }, 0);
}
