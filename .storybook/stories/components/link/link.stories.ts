/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { type Meta, type StoryObj } from '@storybook/angular';

import { LinkStorybookComponent } from './link.storybook.component';

/** Every arg is an `@Input()` of the story component, which is also this file's `component:`. */
type LinkArgs = LinkStorybookComponent;

const meta: Meta<LinkArgs> = {
  title: 'Components/Link',
  component: LinkStorybookComponent,
  args: {
    active: false,
    hover: false,
    visited: false,
    visitedHover: false,
  },
};

export default meta;

type Story = StoryObj<LinkArgs>;

export const Link: Story = {};

export const LinkActive: Story = {
  args: {
    active: true,
  },
};
export const LinkHover: Story = {
  args: {
    hover: true,
  },
};
export const LinkVisited: Story = {
  args: {
    visited: true,
  },
};
export const LinkVisitedHover: Story = {
  args: {
    visitedHover: true,
  },
};
