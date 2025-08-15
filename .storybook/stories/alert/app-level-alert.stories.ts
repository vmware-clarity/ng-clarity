/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAlert, ClrAlertModule, commonStringsDefault } from '@clr/angular';
import { argsToTemplate, moduleMetadata, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';
import { AppLevelAlertStorybookComponent } from './app-level-alert.storybook.component';

export default {
  title: 'Alert/App Level Alerts',
  component: ClrAlert,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrAlertModule, AppLevelAlertStorybookComponent],
    }),
  ],
  argTypes: {
    // inputs
    clrAlertIcon: {
      description: 'Changes the leading icon of an alert from the default icon to the icon cds-icon value specified',
      control: 'radio',
      options: ['Default', 'settings'],
      mapping: { Default: '' },
    },
    clrCloseButtonAriaLabel: {
      description: 'Aria label for the close button. Only used if the close button is rendered',
      control: 'text',
    },
    clrAlertClosable: {
      description: 'Adds a close button and allows the user to dismiss this alert',
      control: 'boolean',
    },
    // methods
    close: { control: { disable: true } },
    open: { control: { disable: true } },
    // story helpers
    clrAlertType: { control: { disable: true }, table: { disable: true } },
    clrAlertClosed: { control: { disable: true }, table: { disable: true } },
    clrAlertAppLevel: { control: { disable: true }, table: { disable: true } },
    clrAlertSizeSmall: { control: { disable: true }, table: { disable: true } },
    clrAlertLightweight: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // inputs
    clrAlertIcon: null,
    clrCloseButtonAriaLabel: commonStringsDefault.alertCloseButtonAriaLabel,
    clrAlertClosable: false,
    // outputs
    // story helpers
    alertCount: 3,
    content: 'Hello World!',
    showAction: true,
    showActions: false,
    paginated: false,
  },
  render: (args: AppLevelAlertStorybookComponent) => ({
    props: {
      ...args,
    },
    template: `
      <storybook-app-level-alert ${argsToTemplate(args)}></storybook-app-level-alert>
    `,
  }),
};

export const SingleAlert: StoryObj = {
  args: {
    alertTypes: ['info'],
    alertCount: 1,
    showAction: false,
  },
};

export const Alert: StoryObj = {};

export const DifferentIcon: StoryObj = {
  args: {
    clrAlertIcon: 'settings',
  },
};

export const Closable: StoryObj = {
  args: {
    clrAlertClosable: true,
  },
};

export const WithActions: StoryObj = {
  args: {
    showActions: true,
  },
};

const paginatedArgTypes = {
  clrCloseButtonAriaLabel: { control: false, table: { disable: true } },
  alertCount: { control: false, table: { disable: true } },
  close: { control: false, table: { disable: true } },
  open: { control: false, table: { disable: true } },
};

export const Paginated: StoryObj = {
  argTypes: paginatedArgTypes,
  args: {
    paginated: true,
    clrAlertClosable: false,
  },
};

export const PaginatedWithActions: StoryObj = {
  argTypes: paginatedArgTypes,
  args: {
    paginated: true,
    clrAlertClosable: false,
    showActions: true,
  },
};

export const PaginatedClosable: StoryObj = {
  argTypes: paginatedArgTypes,
  args: {
    paginated: true,
    clrAlertClosable: true,
    clrCloseButtonAriaLabel: 'Dismiss alert',
  },
};
