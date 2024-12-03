/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAlert, ClrAlertModule, commonStringsDefault } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

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
    // inputs
    clrAlertIcon: 'Default',
    clrCloseButtonAriaLabel: commonStringsDefault.alertCloseButtonAriaLabel,
    clrAlertClosable: false,
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
  <clr-alert
    *ngFor="let alert of ALERT_TYPES"
    style="margin-top: 5px"
    [clrAlertAppLevel]="true"
    [clrAlertClosable]="clrAlertClosable"
    [clrAlertIcon]="clrAlertIcon"
    [clrAlertType]="alert"
    [clrCloseButtonAriaLabel]="clrCloseButtonAriaLabel"
    (clrAlertClosedChange)="clrAlertClosedChange($event)"
  >
    <clr-alert-item *ngFor="let _ of createArray(itemCount); let i = index">
      <span class="alert-text">
        {{ content }} {{ i + 1 }}
        <a href="javascript://">
          <cds-icon shape="user"></cds-icon>
          Reset to green
        </a>
      </span>
      <div *ngIf="showActions" class="alert-actions">
        <button class="btn alert-action">Fix</button>
        <button class="btn alert-action">Ignore</button>
      </div>
    </clr-alert-item>
  </clr-alert>
`;

const AlertTemplate: StoryFn = args => ({
  template,
  props: args,
});

export const Alert: StoryObj = {
  render: AlertTemplate,
};

export const DifferentIcon: StoryObj = {
  render: AlertTemplate,
  args: {
    clrAlertIcon: 'settings',
  },
};

export const Closable: StoryObj = {
  render: AlertTemplate,
  args: {
    clrAlertClosable: true,
  },
};

export const WithActions: StoryObj = {
  render: AlertTemplate,
  args: {
    showActions: true,
  },
};

const PaginatedTemplate: StoryFn = args => ({
  template: `
    <clr-alerts [clrCurrentAlertIndex]="clrCurrentAlertIndex">
      <clr-alert
        *ngFor="let alert of ALERT_TYPES; let i = index"
        [clrAlertAppLevel]="true"
        [clrAlertClosable]="clrAlertClosable"
        [clrAlertIcon]="clrAlertIcon"
        [clrAlertType]="alert"
        [clrCloseButtonAriaLabel]="clrCloseButtonAriaLabel"
        (clrAlertClosedChange)="clrAlertClosedChange($event)"
      >
        <clr-alert-item>
          <span class="alert-text">
            {{ content }} {{ i + 1 }}
            <a href="javascript://">
              <cds-icon shape="user"></cds-icon>
              Reset to green
            </a>
          </span>
          <div *ngIf="showActions" class="alert-actions">
            <button class="btn alert-action">Fix</button>
            <button class="btn alert-action">Ignore</button>
          </div>
        </clr-alert-item>
      </clr-alert>
    </clr-alerts>
  `,
  props: args,
});

const paginatedArgTypes = {
  clrCloseButtonAriaLabel: { control: false, table: { disable: true } },
  itemCount: { control: false, table: { disable: true } },
  clrAlertClosedChange: { control: false, table: { disable: true } },
  close: { control: false, table: { disable: true } },
  open: { control: false, table: { disable: true } },
};

const paginatedArgs = {
  clrCurrentAlertIndex: 0,
};

export const Paginated: StoryObj = {
  render: PaginatedTemplate,
  argTypes: paginatedArgTypes,
  args: {
    ...paginatedArgs,
    clrAlertClosable: false,
  },
};

export const PaginatedWithActions: StoryObj = {
  render: PaginatedTemplate,
  argTypes: paginatedArgTypes,
  args: {
    ...paginatedArgs,
    clrAlertClosable: false,
    showActions: true,
  },
};

export const PaginatedClosable: StoryObj = {
  render: PaginatedTemplate,
  argTypes: paginatedArgTypes,
  args: {
    ...paginatedArgs,
    clrAlertClosable: true,
    clrCloseButtonAriaLabel: 'Dismiss alert',
  },
};
