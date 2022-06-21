/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrTree, ClrTreeViewModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { filesRoot, getFileTreeNodeMarkup } from '../../helpers/files.data';
import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <clr-tree>
      ${getFileTreeNodeMarkup(filesRoot)}
    </clr-tree>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Tree/Tree',
  component: ClrTree,
  argTypes: {
    // inputs
    clrLazy: { control: { disable: true } },
  },
};

const variants: Parameters[] = [];

setupStorybook(ClrTreeViewModule, defaultStory, defaultParameters, variants);
