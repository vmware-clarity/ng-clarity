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
    template: `<storybook-header></storybook-header>`,
  }),
};

export const Level1NavOpen: StoryObj = {
  play({ canvasElement }) {
    const hamburger = canvasElement.querySelector<HTMLButtonElement>('.header-hamburger-trigger');
    hamburger?.click();
  },
};

export const Level2NavOpen: StoryObj = {
  play({ canvasElement }) {
    const overflow = canvasElement.querySelector<HTMLButtonElement>('.header-overflow-trigger');
    overflow?.click();
  },
};
