/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrStackView, ClrStackViewModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

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

const StackViewTemplate: StoryFn = args => ({
  template: `
    <clr-stack-view>
      @for (_ of createArray(blockCount); track $index; let i = $index) {
        <clr-stack-block [clrSbExpanded]="!!openIndices[i]">
          <clr-stack-label>{{ label }} {{ i + 1 }}</clr-stack-label>
          <clr-stack-content>{{ content }}</clr-stack-content>
          <clr-stack-block>
            <clr-stack-label>{{ subLabel }} {{ i + 1 }}</clr-stack-label>
            <clr-stack-content>{{ subContent }}</clr-stack-content>
          </clr-stack-block>
        </clr-stack-block>
      }
    </clr-stack-view>
  `,
  props: args,
});

const StackViewAllTemplate: StoryFn = args => ({
  template: `
    @for (state of STACK_VIEW_STATES; track state) {
      <div style="margin-top: 20px">
        <clr-stack-view>
          @for (_ of createArray(blockCount); track $index; let i = $index) {
            <clr-stack-block [clrSbExpanded]="!!state.openIndices[i]">
              <clr-stack-label>{{ label }} {{ i + 1 }}</clr-stack-label>
              <clr-stack-content>{{ content }}</clr-stack-content>
              <clr-stack-block>
                <clr-stack-label>{{ subLabel }} {{ i + 1 }}</clr-stack-label>
                <clr-stack-content>{{ subContent }}</clr-stack-content>
              </clr-stack-block>
            </clr-stack-block>
          }
        </clr-stack-view>
      </div>
    }
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

const StackViewBaseCssTemplate: StoryFn = args => ({
  template: `
    <div class="stack-view">
      <div class="stack-block">
        <div class="stack-block-label">
          <div class="stack-view-key" aria-level="1" aria-posinset="1" aria-setsize="3">Immutable Key</div>
          <div class="stack-block-content">Immutable Content</div>
        </div>
      </div>
      @for (_ of createArray(blockCount); track $index; let i = $index) {
        <div class="stack-block stack-block-expandable stack-block-expanded">
          <div class="stack-block-label">
            <div class="stack-view-key">{{ label }} {{ i + 1 }}</div>
            <div class="stack-block-content">{{ content }}</div>
          </div>
          <div class="stack-children">
            <div class="stack-block">
              <div class="stack-block-label">
                <div class="stack-view-key">{{ subLabel }} {{ i + 1 }}</div>
                <div class="stack-block-content">{{ subContent }}</div>
              </div>
            </div>
          </div>
        </div>
      }
      <div class="stack-block stack-block-expandable">
        <div class="stack-block-label">
          <div class="stack-view-key" aria-level="1" aria-posinset="3" aria-setsize="3">Immutable Expandable Key</div>
          <div class="stack-block-content">Immutable Expandable Content</div>
        </div>
        <div class="stack-children"></div>
      </div>
    </div>
  `,
  props: args,
});

export const StackViewBaseCss: StoryObj = {
  render: StackViewBaseCssTemplate,
};
