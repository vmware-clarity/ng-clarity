/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrCheckboxContainer, ClrCheckboxModule } from '@clr/angular';
import { argsToTemplate, moduleMetadata, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';
import { CheckboxToggleStorybookComponent } from './checkbox-toggle.storybook.component';

enum CheckboxType {
  Checkbox = 'checkbox',
  Toggle = 'toggle',
}

export default {
  title: 'Checkbox or Toggle/Checkbox or Toggle Container',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrCheckboxModule, CheckboxToggleStorybookComponent],
    }),
  ],
  component: ClrCheckboxContainer,
  argTypes: {
    // methods
    addGrid: { control: { disable: true }, table: { disable: true } },
    controlClass: { control: { disable: true }, table: { disable: true } },
    // story helpers
    type: { control: 'inline-radio', options: CheckboxType },
    createArray: { control: { disable: true }, table: { disable: true } },
    optionCount: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    // inputs
    clrInline: false,
    // story helpers
    type: CheckboxType.Checkbox,
    containerLabel: 'Options',
    createArray: n => new Array(n),
    optionCount: 4,
    disabledIndexes: [],
  },
  render: (args: CheckboxToggleStorybookComponent) => ({
    props: {
      ...args,
    },
    template: `
      <storybook-checkbox-toggle ${argsToTemplate(args)}></storybook-checkbox-toggle>
    `,
  }),
};

export const CheckboxContainer: StoryObj = {
  args: {
    type: CheckboxType.Checkbox,
  },
};

export const CheckboxContainerHelperText: StoryObj = {
  args: {
    type: CheckboxType.Checkbox,
    showHelperText: true,
  },
};

export const ToggleContainer: StoryObj = {
  args: {
    type: CheckboxType.Toggle,
  },
};

export const CheckboxContainerDisabled: StoryObj = {
  args: {
    type: CheckboxType.Checkbox,
    disabledIndexes: [0, 1, 2, 3],
  },
};

export const ToggleContainerDisabled: StoryObj = {
  args: {
    type: CheckboxType.Toggle,
    disabledIndexes: [0, 1, 2, 3],
  },
};

export const CheckboxContainerPartiallyDisabled: StoryObj = {
  args: {
    type: CheckboxType.Checkbox,
    disabledIndexes: [0, 2],
  },
};

export const ToggleContainerPartiallyDisabled: StoryObj = {
  args: {
    type: CheckboxType.Toggle,
    disabledIndexes: [0, 2],
  },
};

export const CheckboxContainerInline: StoryObj = {
  args: { type: CheckboxType.Checkbox, clrInline: true },
};

export const CheckboxContainerInlineHelperText: StoryObj = {
  args: { type: CheckboxType.Checkbox, clrInline: true, showHelperText: true },
};

export const ToggleContainerInline: StoryObj = {
  args: { type: CheckboxType.Toggle, clrInline: true },
};

export const ToggleContainerRightAligned: StoryObj = {
  args: { type: CheckboxType.Toggle, rightAligned: true },
};

export const ToggleContainerRightAlignedHelperText: StoryObj = {
  args: { type: CheckboxType.Toggle, rightAligned: true, showHelperText: true },
};
