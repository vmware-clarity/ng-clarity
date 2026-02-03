/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { StoryObj } from '@storybook/angular';

import { ApplicationLayoutStorybookComponent } from './application-layout/application-layout.storybook.component';

export default {
  title: 'Layout/Application',
  component: ApplicationLayoutStorybookComponent,
  decorators: [],
  argTypes: {},
  args: {
    level1Navigation: true,
    level2Navigation: true,
    level3Navigation: true,
    level4Navigation: true,
  },
};

export const Default: StoryObj = {};

export const FirstNavigationOnly: StoryObj = {
  args: {
    level1Navigation: true,
    level2Navigation: false,
    level3Navigation: false,
    level4Navigation: false,
  },
};
export const NoNavigations: StoryObj = {
  args: {
    level1Navigation: false,
    level2Navigation: false,
    level3Navigation: false,
    level4Navigation: false,
  },
};
