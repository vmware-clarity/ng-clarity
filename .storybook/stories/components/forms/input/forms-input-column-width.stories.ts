/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrFormLayout, ClrFormsModule, ClrLayoutModule } from '@clr/angular';
import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

import { FormsStoryComponent } from './forms-input-column-width.storybook.component';

/**
 * The args drive `<forms-input-states-components>`, so the args type is that component: `clrLayout`,
 * `isDisabled`, `isError` and `isSuccess` are its own `@Input()`s, declared under those exact names. The
 * Clarity form directives are never bound directly, so their aliased inputs never enter the picture.
 */
type FormsInputColumnWidthArgs = FormsStoryComponent;

const meta: Meta<FormsInputColumnWidthArgs> = {
  title: 'Forms/Input Column Widths',
  component: FormsStoryComponent,
  decorators: [
    moduleMetadata({
      declarations: [FormsStoryComponent],
      imports: [...CommonModules, ClrLayoutModule, ClrFormsModule],
    }),
  ],
  argTypes: {
    ...hideControls('getProviderFromContainer', 'triggerValidation'),
    clrLayout: {
      control: { type: 'radio' },
      options: Object.values(ClrFormLayout).filter(value => typeof value === 'string'),
    },
  },
  args: {
    clrLayout: ClrFormLayout.HORIZONTAL,
    isDisabled: false,
    isError: false,
    isSuccess: false,
  },
  render: args => ({
    props: {
      ...args,
    },
    template: `
      <forms-input-states-components ${argsToTemplate(args)}></forms-input-states-components>
    `,
  }),
};

export default meta;

type Story = StoryObj<FormsInputColumnWidthArgs>;

export const InputStates: Story = {};

export const VerticalInputStates: Story = {
  args: { clrLayout: ClrFormLayout.VERTICAL },
};

export const CompactInputStates: Story = {
  args: { clrLayout: ClrFormLayout.COMPACT },
};

export const DisabledStates: Story = {
  args: { isDisabled: true },
};

export const ErrorStates: Story = {
  args: { isError: true },
};
export const VerticalErrorStates: Story = {
  args: { isError: true, clrLayout: ClrFormLayout.VERTICAL },
};
export const CompactErrorStates: Story = {
  args: { isError: true, clrLayout: ClrFormLayout.COMPACT },
};

export const SuccessStates: Story = {
  args: { isSuccess: true },
};
export const VerticalSuccessStates: Story = {
  args: { isSuccess: true, clrLayout: ClrFormLayout.VERTICAL },
};
export const CompactSuccessStates: Story = {
  args: { isSuccess: true, clrLayout: ClrFormLayout.COMPACT },
};
