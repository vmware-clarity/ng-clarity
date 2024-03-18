/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrTree, ClrTreeViewModule } from '@clr/angular';
import { moduleMetadata, Story, StoryObj } from '@storybook/angular';
import { of, timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { CommonModules } from '../../helpers/common';
import { filesRoot } from '../../helpers/files.data';

export default {
  title: 'Tree/Tree with lazy-loaded recursive nodes',
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
    files: of(filesRoot),
    getChildren: file => timer(1000).pipe(mapTo(file.files)),
  },
};

const TreeViewTemplate: Story = args => ({
  template: `
    <clr-tree [clrLazy]="true">
      <clr-tree-node
        *clrRecursiveFor="let file of files | async; getChildren: getChildren"
        [clrExpandable]="!!file?.files"
      >
        {{ file?.name }}
      </clr-tree-node>
    </clr-tree>
  `,
  props: args,
});

export const LazyLoadedRecursiveNodes: StoryObj = {
  render: TreeViewTemplate,
};
