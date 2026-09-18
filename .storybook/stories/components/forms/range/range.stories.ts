/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrRangeContainer, ClrRangeModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

/**
 * `ClrRangeContainer` aliases its only input (`@Input('clrRangeHasProgress') get hasProgress`), so the
 * component class cannot be the args type. The three container methods are named explicitly in `argTypes`,
 * so they are picked into the type to keep `argTypes` type-checked.
 */
type RangeArgs = {
  clrRangeHasProgress: boolean;
  label: string;
  value: number;
  disabled: boolean;
} & Pick<ClrRangeContainer, 'getRangeProgressFillWidth' | 'addGrid' | 'controlClass'>;

const meta: Meta<RangeArgs> = {
  title: 'Components/Forms/Range',
  decorators: [
    moduleMetadata({
      imports: [ClrRangeModule],
    }),
  ],
  component: ClrRangeContainer,
  argTypes: {
    // methods
    getRangeProgressFillWidth: { control: { disabled: true }, table: { disable: true } },
    addGrid: { control: { disabled: true }, table: { disable: true } },
    controlClass: { control: { disabled: true }, table: { disable: true } },
    value: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    // inputs
    clrRangeHasProgress: false,
    // story helpers
    label: 'Options',
    value: 50,
    disabled: false,
  },
  render: args => ({
    template: `
      <clr-range-container [clrRangeHasProgress]="clrRangeHasProgress">
        <label>{{ label }}</label>
        <input type="range" clrRange [value]="value" [disabled]="disabled" />
      </clr-range-container>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<RangeArgs>;

export const Range: Story = {};

export const ShowcaseRange: Story = {
  // render-override: this story lines up four differently configured range containers side by side, which the single-container meta template cannot express
  render: args => ({
    template: `
      <h6>Default Range</h6>
      <clr-range-container [clrRangeHasProgress]="false">
        <label>{{ label }}</label>
        <input type="range" clrRange [value]="value" [disabled]="false" />
      </clr-range-container>

      <h6>Disabled Range</h6>
      <clr-range-container [clrRangeHasProgress]="false">
        <label>{{ label }}</label>
        <input type="range" clrRange [value]="value" [disabled]="true" />
      </clr-range-container>

      <h6>Range with Progress</h6>
      <clr-range-container [clrRangeHasProgress]="true">
        <label>{{ label }}</label>
        <input type="range" clrRange [value]="value" [disabled]="false" />
      </clr-range-container>

      <h6>Disabled Range with Progress</h6>
      <clr-range-container class="compact" [clrRangeHasProgress]="true">
        <label>{{ label }}</label>
        <input type="range" clrRange [value]="value" [disabled]="true" />
      </clr-range-container>
    `,
    props: args,
  }),
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};
