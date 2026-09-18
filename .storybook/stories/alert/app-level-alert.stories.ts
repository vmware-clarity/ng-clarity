/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAlert, ClrAlertModule, commonStringsDefault } from '@clr/angular';
import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

import { AppLevelAlertStorybookComponent } from './app-level-alert.storybook.component';

/**
 * The args drive `<storybook-app-level-alert>`, so the args type is that wrapper. `ClrAlert` itself
 * cannot be used -- it aliases every input (`@Input('clrAlertClosable') closable`), so none of the
 * `clr*` names the story binds are properties of the class. `close` and `open` are picked from
 * `ClrAlert` only so the `argTypes` entries that hide those two methods stay type-checked.
 */
type AppLevelAlertArgs = AppLevelAlertStorybookComponent & Pick<ClrAlert, 'close' | 'open'>;

/** Shared by the three paginated stories, which hide the args that the paginated view ignores. */
const paginatedArgTypes = hideControls('clrCloseButtonAriaLabel', 'alertCount', 'close', 'open');

const meta: Meta<AppLevelAlertArgs> = {
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
      control: { type: 'radio' },
      options: ['Default', 'settings'],
      mapping: { Default: '' },
    },
    clrCloseButtonAriaLabel: {
      description: 'Aria label for the close button. Only used if the close button is rendered',
      control: { type: 'text' },
    },
    clrAlertClosable: {
      description: 'Adds a close button and allows the user to dismiss this alert',
      control: { type: 'boolean' },
    },
    // methods
    close: { control: { disable: true } },
    open: { control: { disable: true } },
    // story helpers
    ...hideControls('clrAlertType', 'clrAlertClosed', 'clrAlertAppLevel', 'clrAlertSizeSmall', 'clrAlertLightweight'),
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
  render: args => ({
    props: {
      ...args,
    },
    template: `
      <storybook-app-level-alert ${argsToTemplate(args)}></storybook-app-level-alert>
    `,
  }),
};

export default meta;

type Story = StoryObj<AppLevelAlertArgs>;

export const SingleAlert: Story = {
  args: {
    alertTypes: ['info'],
    alertCount: 1,
    showAction: false,
  },
};

export const Alert: Story = {};

export const DifferentIcon: Story = {
  args: {
    clrAlertIcon: 'settings',
  },
};

export const Closable: Story = {
  args: {
    clrAlertClosable: true,
  },
};

export const WithActions: Story = {
  args: {
    showActions: true,
  },
};

export const Paginated: Story = {
  argTypes: paginatedArgTypes,
  args: {
    paginated: true,
    clrAlertClosable: false,
  },
};

export const PaginatedWithActions: Story = {
  argTypes: paginatedArgTypes,
  args: {
    paginated: true,
    clrAlertClosable: false,
    showActions: true,
  },
};

export const PaginatedClosable: Story = {
  argTypes: paginatedArgTypes,
  args: {
    paginated: true,
    clrAlertClosable: true,
    clrCloseButtonAriaLabel: 'Dismiss alert',
  },
};
