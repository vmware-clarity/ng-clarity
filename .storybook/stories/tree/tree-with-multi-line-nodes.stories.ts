/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrTree, ClrTreeViewModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';
import { CommonModules } from 'helpers/common';

export default {
  title: 'Tree/Tree with multi-line nodes',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrTreeViewModule],
    }),
  ],
  component: ClrTree,
  argTypes: {
    clrLazy: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    selected: null,
  },
};

const TreeWithMultiLineNodesTemplate: StoryFn = args => ({
  template: `
    <clr-tree>
      <clr-tree-node [clrExpanded]="true" [clrSelected]="selected">
        <cds-icon shape="folder"></cds-icon>
        Drawer
        <clr-tree-node [clrExpanable]="true">
          Multi-line content.
          <br />
          The caret and checkbox on the left
          <br />
          should be aligned to the top of the node.
          <clr-tree-node [clrSelected]="selected">
            You opened a secret node. You find an orange
            <cds-icon shape="circle" solid="true" style="color: orange"></cds-icon>
          </clr-tree-node>
        </clr-tree-node>
      </clr-tree-node>
    </clr-tree>
  `,
  props: args,
});

export const TreeWithMultiLineNodes: StoryObj = {
  render: TreeWithMultiLineNodesTemplate,
};
