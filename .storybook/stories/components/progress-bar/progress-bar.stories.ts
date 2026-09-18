/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrProgressBar } from '@clr/angular';
import { type Meta, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';

/**
 * `ClrProgressBar` aliases nearly every input (`@Input('clrMax') max`, `@Input('clrValue') value`), so the
 * component class cannot be the args type; the args are the `clr*` names the templates bind, plus the
 * `TYPES` list the showcase story iterates.
 */
type ProgressBarArgs = {
  id: string;
  clrMax: number | string;
  clrDisplayval: string;
  clrValue: number | string;
  clrLabeled: boolean | string;
  clrFade: boolean | string;
  clrLoop: boolean | string;
  clrColor: string;
  clrFlash: boolean | string;
  clrFlashDanger: boolean | string;
  clrCompact: boolean | string;
  TYPES: string[];
};

const STATUS_TYPES = ['', 'success', 'warning', 'danger'];

const meta: Meta<ProgressBarArgs> = {
  title: 'Components/Progress Bar',
  component: ClrProgressBar,
  argTypes: {
    // inputs
    clrColor: { control: { type: 'radio' }, options: ['', 'success', 'warning', 'danger'] },
    // methods
    ...hideControls('displayStringValue'),
  },
  args: {
    // inputs
    clrDisplayval: '',
    clrFade: false,
    clrFlash: false,
    clrFlashDanger: false,
    clrLabeled: false,
    clrLoop: false,
    clrMax: 100,
    clrColor: '',
    clrValue: 33,
    clrCompact: false,
    id: '',
  },
  render: args => ({
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
  }),
};

export default meta;

type Story = StoryObj<ProgressBarArgs>;

export const ProgressBar: Story = {};

export const Showcase: Story = {
  // render-override: this story renders the status/compact/labelled/looped matrix in one canvas, which the single-bar meta template cannot express
  render: args => ({
    template: `
      <h6>Progress Bar with Status</h6>
      @for (type of TYPES; track type) {
        <div style="margin-top: 5px">
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
      }
    `,
    props: { ...args },
  }),
  args: {
    TYPES: [...STATUS_TYPES],
  },
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};
