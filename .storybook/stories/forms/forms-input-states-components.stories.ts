/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrFormLayout, ClrFormsModule, ClrLayoutModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

import { FormsStoryComponent } from './forms-input-states-components.storybook.component';

/**
 * The stories render `<forms-input-states-components>` through `component:`, and every arg -- `clrLayout`,
 * `isDisabled`, `isError`, `isSuccess`, `isFullWidth`, `isReadonly` -- is one of its own `@Input()`s under
 * that exact name, so the story component is the args type.
 */
type FormsInputStatesComponentsArgs = FormsStoryComponent;

const meta: Meta<FormsInputStatesComponentsArgs> = {
  title: 'Forms/Input States (Using Components)',
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
    isFullWidth: false,
  },
};

export default meta;

type Story = StoryObj<FormsInputStatesComponentsArgs>;

export const InputStates: Story = {};

export const VerticalInputStates: Story = {
  args: { clrLayout: ClrFormLayout.VERTICAL },
};

export const CompactInputStates: Story = {
  args: { clrLayout: ClrFormLayout.COMPACT },
};

export const FullWidthInputStates: Story = {
  args: { isFullWidth: true },
};

export const VerticaFullWidthInputStates: Story = {
  args: { clrLayout: ClrFormLayout.VERTICAL, isFullWidth: true },
};

export const CompactFullWidthInputStates: Story = {
  args: { clrLayout: ClrFormLayout.COMPACT, isFullWidth: true },
};

export const DisabledStates: Story = {
  args: { isDisabled: true },
};
export const ReadonlyStates: Story = {
  args: { isReadonly: true },
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

export const FullWidthErrorStates: Story = {
  args: { isError: true, isFullWidth: true },
};

export const VerticalFullWidthErrorStates: Story = {
  args: { isError: true, clrLayout: ClrFormLayout.VERTICAL, isFullWidth: true },
};

export const CompactFullWidthErrorStates: Story = {
  args: { isError: true, clrLayout: ClrFormLayout.COMPACT, isFullWidth: true },
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

export const FullWidthSuccessStates: Story = {
  args: { isSuccess: true, isFullWidth: true },
};

export const FullWidthVerticalSuccessStates: Story = {
  args: { isSuccess: true, clrLayout: ClrFormLayout.VERTICAL, isFullWidth: true },
};

export const FullWidthCompactSuccessStates: Story = {
  args: { isSuccess: true, clrLayout: ClrFormLayout.COMPACT, isFullWidth: true },
};
