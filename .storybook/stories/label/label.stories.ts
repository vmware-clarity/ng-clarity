/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { StoryObj } from '@storybook/angular';

import { LabelStoryBookComponent } from './label.storybook.component';

const LABEL_COLOR_TYPES = ['', 'purple', 'blue', 'orange', 'light-blue'];
const LABEL_STATUS_TYPES = ['info', 'success', 'warning', 'danger'];

export default {
  title: 'Label/Label',
  component: LabelStoryBookComponent,
  decorators: [],
  argTypes: {
    labelTypes: { control: { disable: true }, table: { disable: true } },
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

export const Initial: StoryObj = {
  argTypes: {
    labelType: { control: { type: 'select' }, options: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES] },
  },
  args: {
    labelType: '',
  },
};

export const ColorLabel: StoryObj = {
  argTypes: {
    labelType: { control: { disable: true }, table: { disable: true } },
    showProjectedContent: { control: { disable: true }, table: { disable: true } },
    cssLabel: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    labelTypes: LABEL_COLOR_TYPES,
  },
};

export const StatusLabel: StoryObj = {
  argTypes: {
    labelType: { control: { disable: true }, table: { disable: true } },
    showProjectedContent: { control: { disable: true }, table: { disable: true } },
    cssLabel: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    labelTypes: LABEL_STATUS_TYPES,
  },
};

export const DisabledLabel: StoryObj = {
  argTypes: {
    labelType: { control: { disable: true }, table: { disable: true } },
    showProjectedContent: { control: { disable: true }, table: { disable: true } },
    cssLabel: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    labelType: '',
    disabled: true,
  },
};

export const StatusLabelClickable: StoryObj = {
  argTypes: {
    labelType: { control: { disable: true }, table: { disable: true } },
    showProjectedContent: { control: { disable: true }, table: { disable: true } },
    cssLabel: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    labelTypes: LABEL_STATUS_TYPES,
    clickable: true,
  },
};

export const ColorLabelClosable: StoryObj = {
  argTypes: {
    labelType: { control: { disable: true }, table: { disable: true } },
    showProjectedContent: { control: { disable: true }, table: { disable: true } },
    cssLabel: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    labelTypes: LABEL_COLOR_TYPES,
    closeIcon: true,
  },
};

export const StatusLabelClickableWithClose: StoryObj = {
  argTypes: {
    labelType: { control: { disable: true }, table: { disable: true } },
    showProjectedContent: { control: { disable: true }, table: { disable: true } },
    cssLabel: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    labelTypes: LABEL_STATUS_TYPES,
    clickable: true,
    closeIcon: true,
  },
};

export const LabelComponent: StoryObj = {
  argTypes: {
    labelType: { control: { type: 'select' }, options: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES] },
    cssLabel: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    labelTypes: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES],
    cssLabel: false,
  },
};

export const LabelComponentWithProjectedContent: StoryObj = {
  argTypes: {
    labelType: { control: { type: 'select' }, options: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES] },
    cssLabel: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    labelTypes: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES],
    cssLabel: false,
    showProjectedContent: true,
  },
};

export const LabelComponentClickableWithBadge: StoryObj = {
  argTypes: {
    labelType: { control: { disable: true }, table: { disable: true } },
    cssLabel: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    labelTypes: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES],
    cssLabel: false,
    clickable: true,
    badgeText: '42',
  },
};

export const LabelComponentSolidClickableWithBadge: StoryObj = {
  argTypes: {
    labelType: { control: { disable: true }, table: { disable: true } },
    cssLabel: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    labelTypes: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES],
    cssLabel: false,
    clickable: true,
    solid: true,
    badgeText: '42',
  },
};

export const LabelComponentClickableWithClose: StoryObj = {
  argTypes: {
    labelType: { control: { disable: true }, table: { disable: true } },
    cssLabel: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    labelTypes: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES],
    cssLabel: false,
    clickable: true,
    closeIcon: true,
  },
};

export const LabelComponentDisabled: StoryObj = {
  argTypes: {
    labelType: { control: { disable: true }, table: { disable: true } },
    cssLabel: { control: { disable: true }, table: { disable: true } },
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
