/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrHeader, ClrMainContainerModule, ClrNavigationModule } from '@clr/angular';
import { argsToTemplate, moduleMetadata, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';
import { HeaderStorybookComponent } from './header.storybook.component';

export default {
  title: 'Header/Header',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrMainContainerModule, ClrNavigationModule, HeaderStorybookComponent],
    }),
  ],
  component: ClrHeader,
  argTypes: {
    // methods
    closeOpenNav: { control: { disable: true }, table: { disable: true } },
    initializeNavTriggers: { control: { disable: true }, table: { disable: true } },
    openNav: { control: { disable: true }, table: { disable: true } },
    resetNavTriggers: { control: { disable: true }, table: { disable: true } },
    toggleNav: { control: { disable: true }, table: { disable: true } },
    // story helpers
  },
  args: {},
  render: (args: HeaderStorybookComponent) => ({
    props: {
      ...args,
    },
    template: `
      <storybook-header ${argsToTemplate(args)}></storybook-header>
    `,
  }),
};

export const Default: StoryObj = {};

export const Collapsed: StoryObj = {};
