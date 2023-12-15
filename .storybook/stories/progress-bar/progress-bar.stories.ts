/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrProgressBar, ClrProgressBarModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <clr-progress-bar
      [id]="id"
      [clrMax]="clrMax"
      [clrDisplayval]="clrDisplayval"
      [clrValue]="clrValue"
      [clrLabeled]="clrLabeled"
      [clrFade]="clrFade"
      [clrLoop]="clrLoop"
      [clrColor]="clrColor"
      [clrFlash]="clrFlash"
      [clrFlashDanger]="clrFlashDanger"
      [clrCompact]="clrCompact"
    ></clr-progress-bar>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Progress Bar/Progress Bar',
  component: ClrProgressBar,
  argTypes: {
    // inputs
    clrDisplayval: { defaultValue: '' },
    clrFade: { defaultValue: false, control: { type: 'boolean' } },
    clrFlash: { defaultValue: false, control: { type: 'boolean' } },
    clrFlashDanger: { defaultValue: false, control: { type: 'boolean' } },
    clrLabeled: { defaultValue: false, control: { type: 'boolean' } },
    clrLoop: { defaultValue: false, control: { type: 'boolean' } },
    clrMax: { defaultValue: 100, control: { type: 'number' } },
    clrColor: { defaultValue: '', control: { type: 'radio', options: ['', 'success', 'warning', 'danger'] } },
    clrValue: { defaultValue: 33, control: { type: 'number' } },
    clrCompact: { defaultValue: false, control: { type: 'boolean' } },
    id: { defaultValue: '' },
    // methods
    displayStringValue: { control: { disable: true }, table: { disable: true } },
  },
  args: {},
};

const variants: Parameters[] = [
  {
    clrValue: 33,
    clrLabeled: true,
    clrDisplayVal: '33%',
  },
  {
    clrValue: 66,
    clrColor: 'danger',
    clrLabeled: true,
    clrDisplayVal: '66%',
  },
  {
    clrValue: 100,
    clrColor: 'success',
  },
  {
    clrValue: 50,
    clrColor: 'warning',
    clrLabeled: true,
    clrDisplayVal: '50%',
  },
  {
    clrValue: 75,
    clrCompact: true,
  },
];

setupStorybook(ClrProgressBarModule, defaultStory, defaultParameters, variants);
