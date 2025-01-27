/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSelect, ClrSelectModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

export default {
  title: 'Select/Multiple Select',
  component: ClrSelect,
  decorators: [
    moduleMetadata({
      imports: [ClrSelectModule],
    }),
  ],
  argTypes: {
    // methods
    getProviderFromContainer: { control: { disable: true }, table: { disable: true } },
    triggerValidation: { control: { disable: true }, table: { disable: true } },
    // story helpers
    createArray: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // inputs
    id: '',
    // story helpers
    createArray: n => new Array(n),
    optionCount: 3,
    selectedOptions: [],
  },
};

const multipleSelectTemplate: StoryFn = args => ({
  template: `
    <clr-select-container>
      <label>Options</label>
      <select multiple clrSelect>
        <option
          *ngFor="let _ of createArray(optionCount); let i = index"
          [value]="i + 1"
          [selected]="selectedOptions.includes(i + 1)"
          [disabled]="i === 0"
        >
          Option {{ i + 1 }}
        </option>
      </select>
    </clr-select-container>
  `,
  props: { ...args },
});

export const MultipleSelect: StoryObj = {
  render: multipleSelectTemplate,
};

export const MultipleSelectWithSelectedOption: StoryObj = {
  render: multipleSelectTemplate,
  args: {
    selectedOptions: [2],
  },
};

export const MultipleSelectWithSelectedOptions: StoryObj = {
  render: multipleSelectTemplate,
  args: {
    selectedOptions: [1, 3],
  },
};
