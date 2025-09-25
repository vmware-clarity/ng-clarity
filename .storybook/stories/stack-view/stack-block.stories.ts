/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrStackBlock, ClrStackViewModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';
import { action } from 'storybook/actions';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Stack View/Stack Block',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrStackViewModule],
    }),
  ],
  component: ClrStackBlock,
  argTypes: {
    // outputs
    clrSbExpandedChange: { control: { disable: true }, table: { disable: true } },
    // methods
    addChild: { control: { disable: true }, table: { disable: true } },
    getStackChildrenId: { control: { disable: true }, table: { disable: true } },
    toggleExpand: { control: { disable: true }, table: { disable: true } },
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
};

const StackViewTemplate: StoryFn = args => ({
  template: `
    <clr-stack-view>
      <clr-stack-block
        ${args.clrSbExpandable === undefined ? '' : '[clrSbExpandable]="clrSbExpandable"'}
        [clrSbExpanded]="clrSbExpanded"
        [clrStackViewLevel]="clrStackViewLevel"
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
});

export const StackView: StoryObj = {
  render: StackViewTemplate,
};

export const StackViewNonExpandable: StoryObj = {
  render: StackViewTemplate,
  args: { clrSbExpandable: false },
};

export const StackViewColapsed: StoryObj = {
  render: StackViewTemplate,
  args: { clrSbExpanded: false },
};

export const StackViewExpanded: StoryObj = {
  render: StackViewTemplate,
  args: { clrSbExpanded: true },
};

export const StackViewNotifyChange: StoryObj = {
  render: StackViewTemplate,
  args: { clrSbNotifyChange: true },
};
