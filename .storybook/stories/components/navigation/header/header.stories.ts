/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrHeader, ClrMainContainerModule, ClrNavigationModule } from '@clr/angular';
import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

import { HeaderStorybookComponent } from './header.storybook.component';

/**
 * The args drive `<storybook-header>`, so the args type is that wrapper. The five hidden entries are
 * `ClrHeader` methods, hidden so they do not appear as rows in the table generated from
 * `component: ClrHeader`; they go through the `hideControls()` spread and so need no declaration here.
 */
type HeaderArgs = HeaderStorybookComponent;

const meta: Meta<HeaderArgs> = {
  title: 'Components/Navigation/Header',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrMainContainerModule, ClrNavigationModule, HeaderStorybookComponent],
    }),
  ],
  component: ClrHeader,
  argTypes: {
    // methods
    ...hideControls('closeOpenNav', 'initializeNavTriggers', 'openNav', 'resetNavTriggers', 'toggleNav'),
    // story helpers
  },
  args: {},
  render: args => ({
    props: {
      ...args,
    },
    template: `
      <storybook-header ${argsToTemplate(args)}></storybook-header>
    `,
  }),
};

export default meta;

type Story = StoryObj<HeaderArgs>;

export const Default: Story = {};

export const Collapsed: Story = {};
