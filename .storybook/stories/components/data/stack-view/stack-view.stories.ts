/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrStackView, ClrStackViewModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

/**
 * `ClrStackView` declares no inputs at all, so every arg here is story-only and the args type is a
 * standalone declaration rather than the component class. The templates call `createArray` off `props`,
 * so it stays an arg.
 */
type StackViewArgs = {
  openIndices: boolean[];
  createArray: (n: number) => any[];
  blockCount: number;
  label: string;
  content: string;
  subLabel: string;
  subContent: string;
  STACK_VIEW_STATES: { openIndices: boolean[] }[];
};

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

const meta: Meta<StackViewArgs> = {
  title: 'Components/Data/Stack View',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrStackViewModule],
    }),
  ],
  component: ClrStackView,
  argTypes: {
    // story helpers
    ...hideControls('openIndices', 'createArray'),
    blockCount: { control: { type: 'number', min: 1, max: 100 } },
    ...hideControls('STACK_VIEW_STATES'),
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
  render: args => ({
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
  }),
};

export default meta;

type Story = StoryObj<StackViewArgs>;

export const StackView: Story = {};

export const StackViewShowcase: Story = {
  // render-override: this story repeats the stack view once per STACK_VIEW_STATES entry, which the meta template cannot express
  render: args => ({
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
  }),
  args: {
    blockCount: 4,
  },
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};

export const StackViewBaseCss: Story = {
  // render-override: this story builds the stack view from the base CSS classes rather than the Clarity components, which the meta template cannot express
  render: args => ({
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
  }),
};
