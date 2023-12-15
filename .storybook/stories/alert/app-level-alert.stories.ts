/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAlert, ClrAlertModule, commonStringsDefault } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, Story } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

const ALERT_TYPES = ['info', 'warning', 'danger', 'success', 'neutral'];

export default {
  title: 'Alert/App Level Alerts',
  component: ClrAlert,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrAlertModule],
    }),
  ],
  argTypes: {
    // inputs
    clrAlertIcon: {
      description: 'Changes the leading icon of an alert from the default icon to the icon cds-icon value specified',
      defaultValue: 'Default',
      control: 'radio',
      options: ['Default', 'settings'],
      mapping: { Default: '' },
    },
    clrCloseButtonAriaLabel: {
      description: 'Aria label for the close button. Only used if the close button is rendered',
      control: 'text',
      defaultValue: commonStringsDefault.alertCloseButtonAriaLabel,
    },
    clrAlertClosable: {
      description: 'Adds a close button and allows the user to dismiss this alert',
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
    clrAlertSizeSmall: { control: { disable: true }, table: { disable: true } },
    clrAlertLightweight: { control: { disable: true }, table: { disable: true } },
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
    <clr-alert
     *ngFor="let alert of ALERT_TYPES"
      style="margin-top: 5px;"
      [clrAlertAppLevel]="true"
      [clrAlertClosable]="clrAlertClosable"
      [clrAlertIcon]="clrAlertIcon"
      [clrAlertType]="alert"
      [clrCloseButtonAriaLabel]="clrCloseButtonAriaLabel"
      (clrAlertClosedChange)="clrAlertClosedChange($event)"
    >
      <clr-alert-item *ngFor="let _ of createArray(itemCount); let i = index">
        <span class="alert-text">{{content}} {{i + 1}}</span>
      </clr-alert-item>
    </clr-alert>
  `;

export const Alert: Story = args => ({
  template,
  props: args,
});

export const DifferentIcon: Story = Alert.bind({});
DifferentIcon.args = {
  ...Alert.args,
  clrAlertIcon: 'settings',
};

export const Closable: Story = Alert.bind({});
Closable.args = {
  ...Alert.args,
  clrAlertClosable: true
};

export const Paginated: Story = args => ({
  template: `
  <clr-alerts
        [clrCurrentAlertIndex]="clrCurrentAlertIndex">
        <clr-alert
       *ngFor="let alert of ALERT_TYPES"
        [clrAlertAppLevel]="true"
        [clrAlertClosable]="clrAlertClosable"
        [clrAlertIcon]="clrAlertIcon"
        [clrAlertType]="alert"
        [clrCloseButtonAriaLabel]="clrCloseButtonAriaLabel"
        (clrAlertClosedChange)="clrAlertClosedChange($event)"
      >
        <clr-alert-item>
          <span class="alert-text">{{content}} {{alert}}</span>
        </clr-alert-item>
      </clr-alert>
  </clr-alerts>`,
  props: args,
});
Paginated.args = {
  ...Paginated.args,
  clrAlertClosable: false,
};
Paginated.argTypes = {
  ...Paginated.argTypes,
  clrCloseButtonAriaLabel: { control: false, table: {disable: true}},
  itemCount: { control: false, table: {disable: true}},
  clrAlertClosedChange: { control: false, table: {disable: true}},
  clrCurrentAlertIndex: { defaultValue: 0, type: 'number' },
  close: { control: false, table: {disable: true}},
  open: { control: false, table: {disable: true}},
};

export const PaginatedClosable = Paginated.bind({});
PaginatedClosable.args = {
  ...PaginatedClosable.args,
  clrAlertClosable: true,
  clrCloseButtonAriaLabel: 'Dismiss alert',
}
