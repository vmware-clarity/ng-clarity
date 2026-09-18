/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSelectedState, ClrTreeNode, ClrTreeViewModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';
import { filesRoot, getFileTreeNodeMarkup } from '@storybook-helpers/files.data';
import { action } from 'storybook/actions';

/**
 * `ClrTreeNode` aliases every input and output it declares (`@Input('clrExpandable') expandable`,
 * `@Output('clrSelectedChange') selectedChange`, ...), so the `clr*` names the story binds are not
 * properties of the class and are declared here. Its methods are picked from the class, because they
 * exist in `argTypes` only to hide the rows `component: ClrTreeNode` generates for them.
 *
 * `clrSelected` is deliberately `any`: before `mapping` is applied it holds one of the option strings
 * (`'not selectable'`), after it holds a `ClrSelectedState` or `undefined`, and `getFileTreeNodeMarkup()`
 * declares the same value as a `boolean` flag it only tests for definedness. The arg *name* stays
 * checked, which is what `argTypes` and `args` need.
 */
type TreeNodeArgs = Pick<
  ClrTreeNode<unknown>,
  'broadcastFocusOnContainer' | 'focusTreeNode' | 'isExpandable' | 'isSelectable' | 'onKeyDown'
> & {
  clrDisabled: boolean;
  clrExpandable: boolean;
  clrExpanded: boolean;
  clrSelected: any;
  clrExpandedChange: (expanded: boolean) => void;
  clrSelectedChange: (selected: ClrSelectedState) => void;
};

const meta: Meta<TreeNodeArgs> = {
  title: 'Tree/Tree Node',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrTreeViewModule],
    }),
  ],
  component: ClrTreeNode,
  argTypes: {
    // inputs
    clrExpandable: { control: { type: 'boolean' } },
    clrSelected: {
      control: { type: 'inline-radio' },
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
    ...hideControls('broadcastFocusOnContainer', 'focusTreeNode', 'isExpandable', 'isSelectable', 'onKeyDown'),
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
  render: args => ({
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
          Files ${args.clrExpandable ? getFileTreeNodeMarkup(filesRoot, args) : ''}
        </clr-tree-node>
      </clr-tree>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<TreeNodeArgs>;

export const TreeNode: Story = {
  args: {
    clrExpanded: true,
  },
};

export const CheckboxSelected: Story = {
  args: {
    clrExpanded: true,
    clrSelected: ClrSelectedState.SELECTED,
  },
};

export const CheckboxIndeterminate: Story = {
  args: {
    clrExpanded: true,
    clrSelected: ClrSelectedState.INDETERMINATE,
  },
};

export const CheckboxUnselected: Story = {
  args: {
    clrExpanded: true,
    clrSelected: ClrSelectedState.UNSELECTED,
  },
};
