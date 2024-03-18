/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSelectedState, ClrTreeNode, ClrTreeViewModule } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, Story, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';
import { filesRoot, getFileTreeNodeMarkup, getIconTreeNodeMarkup } from '../../helpers/files.data';

const TREE_NODE_STATE = [
  // unselected
  { clrExpanded: false, clrSelected: ClrSelectedState.UNSELECTED, type: 'Unselected' },
  { clrExpanded: true, clrSelected: ClrSelectedState.UNSELECTED, type: 'Unselected' },
  // indeterminate
  { clrExpanded: false, clrSelected: ClrSelectedState.INDETERMINATE, type: 'Indeterminate' },
  { clrExpanded: true, clrSelected: ClrSelectedState.INDETERMINATE, type: 'Indeterminate' },
  // selected
  { clrExpanded: false, clrSelected: ClrSelectedState.SELECTED, type: 'Selected' },
  { clrExpanded: true, clrSelected: ClrSelectedState.SELECTED, type: 'Selected' },
];

const EXPANDED_STATE = [false, true];

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
    clrExpandable: { defaultValue: true, control: { type: 'boolean' } },
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
    TREE_NODE_STATE: { control: { disable: true }, table: { disable: true } },
    EXPANDED_STATE: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // outputs
    clrExpandedChange: action('clrExpandedChange'),
    clrSelectedChange: action('clrSelectedChange'),
    TREE_NODE_STATE,
    EXPANDED_STATE,
  },
};

const TreeViewNodeTemplate: Story = args => ({
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
  props: args,
});

const TreeViewNodeAllTemplate: Story = args => ({
  template: `
    <span cds-text="subsection">Default</span>
    <div *ngFor="let state of EXPANDED_STATE" style="margin-top:20px;margin-bottom:20px">
      <clr-tree>
        <clr-tree-node
          [clrExpandable]="clrExpandable"
          [clrExpanded]="state"
          (clrExpandedChange)="clrExpandedChange($event)"
          (clrSelectedChange)="clrSelectedChange($event)"
        >
          Files
          ${getFileTreeNodeMarkup(filesRoot)}
        </clr-tree-node>
      </clr-tree>
    </div>

    <span cds-text="subsection">Checkbox</span>
    <div *ngFor="let nodeType of TREE_NODE_STATE" style="margin:20px">
      <span *ngIf="!nodeType.clrExpanded" cds-text="message" style="line-height:45px">{{nodeType?.type}}</span>
      <clr-tree>
        <clr-tree-node
          [clrExpandable]="clrExpandable"
          [clrExpanded]="nodeType.clrExpanded"
          [clrSelected]="nodeType.clrSelected"
          (clrExpandedChange)="clrExpandedChange($event)"
          (clrSelectedChange)="clrSelectedChange($event)"
        >
          Files
          ${getFileTreeNodeMarkup(filesRoot)}
        </clr-tree-node>
      </clr-tree>
    </div>

    <span cds-text="subsection">Icon</span>
    <div *ngFor="let state of EXPANDED_STATE" style="margin-top:20px;margin-bottom:20px">
      <clr-tree>
        <clr-tree-node
          [clrExpandable]="clrExpandable"
          [clrExpanded]="state"
          (clrExpandedChange)="clrExpandedChange($event)"
          (clrSelectedChange)="clrSelectedChange($event)"
        >
          <cds-icon [attr.shape]="'folder'"></cds-icon>
          Files
          ${getIconTreeNodeMarkup(filesRoot)}
        </clr-tree-node>
      </clr-tree>
    </div>
  `,
  props: args,
});

export const TreeNode: StoryObj = {
  render: TreeViewNodeTemplate,
};

export const TreeNodeShowcase: StoryObj = {
  render: TreeViewNodeAllTemplate,
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};
