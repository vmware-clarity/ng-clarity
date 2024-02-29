/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrRadioContainer, ClrRadioModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';
import { CommonModules } from 'helpers/common';

export default {
  title: 'Radio/Radio Container',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrRadioModule],
    }),
  ],
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

const RadioContainerTemplate: StoryFn = args => ({
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

export const RadioContainer: StoryObj = {
  render: RadioContainerTemplate,
};

export const Inline: StoryObj = {
  render: RadioContainerTemplate,
  args: {
    clrInline: true,
  },
};
