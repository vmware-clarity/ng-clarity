/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

enum LabelType {
  Default = '',
  Purple = 'label-purple',
  Blue = 'label-blue',
  Orange = 'label-orange',
  LightBlue = 'label-light-blue',
  Info = 'label-info',
  Success = 'label-success',
  Warning = 'label-warning',
  Error = 'label-danger',
}

const defaultStory: Story = args => ({
  template: `
    <span class="label" [class.clickable]="clickable" [ngClass]="labelType">
      {{content}}
      <span *ngIf="badgeContent" class="badge">{{badgeContent}}</span>
    </span>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Label/Label',
  argTypes: {
    // story helpers
    labelType: { control: { type: 'radio', options: Object.values(LabelType) } },
  },
  args: {
    // story helpers
    content: 'Hello World!',
    badgeContent: '',
    labelType: LabelType.Default,
    clickable: false,
  },
};

const variants: Parameters[] = [].concat(
  ...Object.values(LabelType).map(labelType => [
    {
      labelType,
    },
    { labelType, badgeContent: '12' },
  ])
);

setupStorybook([], defaultStory, defaultParameters, variants);
