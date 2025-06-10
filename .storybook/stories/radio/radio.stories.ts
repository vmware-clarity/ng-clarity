/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrRadio, ClrRadioModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Radio/Radio',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrRadioModule],
    }),
  ],
  component: ClrRadio,
  argTypes: {
    // methods
    getProviderFromContainer: { control: { disable: true }, table: { disable: true } },
    triggerValidation: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // id
    id: '',
    // story helpers
    label: 'Option',
    disabled: false,
    checked: false,
  },
};

const RadioTemplate: StoryFn = args => ({
  template: `
    <clr-radio-wrapper>
      <input type="radio" clrRadio value="i + 1" [checked]="checked" [disabled]="disabled" />
      <label>{{ label }}</label>
    </clr-radio-wrapper>
  `,
  props: { ...args },
});

export const Radio: StoryObj = {
  render: RadioTemplate,
};

export const RadioLongLabel: StoryObj = {
  render: RadioTemplate,
  args: {
    label:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
};

export const Disabled: StoryObj = {
  render: RadioTemplate,
  args: {
    disabled: true,
  },
};

export const Checked: StoryObj = {
  render: RadioTemplate,
  args: {
    checked: true,
  },
};

export const DisabledAndChecked: StoryObj = {
  render: RadioTemplate,
  args: {
    checked: true,
    disabled: true,
  },
};
