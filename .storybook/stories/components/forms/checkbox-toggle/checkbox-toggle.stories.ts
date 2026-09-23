/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrCheckbox, ClrCheckboxModule } from '@clr/angular';
import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

import { CheckboxToggleStorybookComponent, CheckboxType } from './checkbox-toggle.storybook.component';

/**
 * The args drive `<storybook-checkbox-toggle>`, so the args type is that wrapper. `ClrCheckbox` only
 * supplies the docs table through `component:`; its methods are hidden through the untyped
 * `hideControls()` spread and so need no place in the args type.
 */
type CheckboxToggleArgs = CheckboxToggleStorybookComponent;

const meta: Meta<CheckboxToggleArgs> = {
  title: 'Components/Forms/Checkbox or Toggle',
  component: ClrCheckbox,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrCheckboxModule, CheckboxToggleStorybookComponent],
    }),
  ],
  argTypes: {
    // The original story hid these methods.
    ...hideControls('getProviderFromContainer', 'triggerValidation'),
    type: { control: { type: 'inline-radio' }, options: Object.values(CheckboxType) },
    ...hideControls('templateMode'),
  },
  args: {
    id: '',
    type: CheckboxType.Checkbox,
    label: 'Option',
    checked: false,
    disabled: false,
    templateMode: 'single',
  },
  render: args => ({
    props: {
      ...args,
    },
    template: `
      <storybook-checkbox-toggle templateMode="loading" ${argsToTemplate(args)}></storybook-checkbox-toggle>
    `,
  }),
};

export default meta;

type Story = StoryObj<CheckboxToggleArgs>;

export const CheckboxOrToggle: Story = {
  args: {
    templateMode: 'single',
  },
};

export const CheckboxLongLabel: Story = {
  args: {
    type: CheckboxType.Checkbox,
    templateMode: 'single',
    label:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
};

export const ToggleLongLabel: Story = {
  args: {
    type: CheckboxType.Toggle,
    templateMode: 'single',
    label:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
};

export const ShowcaseCheckbox: Story = {
  args: {
    type: CheckboxType.Checkbox,
    templateMode: 'showcase',
  },
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};

export const ShowcaseToggleSwitch: Story = {
  args: {
    type: CheckboxType.Toggle,
    templateMode: 'showcase',
  },
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};
