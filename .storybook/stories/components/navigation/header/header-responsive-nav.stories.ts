/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrHeader, ClrMainContainerModule, ClrNavigationModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

import { HeaderStorybookComponent } from './header.storybook.component';

/**
 * The stories render `<storybook-header>` and drive it through `play()` rather than args, so the file
 * has no args of its own; the wrapper is still the class an arg would bind to, and the hidden entries
 * are `ClrHeader` methods that go through the `hideControls()` spread.
 */
type HeaderResponsiveNavArgs = HeaderStorybookComponent;

const meta: Meta<HeaderResponsiveNavArgs> = {
  title: 'Components/Navigation/Header/Responsive Nav',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrMainContainerModule, ClrNavigationModule, HeaderStorybookComponent],
    }),
  ],
  component: ClrHeader,
  argTypes: {
    ...hideControls('closeOpenNav', 'initializeNavTriggers', 'openNav', 'resetNavTriggers', 'toggleNav'),
  },
  args: {},
  render: () => ({
    template: `
      <storybook-header></storybook-header>
    `,
  }),
};

export default meta;

type Story = StoryObj<HeaderResponsiveNavArgs>;

export const Level1NavOpen: Story = {
  async play({ canvasElement, userEvent }) {
    const hamburger = canvasElement.querySelector<HTMLButtonElement>('.header-hamburger-trigger');
    await userEvent.click(hamburger);
  },
};

export const Level2NavOpen: Story = {
  async play({ canvasElement, userEvent }) {
    const overflow = canvasElement.querySelector<HTMLButtonElement>('.header-overflow-trigger');
    await userEvent.click(overflow);
  },
};
