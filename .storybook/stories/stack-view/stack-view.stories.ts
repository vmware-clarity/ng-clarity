/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrStackView, ClrStackViewModule } from '@clr/angular';
import { ClrTooltipModule } from '@clr/angular';
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

const tooltipPositions = ['bottom-left', 'bottom-right', 'top-left', 'top-right', 'right', 'left'];
const tooltipSizes = ['xs', 'sm', 'md', 'lg'];

export default {
  title: 'Stack View/Stack View',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrStackViewModule, ClrTooltipModule],
    }),
  ],
  component: ClrStackView,
  argTypes: {
    // story helpers
    openIndices: { control: { disable: true }, table: { disable: true } },
    createArray: { control: { disable: true }, table: { disable: true } },
    blockCount: { control: { type: 'number', min: 1, max: 100 } },
    STACK_VIEW_STATES: { control: { disable: true }, table: { disable: true } },
    TooltipPosition: { control: 'inline-radio', options: tooltipPositions },
    TooltipSize: { control: 'inline-radio', options: tooltipSizes },
  },
  args: {
    // story helpers
    openIndices: [],
    createArray: n => new Array(n),
    blockCount: 4,
    label: 'Block',
    content: 'Block content',
    tooltipContent:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
    subLabel: 'Sub-block',
    subContent: 'Sub-block content',
    STACK_VIEW_STATES,
    TooltipPosition: 'right',
    TooltipSize: 'sm',
  },
};

const StackViewTemplate: StoryFn = args => ({
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

const StackViewAllTemplate: StoryFn = args => ({
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

const StackViewAllTemplateWithPopOver: StoryFn = args => ({
  template: `
    <div *ngFor="let state of STACK_VIEW_STATES" style="margin-top: 20px">
      <clr-stack-view>
        <clr-stack-block
          *ngFor="let _ of createArray(blockCount); let i = index"
          [clrSbExpanded]="!!state.openIndices[i]"
        >
          <clr-stack-label>
            {{ label }} {{ i + 1 }}
            <clr-tooltip>
              <cds-icon clrTooltipTrigger shape="info-circle" size="24"></cds-icon>
              <clr-tooltip-content [clrPosition]="TooltipPosition" [clrSize]="TooltipSize">
                {{ tooltipContent }}
              </clr-tooltip-content>
            </clr-tooltip>
          </clr-stack-label>
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

export const StackViewWithPopOver: StoryObj = {
  render: StackViewAllTemplateWithPopOver,
};
