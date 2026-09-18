/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { AppfxMenuModule } from '@clr/addons/menu';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

import { MenuStoryWrapperComponent } from './menu.storybook.component';

/** The story renders the wrapper component itself, so its public members are the args. */
type MenuArgs = MenuStoryWrapperComponent;

const meta: Meta<MenuArgs> = {
  title: 'Addons/Menu',
  component: MenuStoryWrapperComponent,
  decorators: [
    moduleMetadata({
      imports: [AppfxMenuModule, CommonModule, MenuStoryWrapperComponent],
    }),
  ],
  argTypes: {
    headerText: { control: 'text' },
  },
  args: {
    headerText: 'Context Menu',
  },
  render: args => ({
    props: args,
    component: MenuStoryWrapperComponent,
  }),
};

export default meta;

type Story = StoryObj<MenuArgs>;

export const Default: Story = {};
