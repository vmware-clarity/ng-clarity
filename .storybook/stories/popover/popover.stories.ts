/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrPopoverModule, ClrPopoverService } from '@clr/angular';
import { argsToTemplate, moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { StorybookPopoverComponent } from './storybook-popover.component';
import {
  ClrPopoverType,
  SIGNPOST_POSITIONS,
  TOOLTIP_POSITIONS,
} from '../../../projects/angular/src/popover/common/utils/popover-positions';

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
};

const PopoverTemplate: StoryFn = args => ({
  template: `
    <div style="height: 100vh; width: 100%; display: flex; padding: 50px; justify-content: center">
      <storybook-popover ${argsToTemplate(args)}></storybook-popover>
    </div>
  `,
  props: {
    ...args,
    position: args.dropdownPosition || args.tooltipPosition || args.signpostPosition || args.defaultPosition,
  },
});

export const Popover: StoryObj = {
  render: PopoverTemplate,
  argTypes: {
    position: { control: { disable: true }, table: { disable: true } },
    dropdownPosition: {
      name: 'position',
      control: { type: 'select' },
      options: Positions,
      if: { arg: 'type', eq: ClrPopoverType.DROPDOWN },
    },
    tooltipPosition: {
      name: 'position',
      control: { type: 'select' },
      options: TOOLTIP_POSITIONS,
      if: { arg: 'type', eq: ClrPopoverType.TOOLTIP },
    },
    signpostPosition: {
      name: 'position',
      control: { type: 'select' },
      options: SIGNPOST_POSITIONS,
      if: { arg: 'type', eq: ClrPopoverType.SIGNPOST },
    },
    defaultPosition: {
      name: 'position',
      control: { type: 'select' },
      options: SIGNPOST_POSITIONS,
      if: { arg: 'type', eq: ClrPopoverType.DEFAULT },
    },
    type: {
      control: { type: 'select' },
      options: {
        // @ts-ignore
        DEFAULT: ClrPopoverType.DEFAULT,
        DROPDOWN: ClrPopoverType.DROPDOWN,
        SIGNPOST: ClrPopoverType.SIGNPOST,
        TOOLTIP: ClrPopoverType.TOOLTIP,
      },
    },
  },
  args: {
    open: true,
    scrollToClose: false,
    outsideClickToClose: true,
    type: ClrPopoverType.DROPDOWN,
    defaultPosition: 'bottom-right',
    signpostPosition: 'bottom-right',
    tooltipPosition: 'right',
    dropdownPosition: 'bottom-left',
    scrollPositions: ['bottom-left', 'right-bottom', 'top-left'],
  },
};

export const PopoverCustomPositions: StoryObj = {
  render: PopoverTemplate,
  argTypes: {
    useConnectedPosition: { control: { disable: true }, table: { disable: true } },
    originX: {
      control: { type: 'select' },
      options: ['start', 'center', 'end'],
    },
    originY: {
      control: { type: 'select' },
      options: ['top', 'center', 'bottom'],
    },
    overlayX: {
      control: { type: 'select' },
      options: ['start', 'center', 'end'],
    },
    overlayY: {
      control: { type: 'select' },
      options: ['top', 'center', 'bottom'],
    },
  },
  args: {
    open: true,
    scrollToClose: false,
    outsideClickToClose: true,
    useConnectedPosition: true,
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetX: 0,
    offsetY: 0,
  },
};
