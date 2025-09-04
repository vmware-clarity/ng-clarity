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
  title: 'Tree/Tree with actionable nodes',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrTreeViewModule],
    }),
  ],
  component: ClrTree,
  argTypes: {
    clrLazy: { control: { disable: true }, table: { disable: true } },
    active: {
      control: { type: 'inline-radio' },
      options: ['apples', 'oranges', 'pumpkins'],
    },
  },
  args: {
    active: 'oranges',
  },
};

const TreeWithActionableNodesTemplate: StoryFn = args => ({
  template: `
    <clr-tree>
      <clr-tree-node [clrExpanded]="true">
        <cds-icon shape="folder"></cds-icon>
        Fruits
        <clr-tree-node>
          <button id="apples" (click)="active = 'apples'" class="clr-treenode-link" [class.active]="active === 'apples'">
            <cds-icon shape="file"></cds-icon>
            Apples (button)
          </button>
        </clr-tree-node>
        <clr-tree-node>
          <button (click)="active = 'oranges'" class="clr-treenode-link" [class.active]="active === 'oranges'">
            <cds-icon shape="file"></cds-icon>
            Oranges (button)
          </button>
        </clr-tree-node>
        <clr-tree-node>
          <a
            href="javascript:void(0)"
            (click)="active = 'pumpkins'"
            class="clr-treenode-link"
            [class.active]="active === 'pumpkins'"
          >
            <cds-icon shape="file"></cds-icon>
            Pumpkins (anchor)
          </a>
        </clr-tree-node>
      </clr-tree-node>
    </clr-tree>
  `,
  props: args,
});

export const TreeWithActionableNodes: StoryObj = {
  render: TreeWithActionableNodesTemplate,
};
