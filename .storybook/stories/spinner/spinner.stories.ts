/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSpinner, ClrSpinnerModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
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
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Spinner/Spinner',
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

const variants: Parameters[] = [
  // large spinners
  { clrInline: false, clrInverse: false, clrMedium: false, clrSmall: false },
  { clrInline: false, clrInverse: true, clrMedium: false, clrSmall: false },
  // medium spinners
  { clrInline: false, clrInverse: false, clrMedium: true, clrSmall: false },
  { clrInline: false, clrInverse: true, clrMedium: true, clrSmall: false },
  // small spinners
  { clrInline: false, clrInverse: false, clrMedium: false, clrSmall: true },
  { clrInline: false, clrInverse: true, clrMedium: false, clrSmall: true },
  // inline spinners
  { clrInline: true, clrInverse: false },
  { clrInline: true, clrInverse: true },
];

setupStorybook(ClrSpinnerModule, defaultStory, defaultParameters, variants);
