/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrPopoverModule, ClrPopoverService } from '@clr/angular';
import { argsToTemplate, moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { StorybookPopoverComponent } from './storybook-popover.component';
import { ClrPopoverType } from '../../../projects/angular/src/popover/common/utils/popover-positions';

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
  component: StorybookPopoverComponent,
  decorators: [
    moduleMetadata({
      imports: [ClrPopoverModule],
    }),
  ],
  providers: [ClrPopoverService],
  argTypes: {
    useConnectedPosition: { control: { type: 'boolean' } },
    positions: { control: { disable: true }, table: { disable: true } },
    originX: {
      control: { type: 'radio' },
      options: ['start', 'center', 'end'],
      if: { arg: 'useConnectedPosition', eq: true },
    },
    originY: {
      control: { type: 'radio' },
      options: ['top', 'center', 'bottom'],
      if: { arg: 'useConnectedPosition', eq: true },
    },
    overlayX: {
      control: { type: 'radio' },
      options: ['start', 'center', 'end'],
      if: { arg: 'useConnectedPosition', eq: true },
    },
    overlayY: {
      control: { type: 'radio' },
      options: ['top', 'center', 'bottom'],
      if: { arg: 'useConnectedPosition', eq: true },
    },
    position: {
      control: { type: 'radio' },
      options: Positions,
      if: { arg: 'useConnectedPosition', eq: false },
    },
    type: { control: { type: 'radio' }, options: ClrPopoverType },
  },
  args: {
    position: 'bottom-right',
    useConnectedPosition: false,
    type: ClrPopoverType.DEFAULT,
    open: true,
    scrollToClose: false,
    outsideClickToClose: true,
    offsetX: 0,
    offsetY: 0,
  },
};

const PopoverTemplate: StoryFn = args => ({
  template: `
    <div style="height: 100vh; width: 100%; display: flex; padding: 50px; justify-content: center">
      <storybook-popover ${argsToTemplate(args)}></storybook-popover>
    </div>
  `,
  props: args,
});

export const Popover: StoryObj = {
  render: PopoverTemplate,
};

export const PopoverCustomPositions: StoryObj = {
  render: PopoverTemplate,
  args: {
    useConnectedPosition: true,
    position: '',
    originX: 'end',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
  },
};
