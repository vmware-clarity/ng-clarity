/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
import { argsToTemplate, moduleMetadata, StoryObj } from '@storybook/angular';
import { CommonModules } from 'helpers/common';

import { BUTTON_STYLES, BUTTON_TYPES } from '../../helpers/button-class.helper';
import { ButtonGroupStorybookComponent } from './button-group.storybook.component';

export default {
  title: 'Button/Button Group',
  component: ClrButtonGroup,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrButtonGroupModule, ClrLoadingModule, ButtonGroupStorybookComponent],
    }),
  ],
  argTypes: {
    // inputs
    clrMenuPosition: { control: 'radio', options: CLR_MENU_POSITIONS },
    // methods
    getMoveIndex: { control: { disable: true }, table: { disable: true } },
    initializeButtons: { control: { disable: true }, table: { disable: true } },
    rearrangeButton: { control: { disable: true }, table: { disable: true } },
    buttonCount: { control: { type: 'number', min: 1, max: 100 } },
    inMenuButtonCount: { control: { type: 'number', min: 1, max: 100 } },
    disabledButtonsPosition: {
      description: 'Enter JSON array (e.g. `[2,3]`)',
      control: { type: 'array' },
    },
    buttonStyle: { control: 'radio', options: BUTTON_STYLES },
    buttonType: { control: 'radio', options: BUTTON_TYPES },
    templateMode: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    clrMenuPosition: 'bottom-left',
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
  render: (args: ButtonGroupStorybookComponent) => ({
    props: {
      ...args,
    },
    template: `
      <storybook-button-group ${argsToTemplate(args)}></storybook-button-group>
    `,
  }),
};

export const ButtonGroup: StoryObj = {};

export const ButtonGroupShowcase: StoryObj = {
  args: {
    templateMode: 'showcase',
  },
};

export const ButtonGroupLoading: StoryObj = {
  args: {
    inMenuButtonCount: 0,
    loading: true,
  },
};

export const DisabledButtons: StoryObj = {
  args: {
    disabledButtonsPosition: [1, 2],
  },
};

export const ButtonGroupOverflow: StoryObj = {
  args: {
    clrMenuPosition: 'top-left',
  },
  play({ canvasElement }) {
    (canvasElement.querySelector('.dropdown-toggle') as HTMLElement)?.click();
  },
};
