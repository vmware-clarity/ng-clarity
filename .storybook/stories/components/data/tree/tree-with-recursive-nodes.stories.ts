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

const meta: Meta<RecursiveNodesArgs> = {
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
};

export default meta;

type Story = StoryObj<RecursiveNodesArgs>;

export const RecursiveNodes: Story = {};
