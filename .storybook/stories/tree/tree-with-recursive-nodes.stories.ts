/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrTree, ClrTreeViewModule } from '@clr/angular';
import { moduleMetadata, Story, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';
import { filesRoot } from '../../helpers/files.data';

export default {
  title: 'Tree/Tree with recursive nodes',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrTreeViewModule],
    }),
  ],
  component: ClrTree,
  argTypes: {
    // inputs
    clrLazy: { control: { disable: true } },
    // story helpers
    files: { control: { disable: true }, table: { disable: true } },
    getChildren: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    files: filesRoot,
    getChildren: file => file.files,
  },
};

const RecursiveTreeViewTemplate: Story = args => ({
  template: `
    <clr-tree>
      <clr-tree-node *clrRecursiveFor="let file of files; getChildren: getChildren">
        {{file.name}}
      </clr-tree-node>
    </clr-tree>
  `,
  props: args,
});

export const RecursiveNodes: StoryObj = {
  render: RecursiveTreeViewTemplate,
};
