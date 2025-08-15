/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrCheckbox, ClrCheckboxModule } from '@clr/angular';
import { argsToTemplate, moduleMetadata, StoryObj } from '@storybook/angular';
import { CommonModules } from 'helpers/common';

import { CheckboxToggleStorybookComponent, CheckboxType } from './checkbox-toggle.storybook.component';

export default {
  title: 'Checkbox or Toggle/Checkbox or Toggle',
  component: ClrCheckbox,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrCheckboxModule, CheckboxToggleStorybookComponent],
    }),
  ],
  argTypes: {
    // The original story hid these methods.
    getProviderFromContainer: { control: { disable: true }, table: { disable: true } },
    triggerValidation: { control: { disable: true }, table: { disable: true } },
    type: { control: 'inline-radio', options: CheckboxType },
    templateMode: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    id: '',
    type: CheckboxType.Checkbox,
    label: 'Option',
    checked: false,
    disabled: false,
    templateMode: 'single',
  },
  render: (args: CheckboxToggleStorybookComponent) => ({
    props: {
      ...args,
    },
    template: `
      <storybook-checkbox-toggle templateMode="loading" ${argsToTemplate(args)}></storybook-checkbox-toggle>
    `,
  }),
};

export const CheckboxOrToggle: StoryObj = {
  args: {
    templateMode: 'single',
  },
};

export const CheckboxLongLabel: StoryObj = {
  args: {
    type: CheckboxType.Checkbox,
    templateMode: 'single',
    label:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
};

export const ToggleLongLabel: StoryObj = {
  args: {
    type: CheckboxType.Toggle,
    templateMode: 'single',
    label:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
};

export const ShowcaseCheckbox: StoryObj = {
  args: {
    type: CheckboxType.Checkbox,
    templateMode: 'showcase',
  },
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};

export const ShowcaseToggleSwitch: StoryObj = {
  args: {
    type: CheckboxType.Toggle,
    templateMode: 'showcase',
  },
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};
