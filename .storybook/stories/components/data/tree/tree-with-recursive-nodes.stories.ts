/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrTree, ClrTreeViewModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';
import { type File, filesRoot } from '@storybook-helpers/files.data';

/**
 * `ClrTree` declares its input as `@Input('clrLazy') set lazy`, so `clrLazy` is not a property of the
 * class; `files` and `getChildren` are story-only props `*clrRecursiveFor` reads through `props`.
 */
type RecursiveNodesArgs = {
  clrLazy: boolean;
  files: File[];
  getChildren: (file: File) => File[];
};

const meta = {
  title: 'Components/Data/Tree/With Recursive Nodes',
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
    ...hideControls('files', 'getChildren'),
  },
  args: {
    // story helpers
    files: filesRoot,
    getChildren: file => file.files,
  },
  render: args => ({
    template: `
      <clr-tree>
        <clr-tree-node *clrRecursiveFor="let file of files; getChildren: getChildren">
          {{ file.name }}
        </clr-tree-node>
      </clr-tree>
    `,
    props: args,
  }),
} satisfies Meta<RecursiveNodesArgs>;

export default meta;

type Story = StoryObj<RecursiveNodesArgs>;

export const RecursiveNodes: Story = {};

export const RecursiveNodesExpandAll: Story = {
  // eslint-disable-next-line no-restricted-syntax -- this story adds expand all and collapse all buttons wired to the tree
  render: args => ({
    template: `
      <div class="btn-group btn-sm" cds-layout="m-b:md">
        <button type="button" class="btn" (click)="tree.expandAll()">Expand all</button>
        <button type="button" class="btn" (click)="tree.collapseAll()">Collapse all</button>
      </div>
      <clr-tree #tree>
        <clr-tree-node *clrRecursiveFor="let file of files; getChildren: getChildren">
          {{ file.name }}
        </clr-tree-node>
      </clr-tree>
    `,
    props: args,
  }),
};

export const RecursiveNodesExpandDescendants: Story = {
  // eslint-disable-next-line no-restricted-syntax -- this story expands one subtree through a button on its node
  render: args => ({
    template: `
      <p cds-text="body">
        Only the
        <code>src</code>
        subtree is expanded, through expandDescendants() on that node.
      </p>
      <clr-tree>
        <clr-tree-node #node *clrRecursiveFor="let file of files; getChildren: getChildren">
          {{ file.name }}
          @if (file.name === 'src') {
            <button type="button" class="btn btn-sm btn-link" (click)="node.expandDescendants()">Expand src</button>
          }
        </clr-tree-node>
      </clr-tree>
    `,
    props: args,
  }),
};
