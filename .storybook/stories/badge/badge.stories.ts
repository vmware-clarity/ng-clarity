/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { StoryObj } from '@storybook/angular';

import { BadgeStoryBookComponent } from './badge.storybook.component';

const BADGE_COLOR_TYPES = ['gray', 'purple', 'blue', 'orange', 'light-blue', '1', '2', '3', '4', '5'];
const BADGE_STATUS_TYPES = ['', 'info', 'success', 'warning', 'danger'];

export default {
  title: 'Badge/Badge',
  component: BadgeStoryBookComponent,
  decorators: [],
  argTypes: {
    badgeTypes: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    context: '42',
    badgeType: null,
    badgeTypes: [...BADGE_STATUS_TYPES, ...BADGE_COLOR_TYPES],
    cssBadge: true,
  },
};

export const Initial: StoryObj = {
  argTypes: {
    badgeType: { control: { disable: true }, table: { disable: true } },
  },
};

export const SingleBadge: StoryObj = {
  argTypes: {
    badgeType: { control: { type: 'select' }, options: [...BADGE_STATUS_TYPES, ...BADGE_COLOR_TYPES] },
  },
  args: {
    showLinkBadge: false,
    badgeType: 'info',
  },
};

export const BadgeComponent: StoryObj = {
  argTypes: {
    badgeType: { control: { type: 'select' }, options: [...BADGE_STATUS_TYPES, ...BADGE_COLOR_TYPES] },
  },
  args: {
    cssBadge: false,
  },
};
