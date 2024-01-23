/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrPopoverEventsService, ClrPopoverToggleService, ÇlrClrPopoverModuleNext } from '@clr/angular';
import { moduleMetadata, Story } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';
import { ExamplePopoverComponent } from './example-popover.component';

const Positions: any = [
  'top-right',
  'top-left',
  'bottom-right',
  'bottom-left',
  'right-top',
  'right-bottom',
  'left-top',
  'left-bottom',
];

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default {
  title: 'Popover/PopoverNext',
  component: ExamplePopoverComponent,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ÇlrClrPopoverModuleNext],
    }),
  ],
  providers: [ClrPopoverEventsService, ClrPopoverToggleService],
  argTypes: {
    positions: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    positions: Positions,
    open: true,
  },
};

const template = `
    <div style="height: 100vh; width: 100%; display: flex; justify-content: center; flex-direction: column; align-items: center; gap: 50px;">
      <ng-container *ngFor="let pos of positions">
        <example-popover [popoverPosition]="pos" [open]="open"></example-popover>
      </ng-container>
    </div>
  `;

export const Initial: Story = args => ({
  template,
  props: args,
});
