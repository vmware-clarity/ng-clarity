/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrIcon, ClrTree, ClrTreeViewModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { CommonModules } from '@storybook-helpers/common';
import { filesRoot, getFileTreeNodeMarkup } from '@storybook-helpers/files.data';

/**
 * `ClrTree` cannot be the args type: it declares its only input as `@Input('clrLazy') set lazy`, so
 * `clrLazy` is not a property of the class. `asLink` and `hasIcon` are story-only props consumed by
 * `getFileTreeNodeMarkup()` while the template string is built.
 */
type TreeArgs = {
  clrLazy: boolean;
  asLink: boolean;
  hasIcon: boolean;
};

const meta: Meta<TreeArgs> = {
  title: 'Components/Data/Tree',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrTreeViewModule, ClrIcon],
    }),
  ],
  component: ClrTree,
  argTypes: {
    // inputs
    clrLazy: { control: { disable: true } },
  },
  args: {
    // story helpers
    asLink: false,
    hasIcon: false,
  },
  render: args => ({
    template: `
      <clr-tree>${getFileTreeNodeMarkup(filesRoot, args)}</clr-tree>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<TreeArgs>;

export const TreeView: Story = {};

export const TreeViewAsLink: Story = {
  args: {
    asLink: true,
  },
};

export const TreeViewHasIcon: Story = {
  args: {
    hasIcon: true,
  },
};

export const TreeViewAsLinkHasIcon: Story = {
  args: {
    asLink: true,
    hasIcon: true,
  },
};
