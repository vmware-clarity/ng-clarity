/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrPopoverModule } from '@clr/angular';
import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';

import { StorybookPopoverComponent } from './popover.storybook.component';
import {
  ClrPopoverPosition,
  ClrPopoverType,
  SIGNPOST_POSITIONS,
  TOOLTIP_POSITIONS,
} from '../../../../../projects/angular/popover/common/utils/popover-positions';

/**
 * The args drive `<storybook-popover>`, so the args type is that wrapper. Its positions input is aliased
 * (`@Input('scrollPositions') availablePositionKeys`), so the alias is added explicitly.
 */
type PopoverArgs = StorybookPopoverComponent & {
  scrollPositions: ClrPopoverPosition[];
};

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

const meta: Meta<PopoverArgs> = {
  title: 'Components/Overlays/Popover',
  component: StorybookPopoverComponent,
  decorators: [
    moduleMetadata({
      imports: [ClrPopoverModule],
    }),
  ],
  render: args => ({
    template: `
      <div style="height: 100vh; width: 100%; display: flex; padding: 50px; justify-content: center">
        <storybook-popover ${argsToTemplate(args)}></storybook-popover>
      </div>
    `,
    props: {
      ...args,
      position: args.dropdownPosition || args.tooltipPosition || args.signpostPosition || args.defaultPosition,
    },
  }),
};

export default meta;

type Story = StoryObj<PopoverArgs>;

export const Popover: Story = {
  argTypes: {
    ...hideControls('position'),
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
    // `ClrPopoverType` is a numeric enum, so the option labels are supplied through `mapping` to keep the
    // readable names the previous object-shaped `options` produced.
    type: {
      control: { type: 'select' },
      options: ['DEFAULT', 'DROPDOWN', 'SIGNPOST', 'TOOLTIP'],
      mapping: {
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
    showCloseButton: true,
    type: ClrPopoverType.DROPDOWN,
    defaultPosition: ClrPopoverPosition.BOTTOM_RIGHT,
    signpostPosition: ClrPopoverPosition.BOTTOM_RIGHT,
    tooltipPosition: ClrPopoverPosition.RIGHT,
    dropdownPosition: ClrPopoverPosition.BOTTOM_LEFT,
    scrollPositions: [ClrPopoverPosition.BOTTOM_LEFT, ClrPopoverPosition.RIGHT_BOTTOM, ClrPopoverPosition.TOP_LEFT],
  },
};

export const PopoverCustomPositions: Story = {
  argTypes: {
    ...hideControls('useConnectedPosition'),
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
