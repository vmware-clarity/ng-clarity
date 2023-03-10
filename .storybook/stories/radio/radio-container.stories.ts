/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { ClrRadioContainer, ClrRadioModule } from '../../../projects/angular/src';
import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <clr-radio-container [clrInline]="clrInline">
      <label>{{label}}</label>
      <clr-radio-wrapper *ngFor="let _ of createArray(optionCount); let i = index">
        <input type="radio" clrRadio name="options" value="i + 1" />
        <label>Option {{i + 1}}</label>
      </clr-radio-wrapper>
    </clr-radio-container>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Radio/Radio Container',
  component: ClrRadioContainer,
  argTypes: {
    // inputs
    clrInline: { defaultValue: false, control: { type: 'boolean' } },
    // methods
    addGrid: { control: { disabled: true }, table: { disable: true } },
    controlClass: { control: { disabled: true }, table: { disable: true } },
    // story helpers
    createArray: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    label: 'Options',
    createArray: n => new Array(n),
    optionCount: 3,
  },
};

const variants: Parameters[] = [
  {
    clrInline: false,
  },
  {
    clrInline: true,
  },
];

setupStorybook(ClrRadioModule, defaultStory, defaultParameters, variants);
