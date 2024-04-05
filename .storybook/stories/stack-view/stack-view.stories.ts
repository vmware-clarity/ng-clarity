/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrStackView, ClrStackViewModule } from '@clr/angular';
import { moduleMetadata, Story, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

const STACK_VIEW_STATES = [
  {
    openIndices: [true],
  },
  {
    openIndices: [false, false, false, true],
  },
  {
    openIndices: [false, true, true, false],
  },
  {
    openIndices: [true, true, true, true],
  },
];

export default {
  title: 'Stack View/Stack View',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrStackViewModule],
    }),
  ],
  component: ClrStackView,
  argTypes: {
    // story helpers
    openIndices: { control: { disable: true }, table: { disable: true } },
    createArray: { control: { disable: true }, table: { disable: true } },
    blockCount: { control: { type: 'number', min: 1, max: 100 } },
    STACK_VIEW_STATES: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    openIndices: [],
    createArray: n => new Array(n),
    blockCount: 4,
    label: 'Block',
    content: 'Block content',
    subLabel: 'Sub-block',
    subContent: 'Sub-block content',
    STACK_VIEW_STATES,
  },
};

const StackViewTemplate: Story = args => ({
  template: `
    <clr-stack-view>
      <clr-stack-block *ngFor="let _ of createArray(blockCount); let i = index" [clrSbExpanded]="!!openIndices[i]">
        <clr-stack-label>{{ label }} {{ i + 1 }}</clr-stack-label>
        <clr-stack-content>{{ content }}</clr-stack-content>
        <clr-stack-block>
          <clr-stack-label>{{ subLabel }} {{ i + 1 }}</clr-stack-label>
          <clr-stack-content>{{ subContent }}</clr-stack-content>
        </clr-stack-block>
      </clr-stack-block>
    </clr-stack-view>
  `,
  props: args,
});

const StackViewAllTemplate: Story = args => ({
  template: `
    <div *ngFor="let state of STACK_VIEW_STATES" style="margin-top: 20px">
      <clr-stack-view>
        <clr-stack-block
          *ngFor="let _ of createArray(blockCount); let i = index"
          [clrSbExpanded]="!!state.openIndices[i]"
        >
          <clr-stack-label>{{ label }} {{ i + 1 }}</clr-stack-label>
          <clr-stack-content>{{ content }}</clr-stack-content>
          <clr-stack-block>
            <clr-stack-label>{{ subLabel }} {{ i + 1 }}</clr-stack-label>
            <clr-stack-content>{{ subContent }}</clr-stack-content>
          </clr-stack-block>
        </clr-stack-block>
      </clr-stack-view>
    </div>
  `,
  props: args,
});

export const StackView: StoryObj = {
  render: StackViewTemplate,
};

export const StackViewShowcase: StoryObj = {
  render: StackViewAllTemplate,
  args: {
    blockCount: 4,
  },
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};
