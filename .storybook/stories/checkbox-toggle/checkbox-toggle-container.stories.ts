/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrCheckboxContainer, ClrCheckboxModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

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
    // methods
    addGrid: { control: { disable: true }, table: { disable: true } },
    controlClass: { control: { disable: true }, table: { disable: true } },
    // story helpers
    type: { control: 'inline-radio', options: CheckboxType },
    createArray: { control: { disable: true }, table: { disable: true } },
    optionCount: { control: { type: 'number', min: 1, max: 100 } },
    values: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // inputs
    clrInline: false,
    // story helpers
    type: CheckboxType.Checkbox,
    label: 'Options',
    createArray: n => new Array(n),
    optionCount: 4,
    values: [],
    disabledIndexes: [],
  },
};

const CheckboxToggleContainerTemplate: StoryFn = args => {
  const { containerSelector, wrapperSelector, directive } = getSelectors(args.type);
  return {
    template: `
      <${containerSelector} [clrInline]="clrInline">
        <label>{{ label }}</label>
        <${wrapperSelector} *ngFor="let _ of createArray(optionCount); let i = index">
          <input type="checkbox" ${directive} [disabled]="disabledIndexes.includes(i)" [(ngModel)]="values[i]" />
          <label>Option {{ i + 1 }}</label>
        </${wrapperSelector}>
      </${containerSelector}>
    `,
    props: args,
  };
};

const CheckBoxAllTemplate: StoryFn = args => {
  const { containerSelector, wrapperSelector, directive } = getSelectors(args.type);
  return {
    template: `
      <div style="padding: 20px">
        <span cds-text="subsection">Default</span>
        <${containerSelector} [clrInline]="false">
          <label>{{ label }}</label>
          <${wrapperSelector} *ngFor="let _ of createArray(optionCount); let i = index">
            <input type="checkbox" ${directive} />
            <label>Option {{ i + 1 }}</label>
          </${wrapperSelector}>
        </${containerSelector}>
      </div>

      <div style="padding: 20px">
        <span cds-text="subsection">Inline</span>
        <${containerSelector} [clrInline]="true">
          <label>{{ label }}</label>
          <${wrapperSelector} *ngFor="let _ of createArray(optionCount); let i = index">
            <input type="checkbox" ${directive} />
            <label>Option {{ i + 1 }}</label>
          </${wrapperSelector}>
        </${containerSelector}>
      </div>

      <div style="padding: 20px">
        <span cds-text="subsection">Helper Text</span>
        <${containerSelector} [clrInline]="false">
          <label>{{ label }}</label>
          <${wrapperSelector} *ngFor="let _ of createArray(optionCount); let i = index">
            <input type="checkbox" ${directive} />
            <label>Option {{ i + 1 }}</label>
          </${wrapperSelector}>
          <clr-control-helper>Helper text</clr-control-helper>
          <clr-control-error>This field is required!</clr-control-error>
        </${containerSelector}>
      </div>

      <div *ngIf="type === 'toggle'" style="padding: 20px">
        <span cds-text="subsection">Right Aligned</span>
        <${containerSelector} [clrInline]="false" class="clr-toggle-right">
          <label>{{ label }}</label>
          <${wrapperSelector} *ngFor="let _ of createArray(optionCount); let i = index">
            <input type="checkbox" ${directive} />
            <label>Option {{ i + 1 }}</label>
          </${wrapperSelector}>
        </${containerSelector}>
      </div>
    `,
    props: args,
  };
};

export const CheckboxContainer: StoryObj = {
  render: CheckboxToggleContainerTemplate,
  args: {
    type: CheckboxType.Checkbox,
  },
};

export const ToggleContainer: StoryObj = {
  render: CheckboxToggleContainerTemplate,
  args: {
    type: CheckboxType.Toggle,
  },
};

export const CheckboxContainerDisabled: StoryObj = {
  render: CheckboxToggleContainerTemplate,
  args: {
    type: CheckboxType.Checkbox,
    optionCount: 4,
    disabledIndexes: [0, 1, 2, 3],
  },
};

export const ToggleContainerDisabled: StoryObj = {
  render: CheckboxToggleContainerTemplate,
  args: {
    type: CheckboxType.Toggle,
    optionCount: 4,
    disabledIndexes: [0, 1, 2, 3],
  },
};

export const CheckboxContainerPartiallyDisabled: StoryObj = {
  render: CheckboxToggleContainerTemplate,
  args: {
    type: CheckboxType.Checkbox,
    optionCount: 4,
    disabledIndexes: [0, 2],
  },
};

export const ToggleContainerPartiallyDisabled: StoryObj = {
  render: CheckboxToggleContainerTemplate,
  args: {
    type: CheckboxType.Toggle,
    optionCount: 4,
    disabledIndexes: [0, 2],
  },
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
