/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSelectedState, ClrTreeNode, ClrTreeViewModule } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { filesRoot, getFileTreeNodeMarkup } from '../../helpers/files.data';
import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <clr-tree>
      <clr-tree-node
        [clrExpandable]="clrExpandable"
        [clrExpanded]="clrExpanded"
        ${args.clrSelected === undefined ? '' : '[clrSelected]="clrSelected"'}
        (clrExpandedChange)="clrExpandedChange($event)"
        (clrSelectedChange)="clrSelectedChange($event)"
      >
        Files
        ${getFileTreeNodeMarkup(filesRoot)}
      </clr-tree-node>
    </clr-tree>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Tree/Tree Node',
  component: ClrTreeNode,
  argTypes: {
    // inputs
    clrExpandable: { defaultValue: undefined, control: { type: 'boolean' } },
    clrExpanded: { defaultValue: false, control: { type: 'boolean' } },
    clrSelected: {
      defaultValue: 'not selectable',
      control: { type: 'inline-radio', options: ['not selectable', 'UNSELECTED', 'INDETERMINATE', 'SELECTED'] },
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
    // outputs
    clrExpandedChange: action('clrExpandedChange'),
    clrSelectedChange: action('clrSelectedChange'),
  },
};

const variants: Parameters[] = [
  // not selectable
  { clrExpanded: false },
  { clrExpanded: true },
  // unselected
  { clrExpanded: false, clrSelected: ClrSelectedState.UNSELECTED },
  { clrExpanded: true, clrSelected: ClrSelectedState.UNSELECTED },
  // indeterminate
  { clrExpanded: false, clrSelected: ClrSelectedState.INDETERMINATE },
  { clrExpanded: true, clrSelected: ClrSelectedState.INDETERMINATE },
  // selected
  { clrExpanded: false, clrSelected: ClrSelectedState.SELECTED },
  { clrExpanded: true, clrSelected: ClrSelectedState.SELECTED },
];

setupStorybook(ClrTreeViewModule, defaultStory, defaultParameters, variants);
