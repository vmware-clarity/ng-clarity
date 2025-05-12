/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { StoryObj } from '@storybook/angular';

import { LabelStoryBookComponent } from './label.storybook.component';

const LABEL_COLOR_TYPES = ['', 'label-purple', 'label-blue', 'label-orange', 'label-light-blue'];
const LABEL_STATUS_TYPES = ['label-info', 'label-success', 'label-warning', 'label-danger'];

export default {
  title: 'Label/Label',
  component: LabelStoryBookComponent,
  decorators: [],
  argTypes: {
    labelTypes: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    labelType: null,
    labelTypes: [''],
    // story helpers
    clickable: false,
    closeIcon: false,
  },
};

export const Initial: StoryObj = {
  argTypes: {
    labelType: { control: 'select', options: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES] },
  },
  args: {
    labelType: '',
  },
};

export const ColorLabel: StoryObj = {
  argTypes: {
    labelType: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    labelTypes: LABEL_COLOR_TYPES,
  },
};

export const StatusLabel: StoryObj = {
  argTypes: {
    labelType: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    labelTypes: LABEL_STATUS_TYPES,
  },
};

export const StatusLabelClickable: StoryObj = {
  argTypes: {
    labelType: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    labelTypes: LABEL_STATUS_TYPES,
    clickable: true,
  },
};

export const ColorLabelClosable: StoryObj = {
  argTypes: {
    labelType: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    labelTypes: LABEL_COLOR_TYPES,
    closeIcon: true,
  },
};

export const StatusLabelClickableWithClose: StoryObj = {
  argTypes: {
    labelType: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    labelTypes: LABEL_STATUS_TYPES,
    clickable: true,
    closeIcon: true,
  },
};
