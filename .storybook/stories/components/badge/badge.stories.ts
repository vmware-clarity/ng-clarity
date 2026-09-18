/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { type Meta, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';

import { BadgeStoryBookComponent } from './badge.storybook.component';

/** Every arg is an `@Input()` of the story component, which is also this file's `component:`. */
type BadgeArgs = BadgeStoryBookComponent;

const BADGE_COLOR_TYPES = ['gray', 'purple', 'blue', 'orange', 'light-blue', '1', '2', '3', '4', '5'];
const BADGE_STATUS_TYPES = ['', 'info', 'success', 'warning', 'danger'];

const meta: Meta<BadgeArgs> = {
  title: 'Components/Badge',
  component: BadgeStoryBookComponent,
  decorators: [],
  argTypes: {
    ...hideControls('badgeTypes'),
  },
  args: {
    context: '42',
    badgeType: null,
    badgeTypes: [...BADGE_STATUS_TYPES, ...BADGE_COLOR_TYPES],
    cssBadge: true,
    outlined: false,
  },
};

export default meta;

type Story = StoryObj<BadgeArgs>;

export const Initial: Story = {
  argTypes: {
    ...hideControls('badgeType'),
  },
};

export const Outlined: Story = {
  argTypes: {
    ...hideControls('badgeType'),
  },
  args: {
    outlined: true,
  },
};

export const SingleBadge: Story = {
  argTypes: {
    badgeType: { control: { type: 'select' }, options: [...BADGE_STATUS_TYPES, ...BADGE_COLOR_TYPES] },
  },
  args: {
    showLinkBadge: false,
    badgeType: 'info',
  },
};

export const BadgeComponent: Story = {
  argTypes: {
    badgeType: { control: { type: 'select' }, options: [...BADGE_STATUS_TYPES, ...BADGE_COLOR_TYPES] },
  },
  args: {
    cssBadge: false,
  },
};

export const OutlinedBadgeComponent: Story = {
  argTypes: {
    badgeType: { control: { type: 'select' }, options: [...BADGE_STATUS_TYPES, ...BADGE_COLOR_TYPES] },
  },
  args: {
    cssBadge: false,
    outlined: true,
  },
};
