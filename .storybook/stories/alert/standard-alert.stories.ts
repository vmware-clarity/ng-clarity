/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAlert, ClrAlertModule, commonStringsDefault } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, Story } from '@storybook/angular';

import { ALERT_TYPES } from '../../../projects/angular/src/emphasis/alert/utils/alert-types';
import { CommonModules } from '../../helpers/common';

export default {
  title: 'Alert/Standard Alerts',
  component: ClrAlert,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrAlertModule],
    }),
  ],
  argTypes: {
    // inputs
    clrAlertIcon: {
      description: 'Changes the leading icon of an alert from the default icon to the icon cds-icon value specified.',
      defaultValue: 'Default',
      control: 'radio',
      options: ['Default', 'settings'],
      mapping: { Default: '' },
    },
    clrAlertLightweight: {
      description: 'Less prominent type of alert. Not compatible with `clrAlertClosable` or `clrAlertAppLevel`',
      control: 'boolean',
      defaultValue: false,
    },
    clrCloseButtonAriaLabel: {
      description:
        'Application level alert. Intended to be used at the top of an application for application wide alerts',
      control: 'text',
      defaultValue: commonStringsDefault.alertCloseButtonAriaLabel,
      if: { arg: 'clrAlertClosable', exists: false },
    },
    clrAlertClosable: {
      description: 'Adds a close button and allows the user to dismiss this alert',
      control: 'boolean',
      defaultValue: false,
      if: { arg: 'clrAlertLightweight', eq: false },
    },
    clrAlertSizeSmall: {
      description: 'Renders the alert in a compact, smaller view',
      control: 'boolean',
      defaultValue: false,
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
    // outputs
    clrAlertClosedChange: action('clrAlertClosedChange'),
    // story helpers
    createArray: n => new Array(n),
    itemCount: 3,
    content: 'Hello World!',
    ALERT_TYPES,
  },
};

const template = `
  <div *ngFor="let alert of ALERT_TYPES" style="margin-top: 5px;">
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
        <span class="alert-text">{{content}} {{i + 1}}</span>
      </clr-alert-item>
    </clr-alert>
  </div>
  `;

export const Alert: Story = args => ({
  template,
  props: args,
});

export const Small: Story = Alert.bind({});
Small.args = {
  ...Alert.args,
  clrAlertSizeSmall: true,
};

export const Closable: Story = Alert.bind({});
Closable.args = {
  ...Alert.args,
  clrAlertClosable: { value: true, table: { disable: true } },
};

export const Lightweight: Story = Alert.bind({});
Lightweight.argTypes = {
  ...Alert.args,
  clrAlertLightweight: { defaultValue: true, control: false },
  clrCloseButtonAriaLabel: { table: { disable: true } },
  clrAlertClosable: { value: false, table: { disable: true } },
};

export const DifferentIcon: Story = Alert.bind({});
DifferentIcon.argTypes = {
  ...Alert.argTypes,
  clrAlertIcon: { defaultValue: 'settings', control: false },
};
