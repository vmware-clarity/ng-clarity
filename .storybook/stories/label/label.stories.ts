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
  argTypes: {},
  args: {
    modifierClasses: [''],
    labelColorTypes: [''],
    // story helpers
    clickable: false,
    closeIcon: false,
  },
};

export const Initial: StoryObj = {};

export const ColorLabel: StoryObj = {
  args: {
    labelColorTypes: LABEL_COLOR_TYPES,
  },
};

export const StatusLabel: StoryObj = {
  args: {
    labelColorTypes: LABEL_STATUS_TYPES,
  },
};

export const StatusLabelClickable: StoryObj = {
  args: {
    labelColorTypes: LABEL_STATUS_TYPES,
    clickable: true,
  },
};

export const ColorLabelClosable: StoryObj = {
  args: {
    labelColorTypes: LABEL_COLOR_TYPES,
    closeIcon: true,
  },
};

export const StatusLabelClickableWithClose: StoryObj = {
  args: {
    labelColorTypes: LABEL_STATUS_TYPES,
    clickable: true,
    closeIcon: true,
  },
};

export const NestedBadge: StoryObj = {
  args: {
    badgeContent: 1,
  },
};

export const NestedBadgeClosable: StoryObj = {
  args: {
    labelColorTypes: LABEL_COLOR_TYPES,
    closeIcon: true,
    badgeContent: 1,
  },
};

export const NestedBadgeClickable: StoryObj = {
  args: {
    labelColorTypes: LABEL_STATUS_TYPES,
    clickable: true,
    badgeContent: 1,
  },
};
