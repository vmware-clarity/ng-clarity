/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { type Meta, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';

import { LabelStoryBookComponent } from './label.storybook.component';

/** Every arg is an `@Input()` of the story component, which is also this file's `component:`. */
type LabelArgs = LabelStoryBookComponent;

const LABEL_COLOR_TYPES = ['', 'purple', 'blue', 'orange', 'light-blue'];
const LABEL_STATUS_TYPES = ['info', 'success', 'warning', 'danger'];

const meta: Meta<LabelArgs> = {
  title: 'Components/Label',
  component: LabelStoryBookComponent,
  decorators: [],
  argTypes: {
    ...hideControls('labelTypes'),
  },
  args: {
    labelType: null,
    badgeText: '',
    labelTypes: [''],
    // story helpers
    clickable: false,
    closeIcon: false,
    disabled: false,
    cssLabel: true,
    solid: false,
    showProjectedContent: false,
  },
};

export default meta;

type Story = StoryObj<LabelArgs>;

export const Initial: Story = {
  argTypes: {
    labelType: { control: { type: 'select' }, options: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES] },
  },
  args: {
    labelType: '',
  },
};

export const ColorLabel: Story = {
  argTypes: {
    ...hideControls('labelType', 'showProjectedContent', 'cssLabel'),
  },
  args: {
    labelTypes: LABEL_COLOR_TYPES,
  },
};

export const StatusLabel: Story = {
  argTypes: {
    ...hideControls('labelType', 'showProjectedContent', 'cssLabel'),
  },
  args: {
    labelTypes: LABEL_STATUS_TYPES,
  },
};

export const DisabledLabel: Story = {
  argTypes: {
    ...hideControls('labelType', 'showProjectedContent', 'cssLabel'),
  },
  args: {
    labelType: '',
    disabled: true,
  },
};

export const StatusLabelClickable: Story = {
  argTypes: {
    ...hideControls('labelType', 'showProjectedContent', 'cssLabel'),
  },
  args: {
    labelTypes: LABEL_STATUS_TYPES,
    clickable: true,
  },
};

export const ColorLabelClosable: Story = {
  argTypes: {
    ...hideControls('labelType', 'showProjectedContent', 'cssLabel'),
  },
  args: {
    labelTypes: LABEL_COLOR_TYPES,
    closeIcon: true,
  },
};

export const StatusLabelClickableWithClose: Story = {
  argTypes: {
    ...hideControls('labelType', 'showProjectedContent', 'cssLabel'),
  },
  args: {
    labelTypes: LABEL_STATUS_TYPES,
    clickable: true,
    closeIcon: true,
  },
};

export const LabelComponent: Story = {
  argTypes: {
    labelType: { control: { type: 'select' }, options: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES] },
    ...hideControls('cssLabel'),
  },
  args: {
    labelTypes: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES],
    cssLabel: false,
  },
};

export const LabelComponentWithProjectedContent: Story = {
  argTypes: {
    labelType: { control: { type: 'select' }, options: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES] },
    ...hideControls('cssLabel'),
  },
  args: {
    labelTypes: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES],
    cssLabel: false,
    showProjectedContent: true,
  },
};

export const LabelComponentClickableWithBadge: Story = {
  argTypes: {
    ...hideControls('labelType', 'cssLabel'),
  },
  args: {
    labelTypes: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES],
    cssLabel: false,
    clickable: true,
    badgeText: '42',
  },
};

export const LabelComponentClickableWithBadgeHover: Story = {
  argTypes: {
    ...hideControls('labelType', 'cssLabel'),
  },
  args: {
    labelTypes: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES],
    cssLabel: false,
    clickable: true,
    badgeText: '42',
  },
  parameters: {
    pseudo: { hover: true },
  },
};

export const LabelComponentClickableWithBadgeClicked: Story = {
  argTypes: {
    ...hideControls('labelType', 'cssLabel'),
  },
  args: {
    labelTypes: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES],
    cssLabel: false,
    clickable: true,
    badgeText: '42',
  },
  parameters: {
    pseudo: { active: true },
  },
};

export const LabelComponentSolidClickableWithBadge: Story = {
  argTypes: {
    ...hideControls('labelType', 'cssLabel'),
  },
  args: {
    labelTypes: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES],
    cssLabel: false,
    clickable: true,
    solid: true,
    badgeText: '42',
  },
};

export const LabelComponentSolidClickableWithBadgeHover: Story = {
  argTypes: {
    ...hideControls('labelType', 'cssLabel'),
  },
  args: {
    labelTypes: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES],
    cssLabel: false,
    clickable: true,
    solid: true,
    badgeText: '42',
  },
  parameters: {
    pseudo: { hover: true },
  },
};

export const LabelComponentSolidClickableWithBadgeActive: Story = {
  argTypes: {
    ...hideControls('labelType', 'cssLabel'),
  },
  args: {
    labelTypes: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES],
    cssLabel: false,
    clickable: true,
    solid: true,
    badgeText: '42',
  },
  parameters: {
    pseudo: { active: true },
  },
};

export const LabelComponentClickableWithClose: Story = {
  argTypes: {
    ...hideControls('labelType', 'cssLabel'),
  },
  args: {
    labelTypes: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES],
    cssLabel: false,
    clickable: true,
    closeIcon: true,
  },
};

export const LabelComponentSolidDisabled: Story = {
  argTypes: {
    ...hideControls('labelType', 'cssLabel'),
  },
  args: {
    labelTypes: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES],
    disabled: true,
    cssLabel: false,
    clickable: true,
    closeIcon: true,
    solid: true,
    badgeText: '42',
  },
};

export const LabelComponentDisabled: Story = {
  argTypes: {
    ...hideControls('labelType', 'cssLabel'),
  },
  args: {
    labelTypes: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES],
    disabled: true,
    cssLabel: false,
    clickable: true,
    closeIcon: true,
    badgeText: '42',
  },
};
