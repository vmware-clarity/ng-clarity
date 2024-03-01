/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrTree, ClrTreeViewModule } from '@clr/angular';
import { moduleMetadata, Story, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';
import { filesRoot, getFileTreeNodeMarkup } from '../../helpers/files.data';

export default {
  title: 'Tree/Tree',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrTreeViewModule],
    }),
  ],
  component: ClrTree,
  argTypes: {
    // inputs
    clrLazy: { control: { disable: true } },
  },
};

const TreeViewTemplate: Story = args => ({
  template: `
    <clr-tree>
      ${getFileTreeNodeMarkup(filesRoot)}
    </clr-tree>
  `,
  props: args,
});

export const TreeView: StoryObj = {
  render: TreeViewTemplate,
};
