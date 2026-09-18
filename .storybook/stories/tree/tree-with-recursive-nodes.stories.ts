/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrTree, ClrTreeViewModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

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

const RecursiveTreeViewTemplate: StoryFn = args => ({
  template: `
    <clr-tree>
      <clr-tree-node *clrRecursiveFor="let file of files; getChildren: getChildren">
        {{ file.name }}
      </clr-tree-node>
    </clr-tree>
  `,
  props: args,
});

export const RecursiveNodes: StoryObj = {
  render: RecursiveTreeViewTemplate,
};

const RecursiveExpandAllTemplate: StoryFn = args => ({
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
});

export const RecursiveNodesExpandAll: StoryObj = {
  render: RecursiveExpandAllTemplate,
};

const RecursiveExpandDescendantsTemplate: StoryFn = args => ({
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
});

export const RecursiveNodesExpandDescendants: StoryObj = {
  render: RecursiveExpandDescendantsTemplate,
};
