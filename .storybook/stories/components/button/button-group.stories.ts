/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  CLR_MENU_POSITIONS,
  ClrButtonGroup,
  ClrButtonGroupModule,
  ClrLoadingModule,
  commonStringsDefault,
} from '@clr/angular';
import { ClrPopoverPosition } from '@clr/angular/popover/common';
import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { BUTTON_STYLES, BUTTON_TYPES } from '@storybook-helpers/button-class.helper';
import { CommonModules } from '@storybook-helpers/common';

import { ButtonGroupStorybookComponent } from './button-group.storybook.component';

/**
 * The args drive `<storybook-button-group>`, so the args type is that component. The three
 * `ClrButtonGroup` methods are picked from the class: they appear in `argTypes` only to quieten the
 * controls table generated from `component: ClrButtonGroup`.
 */
type ButtonGroupArgs = ButtonGroupStorybookComponent &
  Pick<ClrButtonGroup, 'getMoveIndex' | 'initializeButtons' | 'rearrangeButton'>;

const meta: Meta<ButtonGroupArgs> = {
  title: 'Components/Button/Group',
  component: ClrButtonGroup,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrButtonGroupModule, ClrLoadingModule, ButtonGroupStorybookComponent],
    }),
  ],
  argTypes: {
    // inputs
    clrMenuPosition: { control: { type: 'radio' }, options: CLR_MENU_POSITIONS },
    // methods
    ...hideControls('getMoveIndex', 'initializeButtons', 'rearrangeButton'),
    buttonCount: { control: { type: 'number', min: 1, max: 100 } },
    inMenuButtonCount: { control: { type: 'number', min: 1, max: 100 } },
    disabledButtonsPosition: {
      description: 'Enter JSON array (e.g. `[2,3]`)',
      // 'array' was dropped from the public ControlType union; it is still an alias of 'object' at
      // runtime (both resolve to ObjectControl), so this renders exactly the same control.
      control: { type: 'object' },
    },
    buttonStyle: { control: { type: 'radio' }, options: BUTTON_STYLES },
    buttonType: { control: { type: 'radio' }, options: BUTTON_TYPES },
    ...hideControls('templateMode'),
  },
  args: {
    clrMenuPosition: ClrPopoverPosition.BOTTOM_LEFT,
    loading: false,
    clrToggleButtonAriaLabel: commonStringsDefault.rowActions,
    buttonCount: 3,
    inMenuButtonCount: 3,
    disabledButtonsPosition: [],
    content: 'Hello World!',
    buttonType: 'primary',
    buttonStyle: 'outline',
    templateMode: 'default', // Default template mode
  },
  render: args => ({
    props: {
      ...args,
    },
    template: `
      <storybook-button-group style="margin-top: 100px; display: block" ${argsToTemplate(args)}></storybook-button-group>
    `,
  }),
};

export default meta;

type Story = StoryObj<ButtonGroupArgs>;

export const ButtonGroup: Story = {};

export const ButtonGroupShowcase: Story = {
  args: {
    templateMode: 'showcase',
  },
};

export const ButtonGroupLoading: Story = {
  args: {
    inMenuButtonCount: 0,
    loading: true,
  },
};

export const DisabledButtons: Story = {
  args: {
    disabledButtonsPosition: [1, 2],
  },
};

export const ButtonGroupOverflow: Story = {
  args: {
    clrMenuPosition: ClrPopoverPosition.TOP_LEFT,
  },
  play({ canvasElement }) {
    (canvasElement.querySelector('.dropdown-toggle') as HTMLElement)?.click();
  },
};
