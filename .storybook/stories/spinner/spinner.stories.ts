/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSpinner, ClrSpinnerModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Spinner/Spinner',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrSpinnerModule],
    }),
  ],
  component: ClrSpinner,
  argTypes: {
    // inputs
    clrInline: { defaultValue: false, control: { type: 'boolean' } },
    clrInverse: { defaultValue: false, control: { type: 'boolean' } },
    clrMedium: { defaultValue: false, control: { type: 'boolean' } },
    clrSmall: { defaultValue: false, control: { type: 'boolean' } },
    // story helpers
    text: { control: { type: 'text' }, description: 'Optional text' },
  },
  args: {
    // story helpers
    text: 'Loading',
  },
};

const SpinnerTemplate: StoryFn = args => ({
  template: `
    <div style="text-align: center">
      <clr-spinner [clrInverse]="clrInverse" [clrSmall]="clrSmall" [clrMedium]="clrMedium" [clrInline]="clrInline">
        {{ text }}
      </clr-spinner>
      <br *ngIf="!clrInline" />
      {{ text }}
    </div>
  `,
  props: args,
});

export const Spinner: StoryObj = {
  render: SpinnerTemplate,
};

export const Inverse: StoryObj = {
  render: SpinnerTemplate,
  args: { clrInverse: true },
};

export const Medium: StoryObj = {
  render: SpinnerTemplate,
  args: { clrMedium: true },
};

export const MediumInverse: StoryObj = {
  render: SpinnerTemplate,
  args: { clrMedium: true, clrInverse: true },
};

export const Small: StoryObj = {
  render: SpinnerTemplate,
  args: { clrSmall: true },
};

export const SmallInverse: StoryObj = {
  render: SpinnerTemplate,
  args: { clrSmall: true, clrInverse: true },
};

export const Inline: StoryObj = {
  render: SpinnerTemplate,
  args: { clrInline: true },
};

export const InlineInverse: StoryObj = {
  render: SpinnerTemplate,
  args: { clrInline: true, clrInverse: true },
};
