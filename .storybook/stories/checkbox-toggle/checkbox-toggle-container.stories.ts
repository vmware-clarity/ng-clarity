/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrCheckboxContainer, ClrCheckboxModule } from '@clr/angular';
import { moduleMetadata, Story, StoryObj } from '@storybook/angular';

import { getSelectors } from '../../helpers/checkbox-toggle.helpers';
import { CommonModules } from '../../helpers/common';

enum CheckboxType {
  Checkbox = 'checkbox',
  Toggle = 'toggle',
}

export default {
  title: 'Checkbox or Toggle/Checkbox or Toggle Container',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrCheckboxModule],
    }),
  ],
  component: ClrCheckboxContainer,
  argTypes: {
    // inputs
    clrInline: { defaultValue: false, control: { type: 'boolean' } },
    // methods
    addGrid: { control: { disable: true }, table: { disable: true } },
    controlClass: { control: { disable: true }, table: { disable: true } },
    // story helpers
    type: {
      defaultValue: CheckboxType.Checkbox,
      control: { type: 'inline-radio', options: CheckboxType },
    },
    createArray: { control: { disable: true }, table: { disable: true } },
    optionCount: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    // story helpers
    label: 'Options',
    createArray: n => new Array(n),
    optionCount: 4,
  },
};

const CheckboxToggleContainerTemplate: Story = args => {
  const { containerSelector, wrapperSelector, directive } = getSelectors(args.type);
  return {
    template: `
      <${containerSelector} [clrInline]="clrInline">
        <label>{{label}}</label>
        <${wrapperSelector} *ngFor="let _ of createArray(optionCount); let i = index">
          <input type="checkbox" ${directive} />
          <label>Option {{i + 1}}</label>
        </${wrapperSelector}>
      </${containerSelector}>
    `,
    props: args,
  };
};

const CheckBoxAllTemplate: Story = args => {
  const { containerSelector, wrapperSelector, directive } = getSelectors(args.type);
  return {
    template: `
      <div style="padding:20px">
        <span cds-text="subsection">Default</span>
        <${containerSelector} [clrInline]="false">
          <label>{{label}}</label>
          <${wrapperSelector} *ngFor="let _ of createArray(optionCount); let i = index">
            <input type="checkbox" ${directive} />
            <label>Option {{i + 1}}</label>
          </${wrapperSelector}>
        </${containerSelector}>
      </div>
      
      <div style="padding:20px">
        <span cds-text="subsection">Inline</span>
        <${containerSelector} [clrInline]="true">
          <label>{{label}}</label>
          <${wrapperSelector} *ngFor="let _ of createArray(optionCount); let i = index">
            <input type="checkbox" ${directive} />
            <label>Option {{i + 1}}</label>
          </${wrapperSelector}>
        </${containerSelector}>
      </div>
      
      <div style="padding:20px">
        <span cds-text="subsection">Helper Text</span>
        <${containerSelector} [clrInline]="false">
          <label>{{label}}</label>
          <${wrapperSelector} *ngFor="let _ of createArray(optionCount); let i = index">
            <input type="checkbox" ${directive} />
            <label>Option {{i + 1}}</label>
          </${wrapperSelector}>
          <clr-control-helper>Helper text</clr-control-helper>
          <clr-control-error>This field is required!</clr-control-error>
        </${containerSelector}>
      </div>
      
      <div *ngIf="type==='toggle'" style="padding:20px">
        <span cds-text="subsection">Right Aligned</span>
        <${containerSelector} [clrInline]="false" class="clr-toggle-right">
          <label>{{label}}</label>
          <${wrapperSelector} *ngFor="let _ of createArray(optionCount); let i = index">
            <input type="checkbox" ${directive} />
            <label>Option {{i + 1}}</label>
          </${wrapperSelector}>
        </${containerSelector}>
      </div>
    `,
    props: args,
  };
};

export const CheckboxOrToggleContainer: StoryObj = {
  render: CheckboxToggleContainerTemplate,
};

export const ShowcaseCheckboxContainer: StoryObj = {
  render: CheckBoxAllTemplate,
  args: { type: CheckboxType.Checkbox },
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};

export const ShowcaseToggleContainer: StoryObj = {
  render: CheckBoxAllTemplate,
  args: { type: CheckboxType.Toggle },
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};
