/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrRadioContainer, ClrRadioModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

/**
 * The template binds `<clr-radio-container [clrInline]>` and plain radio inputs, so the args are declared
 * standalone; the two container methods are picked in because `argTypes` names them explicitly.
 * `createArray` stays an arg because the meta template calls it through `props`.
 */
type RadioContainerArgs = {
  clrInline: boolean;
  label: string;
  createArray: (n: number) => unknown[];
  optionCount: number;
} & Pick<ClrRadioContainer, 'addGrid' | 'controlClass'>;

const meta: Meta<RadioContainerArgs> = {
  title: 'Radio/Radio Container',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrRadioModule],
    }),
  ],
  component: ClrRadioContainer,
  argTypes: {
    // methods
    addGrid: { control: { disabled: true }, table: { disable: true } },
    controlClass: { control: { disabled: true }, table: { disable: true } },
    // story helpers
    ...hideControls('createArray'),
  },
  args: {
    // inputs
    clrInline: false,
    // story helpers
    label: 'Options',
    createArray: n => new Array(n),
    optionCount: 3,
  },
  render: args => ({
    template: `
      <clr-radio-container [clrInline]="clrInline">
        <label>{{ label }}</label>
        @for (_ of createArray(optionCount); track $index; let i = $index) {
          <clr-radio-wrapper>
            <input type="radio" clrRadio name="options" value="i + 1" />
            <label>Option {{ i + 1 }}</label>
          </clr-radio-wrapper>
        }
      </clr-radio-container>
    `,
    props: { ...args },
  }),
};

export default meta;

type Story = StoryObj<RadioContainerArgs>;

export const RadioContainer: Story = {};

export const Inline: Story = {
  args: {
    clrInline: true,
  },
};
