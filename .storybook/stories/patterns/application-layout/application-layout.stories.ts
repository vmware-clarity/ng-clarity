/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { type Meta, type StoryObj } from '@storybook/angular';

import { ApplicationLayoutStorybookComponent } from './application-layout.storybook.component';

/**
 * The stories render `<storybook-application-layout>` through `component:`, and the four
 * `level*Navigation` args are its own `@Input()`s under those exact names, so the wrapper is the args type.
 */
type ApplicationLayoutArgs = ApplicationLayoutStorybookComponent;

const meta: Meta<ApplicationLayoutArgs> = {
  title: 'Patterns/Application Layout',
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

export default meta;

type Story = StoryObj<ApplicationLayoutArgs>;

export const Default: Story = {};

export const FirstNavigationOnly: Story = {
  args: {
    level1Navigation: true,
    level2Navigation: false,
    level3Navigation: false,
    level4Navigation: false,
  },
};
export const NoNavigations: Story = {
  args: {
    level1Navigation: false,
    level2Navigation: false,
    level3Navigation: false,
    level4Navigation: false,
  },
};
