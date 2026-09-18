/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrRadio, ClrRadioModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

/**
 * The template binds a plain `<input clrRadio>` inside a wrapper rather than `ClrRadio` itself, so the args
 * are the story-only props the template reads. `ClrRadio` only supplies the docs table through `component:`.
 */
type RadioArgs = {
  id: string;
  label: string;
  disabled: boolean;
  checked: boolean;
};

const meta: Meta<RadioArgs> = {
  title: 'Components/Forms/Radio',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrRadioModule],
    }),
  ],
  component: ClrRadio,
  argTypes: {
    // methods
    ...hideControls('getProviderFromContainer', 'triggerValidation'),
  },
  args: {
    // id
    id: '',
    // story helpers
    label: 'Option',
    disabled: false,
    checked: false,
  },
  render: args => ({
    template: `
      <clr-radio-wrapper>
        <input type="radio" clrRadio value="i + 1" [checked]="checked" [disabled]="disabled" />
        <label>{{ label }}</label>
      </clr-radio-wrapper>
    `,
    props: { ...args },
  }),
};

export default meta;

type Story = StoryObj<RadioArgs>;

export const Radio: Story = {};

export const RadioLongLabel: Story = {
  args: {
    label:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const DisabledAndChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};
