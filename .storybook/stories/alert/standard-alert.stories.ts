/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAlert, ClrAlertModule, commonStringsDefault } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

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
