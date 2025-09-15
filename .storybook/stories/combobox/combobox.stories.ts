/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { moduleMetadata, StoryObj } from '@storybook/angular';

import { StorybookComboboxComponent } from './combobox.storybook.component';
import { CommonModules } from '../../helpers/common';
import { elements } from '../../helpers/elements.data';

export default {
  title: 'Combobox/Combobox',
  component: StorybookComboboxComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModules, StorybookComboboxComponent],
    }),
  ],
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
    useGroups: { control: { type: 'boolean' } },
    elements: { control: { disable: true }, table: { disable: true } },
    optionGroups: { control: { disable: true }, table: { disable: true } },
    optionCount: { control: { type: 'number', min: 1, max: elements.length } },
    updateOn: { control: { type: 'radio' }, options: ['change', 'blur', 'submit'] },
  },
  args: {
    clrMulti: false,
    placeholder: 'Placeholder text',
    id: '',
    label: 'Combobox',
    clrLoading: false,
    controlDisabled: false,
    controlRequired: false,
    controlHelper: false,
    helperText: 'Helper text',
    useGroups: false,
    elements: elements,
    singleModel: 'Am',
    multiModel: ['Am', 'As', 'Ba'],
    multiLineItems: false,
  },
};

export const SingleSelection: StoryObj = {};

export const SingleSelection_Preselected: StoryObj = {
  args: {
    singleModel: 'Ba',
  },
};

export const SingleSelectionWithGroups: StoryObj = {
  args: {
    useGroups: true,
  },
};

export const SingleSelectionDisabled: StoryObj = {
  args: {
    controlDisabled: true,
  },
};

export const MultiSelection: StoryObj = {
  args: {
    clrMulti: true,
  },
};

export const MultiSelection_MultiLine: StoryObj = {
  args: {
    clrMulti: true,
    multiModel: elements.map(element => element.symbol), // all elements
  },
};

export const MultiSelectionWithGroups: StoryObj = {
  args: {
    clrMulti: true,
    useGroups: true,
  },
};

export const MultiSelectionDisabled: StoryObj = {
  args: {
    clrMulti: true,
    controlDisabled: true,
  },
};

export const SingleSelectionRequired: StoryObj = {
  args: {
    singleModel: '',
    controlHelper: true,
    controlRequired: true,
  },
};

export const MultiSelectionRequired: StoryObj = {
  args: {
    multiModel: [],
    clrMulti: true,
    controlHelper: true,
    controlRequired: true,
  },
};

export const Loading: StoryObj = {
  args: {
    clrLoading: true,
    elements: [],
  },
  play({ canvasElement }) {
    (canvasElement.querySelector('.clr-combobox-trigger') as HTMLElement).click();
  },
};
export const Opened: StoryObj = {
  play({ canvasElement }) {
    (canvasElement.querySelector('.clr-combobox-trigger') as HTMLElement).click();
  },
};
export const OpenedMultiLineItems: StoryObj = {
  args: {
    multiLineItems: true,
  },
  play({ canvasElement }) {
    (canvasElement.querySelector('.clr-combobox-trigger') as HTMLElement).click();
  },
};

export const NoResults: StoryObj = {
  play({ canvasElement }) {
    (canvasElement.querySelector('.clr-combobox-trigger') as HTMLElement).click();
    (canvasElement.querySelector('.clr-combobox-input') as HTMLInputElement).value = 'Lapis philosophorum';
    canvasElement.querySelector('.clr-combobox-input').dispatchEvent(new Event('input', { bubbles: true }));
  },
};
