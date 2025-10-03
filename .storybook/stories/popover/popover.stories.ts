/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrPopoverService, ÇlrClrPopoverModuleNext } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { ExamplePopoverComponent } from './example-popover.component';
import { CommonModules } from '../../helpers/common';

const Positions: any = [
  'bottom-right',
  'bottom-left',
  'top-right',
  'top-left',
  'right-bottom',
  'left-bottom',
  'right-top',
  'left-top',
];

export default {
  title: 'Popover/PopoverNext',
  component: ExamplePopoverComponent,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ÇlrClrPopoverModuleNext],
    }),
  ],
  providers: [ClrPopoverService],
  argTypes: {
    positions: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    positions: Positions,
    open: true,
  },
};

const PopoverTemplate: StoryFn = args => ({
  template: `
    <div style="height: 100vh; width: 100%; display: flex; gap: 50px; justify-content: space-between">
      <div style="flex-direction: column; align-items: center; display: flex; gap: 50px">
        @for (pos of positions; track pos) {
          <example-popover [popoverPosition]="pos" [open]="open"></example-popover>
        }
      </div>
      <div style="flex-direction: column; align-items: center; display: flex; gap: 50px">
        @for (pos of positions; track pos) {
          <example-popover [popoverPosition]="pos" [open]="open"></example-popover>
        }
      </div>
      <div style="flex-direction: column; align-items: center; display: flex; gap: 50px">
        @for (pos of positions; track pos) {
          <example-popover [popoverPosition]="pos" [open]="open"></example-popover>
        }
      </div>
    </div>
  `,
  props: args,
});

export const Popover: StoryObj = {
  render: PopoverTemplate,
};
