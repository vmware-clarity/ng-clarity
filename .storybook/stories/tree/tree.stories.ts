/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrIcon, ClrTree, ClrTreeViewModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';
import { filesRoot, getFileTreeNodeMarkup } from '../../helpers/files.data';

export default {
  title: 'Tree/Tree',
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
};

const TreeViewTemplate: StoryFn = args => ({
  template: `
    <clr-tree>${getFileTreeNodeMarkup(filesRoot, args)}</clr-tree>
  `,
  props: args,
});

export const TreeView: StoryObj = {
  render: TreeViewTemplate,
};

export const TreeViewAsLink: StoryObj = {
  render: TreeViewTemplate,
  args: {
    asLink: true,
  },
};

export const TreeViewHasIcon: StoryObj = {
  render: TreeViewTemplate,
  args: {
    hasIcon: true,
  },
};

export const TreeViewAsLinkHasIcon: StoryObj = {
  render: TreeViewTemplate,
  args: {
    asLink: true,
    hasIcon: true,
  },
};
