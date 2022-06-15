/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <span class="badge" [ngClass]="badgeClass">{{context}}</span>
  `,
  props: { ...args },
});

const badgeClasses = ['', 'badge-info', 'badge-success', 'badge-warning', 'badge-danger'];

const defaultParameters: Parameters = {
  title: 'Badge/Badge',
  argTypes: {
    // story helpers
    badgeClass: { defaultValue: '', control: { type: 'radio', options: badgeClasses } },
  },
  args: {
    // story helpers
    context: '42',
  },
};

const variants: Parameters[] = badgeClasses.map(badgeClass => ({
  badgeClass,
}));

setupStorybook([], defaultStory, defaultParameters, variants);
