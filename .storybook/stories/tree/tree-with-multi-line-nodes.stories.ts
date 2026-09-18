/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrIcon, ClrSelectedState, ClrTree, ClrTreeViewModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

/**
 * `ClrTree` declares its input as `@Input('clrLazy') set lazy`, so `clrLazy` is not a property of the
 * class; `selected` is a story-only prop bound to the nodes' `[clrSelected]`.
 */
type TreeWithMultiLineNodesArgs = {
  clrLazy: boolean;
  selected: ClrSelectedState;
};

const meta: Meta<TreeWithMultiLineNodesArgs> = {
  title: 'Tree/Tree with multi-line nodes',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrTreeViewModule, ClrIcon],
    }),
  ],
  component: ClrTree,
  argTypes: {
    ...hideControls('clrLazy'),
  },
  args: {
    selected: null,
  },
  render: args => ({
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
  }),
};

export default meta;

type Story = StoryObj<TreeWithMultiLineNodesArgs>;

export const TreeWithMultiLineNodes: Story = {};
