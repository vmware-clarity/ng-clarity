/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { StoryObj } from '@storybook/angular';

import { BadgeStoryBookComponent } from './badge.storybook.component';

export default {
  title: 'Badge/Badge',
  component: BadgeStoryBookComponent,
  decorators: [],
  argTypes: {
    badgeTypes: { control: { disable: true }, table: { disable: true }, type: 'array' },
  },
  args: {
    context: '42',
  },
};

export const Initial: StoryObj = {};

export const SingleBadge: StoryObj = {
  args: {
    showLinkBadge: false,
    badgeTypes: ['badge-info'],
  },
};
