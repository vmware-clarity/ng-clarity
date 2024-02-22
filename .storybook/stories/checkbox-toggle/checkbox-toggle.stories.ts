/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrCheckbox, ClrCheckboxModule } from '@clr/angular';
import { moduleMetadata, Story, StoryObj } from '@storybook/angular';
import { CommonModules } from 'helpers/common';

enum CheckboxType {
  Checkbox = 'checkbox',
  Toggle = 'toggle',
}

export default {
  title: 'Checkbox or Toggle/Checkbox or Toggle',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrCheckboxModule],
    }),
  ],
  component: ClrCheckbox,
  argTypes: {
    // inputs
    id: { defaultValue: '' },
    // methods
    getProviderFromContainer: { control: { disable: true }, table: { disable: true } },
    triggerValidation: { control: { disable: true }, table: { disable: true } },
    // story helpers
    type: {
      defaultValue: CheckboxType.Checkbox,
      control: { type: 'inline-radio', options: CheckboxType },
    },
  },
  args: {
    // story helpers
    label: 'Option',
    checked: false,
    disabled: false,
  },
};

const CheckBoxToggleTemplate: Story = args => {
  const containerSelector = args.type === CheckboxType.Checkbox ? 'clr-checkbox-container' : 'clr-toggle-container';
  const wrapperSelector = args.type === CheckboxType.Checkbox ? 'clr-checkbox-wrapper' : 'clr-toggle-wrapper';
  const directive = args.type === CheckboxType.Checkbox ? 'clrCheckbox' : 'clrToggle';

  return {
    template: `
      <${containerSelector}> <!-- The container is required in this story so that the disabled state works correctly. -->
        <${wrapperSelector}>
          <input type="checkbox" ${directive} [ngModel]="checked" [disabled]="disabled" />
          <label>{{label}}</label>
        </${wrapperSelector}>
      </${containerSelector}>
    `,
    props: args,
  };
};

const CheckBoxTemplate: Story = args => {
  const containerSelector = args.type === CheckboxType.Checkbox ? 'clr-checkbox-container' : 'clr-toggle-container';
  const wrapperSelector = args.type === CheckboxType.Checkbox ? 'clr-checkbox-wrapper' : 'clr-toggle-wrapper';
  const directive = args.type === CheckboxType.Checkbox ? 'clrCheckbox' : 'clrToggle';

  return {
    template: `
    <h6>Enabled</h6>
    <${containerSelector}>
      <${wrapperSelector}>
        <input type="checkbox" ${directive} value="option1" name="options" [ngModel]="checked"/>
        <label>Option 1</label>
      </${wrapperSelector}>
    </${containerSelector}>

    <${containerSelector}>
      <${wrapperSelector}>
        <input type="checkbox" ${directive} value="option1" name="options"/>
        <label>Option 1</label>
      </${wrapperSelector}>
    </${containerSelector}>

    <h6>Disabled</h6>
    <${containerSelector}>
      <${wrapperSelector}>
        <input type="checkbox" ${directive} value="option1" name="options" [ngModel]="checked" [disabled]=disabled/>
        <label>Option 1</label>
      </${wrapperSelector}>
    </${containerSelector}>

    <${containerSelector}>
      <${wrapperSelector}>
        <input type="checkbox" ${directive} value="option1" name="options" [disabled]=disabled/>
        <label>Option 1</label>
      </${wrapperSelector}>
    </${containerSelector}>
    `,
    props: args,
  };
};

export const CheckboxOrToggle: StoryObj = {
  render: CheckBoxToggleTemplate,
};

export const ShowcaseCheckbox: StoryObj = {
  render: CheckBoxTemplate,
  args: { checked: true, disabled: true, type: CheckboxType.Checkbox },
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};

export const ShowcaseToggleSwitch: StoryObj = {
  render: CheckBoxTemplate,
  args: { checked: true, disabled: true, type: CheckboxType.Toggle },
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};
