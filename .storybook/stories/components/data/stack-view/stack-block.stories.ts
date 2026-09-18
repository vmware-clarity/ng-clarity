/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrStackBlock, ClrStackViewModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';
import { action } from 'storybook/actions';

/**
 * `ClrStackBlock` cannot be the args base: it aliases every input
 * (`@Input('clrSbExpanded') expanded`), so the `clrSb*` names the template binds are not properties of the
 * class. The three methods are picked off the component only so the `argTypes` entries that hide their
 * docgen rows stay type-checked.
 */
type StackBlockArgs = Pick<ClrStackBlock, 'addChild' | 'getStackChildrenId' | 'toggleExpand'> & {
  clrSbExpandable: boolean;
  clrSbExpanded: boolean;
  clrSbNotifyChange: boolean;
  clrSbExpandedChange: (expanded: boolean) => void;
  label: string;
  content: string;
  subLabel: string;
  subContent: string;
};

const meta: Meta<StackBlockArgs> = {
  title: 'Components/Data/Stack View/Stack Block',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrStackViewModule],
    }),
  ],
  component: ClrStackBlock,
  argTypes: {
    // outputs
    ...hideControls('clrSbExpandedChange'),
    // methods
    ...hideControls('addChild', 'getStackChildrenId', 'toggleExpand'),
  },
  args: {
    // inputs
    clrSbExpandable: undefined,
    // outputs
    clrSbExpandedChange: action('clrSbExpandedChange'),
    // story helpers
    label: 'Block',
    content: 'Block content',
    subLabel: 'Sub-block',
    subContent: 'Sub-block content',
  },
  render: args => ({
    template: `
      <clr-stack-view>
        <clr-stack-block
          ${args.clrSbExpandable === undefined ? '' : '[clrSbExpandable]="clrSbExpandable"'}
          [clrSbExpanded]="clrSbExpanded"
          (clrSbExpandedChange)="clrSbExpandedChange($event)"
          [clrSbNotifyChange]="clrSbNotifyChange"
        >
          <clr-stack-label>{{ label }}</clr-stack-label>
          <clr-stack-content>{{ content }}</clr-stack-content>
          <clr-stack-block>
            <clr-stack-label>{{ subLabel }}</clr-stack-label>
            <clr-stack-content>{{ subContent }}</clr-stack-content>
          </clr-stack-block>
        </clr-stack-block>
      </clr-stack-view>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<StackBlockArgs>;

export const StackView: Story = {};

export const StackViewNonExpandable: Story = {
  args: { clrSbExpandable: false },
};

export const StackViewCollapsed: Story = {
  args: { clrSbExpanded: false },
};

export const StackViewExpanded: Story = {
  args: { clrSbExpanded: true },
};

export const StackViewNotifyChange: Story = {
  args: { clrSbNotifyChange: true },
};
