/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrCombobox, ClrComboboxModule, ClrLoadingModule } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';
import { elements } from '../../helpers/elements.data';

export default {
  title: 'Combobox/Combobox',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrComboboxModule, ClrLoadingModule],
    }),
  ],
  component: ClrCombobox,
  argTypes: {
    // outputs
    clrInputChange: { control: { disable: true } },
    clrOpenChange: { control: { disable: true } },
    clrSelectionChange: { control: { disable: true } },
    // methods
    focusFirstActive: { control: { disable: true }, table: { disable: true } },
    focusInput: { control: { disable: true }, table: { disable: true } },
    getActiveDescendant: { control: { disable: true }, table: { disable: true } },
    getSelectionAriaLabel: { control: { disable: true }, table: { disable: true } },
    inputId: { control: { disable: true }, table: { disable: true } },
    loadingStateChange: { control: { disable: true }, table: { disable: true } },
    onBlur: { control: { disable: true }, table: { disable: true } },
    onFocus: { control: { disable: true }, table: { disable: true } },
    onKeyUp: { control: { disable: true }, table: { disable: true } },
    registerOnChange: { control: { disable: true }, table: { disable: true } },
    registerOnTouched: { control: { disable: true }, table: { disable: true } },
    setDisabledState: { control: { disable: true }, table: { disable: true } },
    unselect: { control: { disable: true }, table: { disable: true } },
    writeValue: { control: { disable: true }, table: { disable: true } },
    getProviderFromContainer: { control: { disable: true }, table: { disable: true } },
    triggerValidation: { control: { disable: true }, table: { disable: true } },
    // story helpers
    elements: { control: { disable: true }, table: { disable: true } },
    optionGroups: { control: { disable: true }, table: { disable: true } },
    optionCount: { control: { type: 'number', min: 1, max: elements.length } },
    updateOn: { control: 'radio', options: ['change', 'blur', 'submit'] },
  },
  args: {
    // inputs
    clrMulti: false,
    placeholder: 'Placeholder text',
    id: '',
    // outputs
    clrInputChange: action('clrInputChange'),
    clrOpenChange: action('clrOpenChange'),
    clrSelectionChange: action('clrSelectionChange'),
    // story helpers
    optionCount: elements.length,
    content: 'Option',
    controlDisabled: false,
    controlRequired: false,
    controlHelper: false,
    clrLoading: false,
    updateOn: 'change',
    elements,
    singleModel: 'Am',
    multiModel: ['Am', 'As', 'Ba'],
    label: 'Combobox',
    optionGroups: [...elements]
      .sort((a, b) => a.number - b.number)
      .reduce<{ groupName: string; options: string[] }[]>((groups, element) => {
        const x = Math.floor(element.number / 10);
        const groupName = `Elements ${x * 10} to ${x * 10 + 9}`;
        let group = groups.find(group => group.groupName === groupName);

        if (!group) {
          group = { groupName, options: [] };
          groups.push(group);
        }

        group.options.push(`${element.name} (#${element.number})`);

        return groups;
      }, []),
  },
};

const ComboboxTemplate: StoryFn = args => ({
  template: `
    <clr-combobox-container>
      <label>Options:</label>
      <clr-combobox [clrMulti]="clrMulti">
        <ng-container *clrOptionSelected="let selected">
          {{selected}}
        </ng-container>
        <clr-options>
          <clr-option-group
            *ngFor="let optionGroup of optionGroups"
            [clrOptionGroupLabel]="optionGroup.groupName"
          >
            <clr-option
              *clrOptionItems="let option of optionGroup.options"
              [clrValue]="option"
            >
              {{option}}
            </clr-option>
          </clr-option-group>
        </clr-options>
      </clr-combobox>
    </clr-combobox-container>
  `,
  props: { ...args },
});

export const SingleSelection: StoryObj = {
  render: ComboboxTemplate,
};

export const SingleSelection_Preselected: StoryObj = {
  render: ComboboxTemplate,
  args: {
    singleModel: 'Ba',
  },
};

export const SingleSelectionDisabled: StoryObj = {
  render: ComboboxTemplate,
  args: {
    singleModel: 'Ba',
    controlDisabled: true,
  },
};

export const MultiSelection: StoryObj = {
  render: ComboboxTemplate,
  args: {
    clrMulti: true,
  },
};

export const MultiSelection_MultiLine: StoryObj = {
  render: ComboboxTemplate,
  args: {
    clrMulti: true,
    multiModel: elements.map(element => element.symbol), // all elements
  },
};

export const MultiSelectionDisabled: StoryObj = {
  render: ComboboxTemplate,
  args: {
    clrMulti: true,
    controlDisabled: true,
  },
};

export const SingleSelectionRequired: StoryObj = {
  render: ComboboxTemplate,
  args: {
    singleModel: '',
    controlHelper: true,
    controlRequired: true,
  },
};

export const MultiSelectionRequired: StoryObj = {
  render: ComboboxTemplate,
  args: {
    multiModel: [],
    clrMulti: true,
    controlHelper: true,
    controlRequired: true,
  },
};

export const Loading: StoryObj = {
  render: ComboboxTemplate,
  args: {
    clrLoading: true,
    elements: [],
  },
  play({ canvasElement }) {
    (canvasElement.querySelector('.clr-combobox-trigger') as HTMLElement).click();
  },
};

export const NoResults: StoryObj = {
  render: ComboboxTemplate,
  play({ canvasElement }) {
    (canvasElement.querySelector('.clr-combobox-trigger') as HTMLElement).click();
    (canvasElement.querySelector('.clr-combobox-input') as HTMLInputElement).value = 'Lapis philosophorum';
    canvasElement.querySelector('.clr-combobox-input').dispatchEvent(new Event('input', { bubbles: true }));
  },
};
