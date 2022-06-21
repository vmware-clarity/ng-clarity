/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrTree, ClrTreeViewModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { filesRoot } from '../../helpers/files.data';
import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <clr-tree>
      <clr-tree-node *clrRecursiveFor="let file of files; getChildren: getChildren">
        {{file.name}}
      </clr-tree-node>
    </clr-tree>
  `,
  props: {
    ...args,
  },
});

const defaultParameters: Parameters = {
  title: 'Tree/Tree with recursive nodes',
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

const variants: Parameters[] = [];

setupStorybook(ClrTreeViewModule, defaultStory, defaultParameters, variants);
