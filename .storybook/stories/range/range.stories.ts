/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrRangeContainer, ClrRangeModule } from '@clr/angular';
import { moduleMetadata, Story, StoryObj } from '@storybook/angular';

export default {
  title: 'Range/Range Container',
  decorators: [
    moduleMetadata({
      imports: [ClrRangeModule],
    }),
  ],
  component: ClrRangeContainer,
  argTypes: {
    // methods
    clrRangeHasProgress: { defaultValue: false, control: { type: 'boolean' } },
    getRangeProgressFillWidth: { control: { disabled: true }, table: { disable: true } },
    addGrid: { control: { disabled: true }, table: { disable: true } },
    controlClass: { control: { disabled: true }, table: { disable: true } },
    value: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    // story helpers
    label: 'Options',
    value: 50,
    disabled: false,
  },
};

const rangeTemplate: Story = args => ({
  template: ` 
    <clr-range-container [clrRangeHasProgress]="clrRangeHasProgress">
      <label>{{label}}</label>
      <input type="range" clrRange [value]="value" [disabled]="disabled" />
    </clr-range-container>
  `,
  props: { ...args },
});

export const Range: StoryObj = {
  render: rangeTemplate,
};

export const disabled: StoryObj = {
  render: rangeTemplate,
  args: {
    clrRangeHasProgress: true,
    disabled: true,
  },
};
