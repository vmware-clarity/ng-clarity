/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import '@cds/core/icon/register.js';
import {
  checkCircleIcon,
  ClarityIcons,
  exclamationCircleIcon,
  exclamationTriangleIcon,
  infoCircleIcon,
  windowCloseIcon,
} from '@cds/core/icon';
import { action } from '@storybook/addon-actions';
import { Story } from '@storybook/angular';
import { Parameters } from '@storybook/addons';

import { ClrCommonStringsService, ClrDestroyService } from 'src/utils';
import { ClrAlert } from './alert';
import { setupStorybook, StoryWrapper } from '../../../../../.storybook/helpers';
import { ClrAlertItem } from './alert-item';
import { ALERT_TYPES } from './utils/alert-types';

const commonStringsService = new ClrCommonStringsService();
ClarityIcons.addIcons(windowCloseIcon, exclamationCircleIcon, infoCircleIcon, checkCircleIcon, exclamationTriangleIcon);

const defaultParameters: Parameters = {
  title: 'Alert',
  component: ClrAlert,
  argTypes: {
    clrAlertClosedChange: { control: { disable: true } },
    clrAlertClosed: { defaultValue: false },
    clrAlertIcon: { defaultValue: '' },
    clrAlertType: { defaultValue: 'info', control: { type: 'radio', options: ALERT_TYPES } },
    clrCloseButtonAriaLabel: { defaultValue: commonStringsService.keys.alertCloseButtonAriaLabel },
    createArray: { control: { disable: true }, table: { disable: true } },
    close: { control: { disable: true } },
    open: { control: { disable: true } },
  },
  args: {
    clrAlertClosedChange: action('clrAlertClosedChange'),
    content: 'Hello World!',
    itemCount: 3,
    createArray: n => new Array(n),
  },
};

const defaultStory: Story<ClrAlert> = args => ({
  template: ` 
  <clr-alert
    [clrAlertAppLevel]="clrAlertAppLevel"
    [clrAlertClosable]="clrAlertClosable"
    [clrAlertClosed]="clrAlertClosed"
    [clrAlertIcon]="clrAlertIcon"
    [clrAlertSizeSmall]="clrAlertSizeSmall"
    [clrAlertType]="clrAlertType"
    [clrCloseButtonAriaLabel]="clrCloseButtonAriaLabel"
    (clrAlertClosedChange)="clrAlertClosedChange($event)">
      <clr-alert-item *ngFor="let _ of createArray(itemCount); let i = index">
        <span class="alert-text">{{content}} {{i + 1}}</span>
      </clr-alert-item>
    </clr-alert>`,
  props: { ...args },
});

const stories: { [key: string]: StoryWrapper[] } = {
  '': [{ storyName: 'Default', storyFn: defaultStory }],
  Types: ALERT_TYPES.map(alertType => ({
    storyName: alertType,
    storyFn: defaultStory,
    parameters: { args: { clrAlertType: alertType } },
  })),
  'App Level': ALERT_TYPES.map(alertType => ({
    storyName: alertType,
    storyFn: defaultStory,
    parameters: { args: { clrAlertType: alertType, clrAlertAppLevel: true } },
  })),
  Sizes: [false, true].map(isSmall => ({
    storyName: isSmall ? 'Small' : 'Normal',
    storyFn: defaultStory,
    parameters: { args: { clrAlertSizeSmall: isSmall } },
  })),
};

setupStorybook('Alert', defaultParameters, stories, {
  providers: [ClrCommonStringsService, ClrDestroyService],
  declarations: [ClrAlertItem],
});
