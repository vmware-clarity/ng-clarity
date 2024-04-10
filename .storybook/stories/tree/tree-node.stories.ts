/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSelectedState, ClrTreeNode, ClrTreeViewModule } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';
import { filesRoot, getFileTreeNodeMarkup } from '../../helpers/files.data';

export default {
  title: 'Tree/Tree Node',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrTreeViewModule],
    }),
  ],
  component: ClrTreeNode,
  argTypes: {
    // inputs
    clrSelected: {
      control: 'inline-radio',
      options: ['not selectable', 'UNSELECTED', 'INDETERMINATE', 'SELECTED'],
      mapping: {
        'not selectable': undefined,
        UNSELECTED: ClrSelectedState.UNSELECTED,
        INDETERMINATE: ClrSelectedState.INDETERMINATE,
        SELECTED: ClrSelectedState.SELECTED,
      },
    },
    // outputs
    clrExpandedChange: { control: { disable: true } },
    clrSelectedChange: { control: { disable: true } },
    // methods
    broadcastFocusOnContainer: { control: { disable: true }, table: { disable: true } },
    focusTreeNode: { control: { disable: true }, table: { disable: true } },
    isExpandable: { control: { disable: true }, table: { disable: true } },
    isSelectable: { control: { disable: true }, table: { disable: true } },
    onKeyDown: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // inputs
    clrDisabled: false,
    clrExpandable: true,
    clrExpanded: false,
    clrSelected: 'not selectable',
    // outputs
    clrExpandedChange: action('clrExpandedChange'),
    clrSelectedChange: action('clrSelectedChange'),
  },
};

const TreeViewNodeTemplate: StoryFn = args => ({
  template: `
    <clr-tree>
      <clr-tree-node
        [clrExpandable]="clrExpandable"
        [clrExpanded]="clrExpanded"
        [clrDisabled]="clrDisabled"
        ${args.clrSelected === undefined ? '' : '[clrSelected]="clrSelected"'}
        (clrExpandedChange)="clrExpandedChange($event)"
        (clrSelectedChange)="clrSelectedChange($event)"
      >
        Files ${getFileTreeNodeMarkup(filesRoot, args)}
      </clr-tree-node>
    </clr-tree>
  `,
  props: args,
});

export const TreeNode: StoryObj = {
  render: TreeViewNodeTemplate,
  args: {
    clrExpanded: true,
  },
};

export const CheckboxSelected: StoryObj = {
  render: TreeViewNodeTemplate,
  args: {
    clrExpanded: true,
    clrSelected: ClrSelectedState.SELECTED,
  },
};

export const CheckboxIndeterminate: StoryObj = {
  render: TreeViewNodeTemplate,
  args: {
    clrExpanded: true,
    clrSelected: ClrSelectedState.INDETERMINATE,
  },
};

export const CheckboxUnselected: StoryObj = {
  render: TreeViewNodeTemplate,
  args: {
    clrExpanded: true,
    clrSelected: ClrSelectedState.UNSELECTED,
  },
};
