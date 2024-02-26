/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrProgressBar } from '@clr/angular';
import { Story, StoryObj } from '@storybook/angular';

const STATUS_TYPES = ['', 'success', 'warning', 'danger'];

const ProgressBarTemplate: Story = args => ({
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

const ProgressBarTemplateAll: Story = args => ({
  template: `
  <h6>Progress Bar with Status</h6>
  <div style="margin-top: 5px;" *ngFor="let type of TYPES">
    <clr-progress-bar
    [id]="id"
    [clrMax]="clrMax"
    [clrDisplayval]="clrDisplayval"
    [clrValue]="clrValue"
    [clrLabeled]="clrLabeled"
    [clrFade]="clrFade"
    [clrLoop]="clrLoop"
    [clrColor]="type"
    [clrFlash]="clrFlash"
    [clrFlashDanger]="clrFlashDanger"
    [clrCompact]="clrCompact"
  ></clr-progress-bar>
  </div>

  <h6>Compact Progress Bar</h6>
  <clr-progress-bar
  [id]="id"
  [clrMax]="clrMax"
  [clrDisplayval]="clrDisplayval"
  [clrValue]="clrValue"
  [clrLabeled]="clrLabeled"
  [clrFade]="clrFade"
  [clrLoop]="clrLoop"
  [clrColor]="type"
  [clrFlash]="clrFlash"
  [clrFlashDanger]="clrFlashDanger"
  [clrCompact]="'true'"
></clr-progress-bar>

<h6>Labelled Progress Bar</h6>
<clr-progress-bar
[id]="id"
[clrMax]="clrMax"
[clrDisplayval]="clrDisplayval"
[clrValue]="clrValue"
[clrLabeled]="'true'"
[clrLoop]="clrLoop"
[clrColor]="type"
[clrFlash]="clrFlash"
[clrFlashDanger]="clrFlashDanger"
[clrCompact]="clrCompact"
></clr-progress-bar>

<h6>Looped Progress Bar</h6>
<clr-progress-bar
[id]="id"
[clrMax]="clrMax"
[clrDisplayval]="clrDisplayval"
[clrValue]="clrValue"
[clrLabeled]="clrLabeled"
[clrLoop]="'true'"
[clrColor]="type"
[clrFlash]="clrFlash"
[clrFlashDanger]="clrFlashDanger"
[clrCompact]="clrCompact"
></clr-progress-bar>
`,
  props: { ...args },
});

export default {
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

export const ProgressBar: StoryObj = {
  render: ProgressBarTemplate,
};

export const Showcase: StoryObj = {
  render: ProgressBarTemplateAll,
  args: {
    TYPES: [...STATUS_TYPES],
  },
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};
