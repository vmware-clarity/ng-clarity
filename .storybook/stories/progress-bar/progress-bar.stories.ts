/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
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
      [clrSuccess]="clrSuccess"
      [clrDanger]="clrDanger"
      [clrWarning]="clrWarning"
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
    clrSuccess: { defaultValue: false, control: { type: 'boolean' } },
    clrWarning: { defaultValue: false, control: { type: 'boolean' } },
    clrDanger: { defaultValue: false, control: { type: 'boolean' } },
    clrValue: { defaultValue: 0, control: { type: 'number' } },
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
    clrDanger: true,
    clrLabeled: true,
    clrDisplayVal: '66%',
  },
  {
    clrValue: 100,
    clrSuccess: true,
  },
  {
    clrValue: 50,
    clrWarning: true,
    clrLabeled: true,
    clrDisplayVal: '50%',
  },
  {
    clrValue: 75,
    clrCompact: true,
  },
];

setupStorybook(ClrProgressBarModule, defaultStory, defaultParameters, variants);
