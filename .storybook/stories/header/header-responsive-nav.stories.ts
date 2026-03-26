/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrHeader, ClrMainContainerModule, ClrNavigationModule } from '@clr/angular';
import { moduleMetadata, StoryObj } from '@storybook/angular';

import { HeaderStorybookComponent } from './header.storybook.component';
import { CommonModules } from '../../helpers/common';

export default {
  title: 'Header/Header Responsive Nav',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrMainContainerModule, ClrNavigationModule, HeaderStorybookComponent],
    }),
  ],
  component: ClrHeader,
  argTypes: {
    closeOpenNav: { control: { disable: true }, table: { disable: true } },
    initializeNavTriggers: { control: { disable: true }, table: { disable: true } },
    openNav: { control: { disable: true }, table: { disable: true } },
    resetNavTriggers: { control: { disable: true }, table: { disable: true } },
    toggleNav: { control: { disable: true }, table: { disable: true } },
  },
  args: {},
  render: () => ({
    template: `
      <storybook-header></storybook-header>
    `,
  }),
};

export const Level1NavOpen: StoryObj = {
  async play({ canvasElement, userEvent }) {
    const hamburger = canvasElement.querySelector<HTMLButtonElement>('.header-hamburger-trigger');
    await userEvent.click(hamburger);
  },
};

export const Level2NavOpen: StoryObj = {
  async play({ canvasElement, userEvent }) {
    const overflow = canvasElement.querySelector<HTMLButtonElement>('.header-overflow-trigger');
    await userEvent.click(overflow);
  },
};
