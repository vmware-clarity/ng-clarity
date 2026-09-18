/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrIcon, ClrTree, ClrTreeViewModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

/**
 * `ClrTree` declares its input as `@Input('clrLazy') set lazy`, so `clrLazy` is not a property of the
 * class; `active` is a story-only prop the template writes back to on click.
 */
type TreeWithActionableNodesArgs = {
  clrLazy: boolean;
  active: string;
};

const meta: Meta<TreeWithActionableNodesArgs> = {
  title: 'Tree/Tree with actionable nodes',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrTreeViewModule, ClrIcon],
    }),
  ],
  component: ClrTree,
  argTypes: {
    ...hideControls('clrLazy'),
    active: {
      control: { type: 'inline-radio' },
      options: ['apples', 'oranges', 'pumpkins'],
    },
  },
  args: {
    active: 'oranges',
  },
  render: args => ({
    template: `
      <clr-tree>
        <clr-tree-node [clrExpanded]="true">
          <cds-icon shape="folder"></cds-icon>
          Fruits
          <clr-tree-node>
            <button
              id="apples"
              (click)="active = 'apples'"
              class="clr-treenode-link"
              [class.active]="active === 'apples'"
            >
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
  }),
};

export default meta;

type Story = StoryObj<TreeWithActionableNodesArgs>;

export const TreeWithActionableNodes: Story = {};
