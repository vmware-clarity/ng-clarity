/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrRadio, ClrRadioModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: ` 
    <clr-radio-wrapper>
      <input type="radio" clrRadio value="i + 1" [checked]="checked" [disabled]="disabled" />
      <label>{{label}}</label>
    </clr-radio-wrapper>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Radio/Radio',
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

const variants: Parameters[] = [
  {
    disabled: false,
    checked: false,
  },
  {
    disabled: false,
    checked: true,
  },
  {
    disabled: true,
    checked: false,
  },
  {
    disabled: true,
    checked: true,
  },
];

setupStorybook(ClrRadioModule, defaultStory, defaultParameters, variants);
