/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrRadio, ClrRadioModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';
import { CommonModules } from 'helpers/common';

export default {
  title: 'Radio/Radio',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrRadioModule],
    }),
  ],
  component: ClrRadio,
  argTypes: {
    // inputs
    id: { defaultValue: '' },
    // methods
    getProviderFromContainer: { control: { disable: true }, table: { disable: true } },
    triggerValidation: { control: { disable: true }, table: { disable: true } },
  },
  args: {
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
      <label>{{label}}</label>
    </clr-radio-wrapper>
  `,
  props: { ...args },
});

export const Radio: StoryObj = {
  render: RadioTemplate,
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

export const DisableddAndChecked: StoryObj = {
  render: RadioTemplate,
  args: {
    checked: true,
    disabled: true,
  },
};
