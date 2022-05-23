/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAlertModule, ClrAlerts } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { ALERT_TYPES } from '../../../projects/angular/src/emphasis/alert/utils/alert-types';
import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <clr-alerts
      [clrCurrentAlertIndex]="clrCurrentAlertIndex"
      (clrCurrentAlertIndexChange)="clrCurrentAlertIndexChange($event)"
    >
      <clr-alert
        *ngFor="let _ of createArray(alertCount); let i = index"
        [clrAlertType]="alertTypes[i % alertTypes.length]"
        [clrAlertAppLevel]="true"
      >
        <clr-alert-item>
          <span class="alert-text">{{ content }} {{ i + 1 }}</span>
        </clr-alert-item>
      </clr-alert>
    </clr-alerts>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Alert/Alerts',
  component: ClrAlerts,
  argTypes: {
    // inputs
    clrCurrentAlert: { control: { disable: true } },
    clrCurrentAlertIndex: { defaultValue: 0, control: { type: 'number' } },
    // outputs
    clrCurrentAlertChange: { control: { disable: true } },
    clrCurrentAlertIndexChange: { control: { disable: true } },
    // story helpers
    createArray: { control: { disable: true }, table: { disable: true } },
    alertTypes: { control: { disable: true }, table: { disable: true } },
    alertCount: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    // outputs
    clrCurrentAlertChange: action('clrCurrentAlertChange'),
    clrCurrentAlertIndexChange: action('clrCurrentAlertIndexChange'),
    // story helpers
    content: 'Hello World!',
    alertCount: 4,
    createArray: n => new Array(n),
    alertTypes: ALERT_TYPES,
  },
};

const variants: Parameters[] = [
  ...ALERT_TYPES.map((_, index) => ({
    clrCurrentAlertIndex: index,
  })),
];

setupStorybook(ClrAlertModule, defaultStory, defaultParameters, variants);
