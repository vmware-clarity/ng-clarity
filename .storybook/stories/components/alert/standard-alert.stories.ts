/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAlert, ClrAlertModule } from '@clr/angular';
import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';
import { action } from 'storybook/actions';

import { StandardAlertStorybookComponent } from './standard-alert.storybook.component';

/**
 * The args drive `<storybook-standard-alert>`, so the args type is that wrapper -- `ClrAlert` aliases
 * every input (`@Input('clrAlertClosable') closable`), so the `clr*` names the story binds are not
 * properties of it. `close` and `open` are picked from `ClrAlert` only so the `argTypes` entries that
 * hide those two methods stay type-checked, and `clrAlertClosedChange` is declared because it is an
 * arg (an `action()`) without being a member of the wrapper.
 *
 * `clrAlertClosable` and `clrCloseButtonAriaLabel` are widened because the `Lightweight` story passes
 * argTypes-shaped objects (`{ value: false, table: { disable: true } }`) as *args*. That is an
 * authoring mistake -- `argsToTemplate` binds them straight through, so the alert renders with a
 * truthy `clrAlertClosable` -- but it is the markup the committed snapshot was recorded from, so the
 * values are left exactly as they are. Correcting them changes a snapshot and belongs in its own change.
 */
type StandardAlertArgs = Omit<StandardAlertStorybookComponent, 'clrAlertClosable' | 'clrCloseButtonAriaLabel'> &
  Pick<ClrAlert, 'close' | 'open'> & {
    clrAlertClosable: boolean | Record<string, unknown>;
    clrCloseButtonAriaLabel: string | Record<string, unknown>;
    clrAlertClosedChange: (closed: boolean) => void;
  };

const meta: Meta<StandardAlertArgs> = {
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
      control: { type: 'radio' },
      options: ['Default', 'settings'],
      mapping: { Default: '' },
    },
    clrAlertLightweight: {
      description: 'Less prominent type of alert. Not compatible with `clrAlertClosable` or `clrAlertAppLevel`',
      control: { type: 'boolean' },
    },
    clrCloseButtonAriaLabel: {
      description:
        'Application level alert. Intended to be used at the top of an application for application wide alerts',
      control: { type: 'text' },
      if: { arg: 'clrAlertClosable', exists: false },
    },
    clrAlertClosable: {
      description: 'Adds a close button and allows the user to dismiss this alert',
      control: { type: 'boolean' },
      if: { arg: 'clrAlertLightweight', eq: false },
    },
    clrAlertSizeSmall: {
      description: 'Renders the alert in a compact, smaller view',
      control: { type: 'boolean' },
    },
    // outputs
    clrAlertClosedChange: { control: { disable: true } },
    // methods
    close: { control: { disable: true } },
    open: { control: { disable: true } },
    // story helpers
    ...hideControls('createArray', 'ALERT_TYPES', 'clrAlertType', 'clrAlertClosed', 'clrAlertAppLevel'),
  },
  args: {
    clrAlertClosable: false,
    clrAlertLightweight: false,
    clrAlertClosedChange: action('clrAlertClosedChange'),
  },
  render: args => ({
    props: {
      ...args,
    },
    template: `
      <storybook-standard-alert ${argsToTemplate(args)}></storybook-standard-alert>
    `,
  }),
};

export default meta;

type Story = StoryObj<StandardAlertArgs>;

export const SingleAlert: Story = {
  args: {
    alertCount: 1,
    alertTypes: ['info'],
  },
};

export const Alert: Story = {};

export const Small: Story = {
  args: {
    clrAlertSizeSmall: true,
  },
};

export const SmallLightweight: Story = {
  args: {
    clrAlertSizeSmall: true,
    clrAlertLightweight: true,
  },
};

export const Closable: Story = {
  args: {
    clrAlertClosable: true,
  },
};

export const Lightweight: Story = {
  args: {
    clrAlertLightweight: true,
    clrCloseButtonAriaLabel: { table: { disable: true } },
    clrAlertClosable: { value: false, table: { disable: true } },
  },
};

export const DifferentIcon: Story = {
  args: {
    clrAlertIcon: 'settings',
  },
};

export const WithActions: Story = {
  args: {
    showActions: true,
  },
};

export const WithOpenActionsDropdown: Story = {
  args: {
    alertCount: 1,
    showActions: true,
    alertTypes: ['info'],
    openContextMenu: true,
  },
};

export const WithLongContentAndOpenActionsDropdown: Story = {
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
    openContextMenu: true,
  },
};

export const MultipleSeparatedAlerts: Story = {
  args: {
    alertCount: 1,
    alertTypes: ['info', 'info'],
  },
};
