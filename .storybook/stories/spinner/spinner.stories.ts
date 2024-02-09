/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSpinner, ClrSpinnerModule } from '@clr/angular';
import { moduleMetadata, Story, StoryObj } from '@storybook/angular';
import { CommonModules } from 'helpers/common';

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

const SpinnerTemplate: Story = args => ({
  template: `
  <div style="text-align: center">
    <clr-spinner
      [clrInverse]="clrInverse"
      [clrSmall]="clrSmall"
      [clrMedium]="clrMedium"
      [clrInline]="clrInline"
    >
      {{text}}
    </clr-spinner>
    <br *ngIf="!clrInline" />
    {{text}}
  </div>
  `,
  props: args,
});

const SpinnerAllTemplate: Story = args => ({
  template: `
  <div style="text-align: center">
    <h5>Large Spinners</h5>
    
    <h6>Default</h6>
    <clr-spinner> {{text}} </clr-spinner>
    <h6>Inverse</h6>
    <clr-spinner [clrInverse]="true"> {{text}} </clr-spinner>
  
    <h5>Medium Spinners</h5>

    <h6>Default</h6>
    <div style="margin-top:5px">
      <clr-spinner [clrMedium]="true"> {{text}} </clr-spinner>
    </div>
    <h6>Inverse</h6>
    <div style="margin-top:5px">
      <clr-spinner [clrMedium]="true" [clrInverse]="true"> {{text}} </clr-spinner>
    </div> 

    <h5>Small Spinners</h5>

    <h6>Default</h6>
    <div style="margin-top:5px">
      <clr-spinner [clrSmall]="true"> {{text}} </clr-spinner>
    </div>
    <h6>Inverse</h6>
    <div style="margin-top:5px">
      <clr-spinner [clrSmall]="true" [clrInverse]="true"> {{text}} </clr-spinner>
    </div>

    <h5>Inline Spinners</h5>

    <h6>Default</h6>
    <div style="margin-top:5px">
      <clr-spinner [clrInline]="true"></clr-spinner> {{text}}
    </div>
    <h6>Inverse</h6>
    <div style="margin-top:5px">
      <clr-spinner [clrInline]="true" [clrInverse]="true"></clr-spinner> {{text}}
    </div>
  </div>
  `,
  props: args,
});

export const Spinner: StoryObj = {
  render: SpinnerTemplate,
};

export const SpinnerInverse: StoryObj = {
  render: SpinnerTemplate,
  args: { clrInverse: true },
};

export const SpinnerMedium: StoryObj = {
  render: SpinnerTemplate,
  args: { clrMedium: true },
};

export const SpinnerMediumInverse: StoryObj = {
  render: SpinnerTemplate,
  args: { clrMedium: true, clrInverse: true },
};

export const SpinnerSmall: StoryObj = {
  render: SpinnerTemplate,
  args: { clrSmall: true },
};

export const SpinnerSmallInverse: StoryObj = {
  render: SpinnerTemplate,
  args: { clrSmall: true, clrInverse: true },
};

export const SpinnerInline: StoryObj = {
  render: SpinnerTemplate,
  args: { clrInline: true },
};

export const SpinnerInlineInverse: StoryObj = {
  render: SpinnerTemplate,
  args: { clrInline: true, clrInverse: true },
};

export const SpinnerShowcase: StoryObj = {
  render: SpinnerAllTemplate,
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};
