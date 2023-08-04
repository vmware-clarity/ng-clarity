/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrCombobox, ClrComboboxModule } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { elements } from '../../helpers/elements.data';
import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <clr-combobox-container>
      <label>{{label}}</label>
      <clr-combobox
        [id]="id"
        [clrMulti]="clrMulti"
        [ngModel]="clrMulti?multiModel:singleModel"
        [placeholder]="placeholder"
        (clrInputChange)="clrInputChange($event)"
        (clrOpenChange)="clrOpenChange($event)"
        (clrSelectionChange)="clrSelectionChange($event)"
        [disabled]="isDisabled"
        name="combo"
      >
        <ng-container *clrOptionSelected="let selected">
          {{selected}}
        </ng-container>
        <clr-options>
          <clr-option *clrOptionItems="let element of elements; let i = index" [clrValue]="element.symbol">{{element.name}}</clr-option>
        </clr-options>
      </clr-combobox>
    </clr-combobox-container>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Combobox/Combobox',
  component: ClrCombobox,
  argTypes: {
    // inputs
    clrMulti: { defaultValue: false, control: { type: 'boolean' } },
    placeholder: { defaultValue: 'Placeholder text' },
    id: { defaultValue: '' },
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
    optionCount: { control: { type: 'number', min: 1, max: elements.length } },
  },
  args: {
    // outputs
    clrInputChange: action('clrInputChange'),
    clrOpenChange: action('clrOpenChange'),
    clrSelectionChange: action('clrSelectionChange'),
    // story helpers
    optionCount: elements.length,
    content: 'Option',
    controlDisabled: false,
    elements,
    singleModel: 'Am',
    multiModel: ['Am', 'As', 'Ba'],
    isDisabled: null,
    label: 'Combobox',
  },
};

const variants: Parameters[] = [
  {
    clrMulti: false,
    singleModel: '',
    label: 'Single/Placeholder',
  },
  {
    clrMulti: false,
    singleModel: 'Ba',
    label: 'Single/Preselected',
  },
  {
    clrMulti: false,
    singleModel: 'Ba',
    isDisabled: true,
    label: 'Single/Disabled',
  },
  {
    clrMulti: true,
    label: 'Multi/Placeholder/Preselected',
  },
  {
    clrMulti: true,
    isDisabled: true,
    label: 'Multi/Disabled',
  },
];

setupStorybook(ClrComboboxModule, defaultStory, defaultParameters, variants);
