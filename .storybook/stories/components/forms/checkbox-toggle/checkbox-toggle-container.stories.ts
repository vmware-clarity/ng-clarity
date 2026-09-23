/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrCheckboxContainer, ClrCheckboxModule } from '@clr/angular';
import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

import { CheckboxToggleStorybookComponent } from './checkbox-toggle.storybook.component';

/**
 * The args drive `<storybook-checkbox-toggle>`, so the args type is that wrapper.
 * `ClrCheckboxContainer` only supplies the docs table through `component:`.
 */
type CheckboxToggleContainerArgs = CheckboxToggleStorybookComponent;

enum CheckboxType {
  Checkbox = 'checkbox',
  Toggle = 'toggle',
}

const meta: Meta<CheckboxToggleContainerArgs> = {
  title: 'Components/Forms/Checkbox or Toggle/Container',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrCheckboxModule, CheckboxToggleStorybookComponent],
    }),
  ],
  component: ClrCheckboxContainer,
  argTypes: {
    // methods
    ...hideControls('addGrid', 'controlClass'),
    // story helpers
    type: { control: { type: 'inline-radio' }, options: Object.values(CheckboxType) },
    optionCount: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    // inputs
    clrInline: false,
    // story helpers
    type: CheckboxType.Checkbox,
    containerLabel: 'Options',
    optionCount: 4,
    disabledIndexes: [],
  },
  render: args => ({
    props: {
      ...args,
    },
    template: `
      <storybook-checkbox-toggle ${argsToTemplate(args)}></storybook-checkbox-toggle>
    `,
  }),
};

export default meta;

type Story = StoryObj<CheckboxToggleContainerArgs>;

export const CheckboxContainer: Story = {
  args: {
    type: CheckboxType.Checkbox,
  },
};

export const CheckboxContainerHelperText: Story = {
  args: {
    type: CheckboxType.Checkbox,
    showHelperText: true,
  },
};

export const ToggleContainer: Story = {
  args: {
    type: CheckboxType.Toggle,
  },
};

export const CheckboxContainerDisabled: Story = {
  args: {
    type: CheckboxType.Checkbox,
    disabledIndexes: [0, 1, 2, 3],
  },
};

export const ToggleContainerDisabled: Story = {
  args: {
    type: CheckboxType.Toggle,
    disabledIndexes: [0, 1, 2, 3],
  },
};

export const CheckboxContainerPartiallyDisabled: Story = {
  args: {
    type: CheckboxType.Checkbox,
    disabledIndexes: [0, 2],
  },
};

export const ToggleContainerPartiallyDisabled: Story = {
  args: {
    type: CheckboxType.Toggle,
    disabledIndexes: [0, 2],
  },
};

export const CheckboxContainerInline: Story = {
  args: { type: CheckboxType.Checkbox, clrInline: true },
};

export const CheckboxContainerInlineHelperText: Story = {
  args: { type: CheckboxType.Checkbox, clrInline: true, showHelperText: true },
};

export const ToggleContainerInline: Story = {
  args: { type: CheckboxType.Toggle, clrInline: true },
};

export const ToggleContainerRightAligned: Story = {
  args: { type: CheckboxType.Toggle, rightAligned: true },
};

export const ToggleContainerRightAlignedHelperText: Story = {
  args: { type: CheckboxType.Toggle, rightAligned: true, showHelperText: true },
};
