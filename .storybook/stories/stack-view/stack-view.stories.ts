/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrStackView, ClrStackViewModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <clr-stack-view>
      <clr-stack-block
        *ngFor="let _ of createArray(blockCount); let i = index"
        [clrSbExpanded]="!!openIndices[i]"
      >
        <clr-stack-label>{{ label }} {{ i + 1 }}</clr-stack-label>
        <clr-stack-content>{{ content }}</clr-stack-content>
        <clr-stack-block>
          <clr-stack-label>{{ subLabel }} {{ i + 1 }}</clr-stack-label>
          <clr-stack-content>{{ subContent }}</clr-stack-content>
        </clr-stack-block>
      </clr-stack-block>
    </clr-stack-view>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Stack View/Stack View',
  component: ClrStackView,
  argTypes: {
    // story helpers
    openIndices: { control: { disable: true }, table: { disable: true } },
    createArray: { control: { disable: true }, table: { disable: true } },
    blockCount: { control: { type: 'number', min: 1, max: 100 } },
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
  },
};

const variants: Parameters[] = [
  {
    blockCount: 4,
    openIndices: [],
  },
  {
    blockCount: 4,
    openIndices: [true],
  },
  {
    blockCount: 4,
    openIndices: [false, false, false, true],
  },
  {
    blockCount: 4,
    openIndices: [false, true, true, false],
  },
  {
    blockCount: 4,
    openIndices: [true, true, true, true],
  },
];

setupStorybook(ClrStackViewModule, defaultStory, defaultParameters, variants);
