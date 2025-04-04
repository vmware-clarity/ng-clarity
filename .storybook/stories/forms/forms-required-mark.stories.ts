/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormControl, FormGroup } from '@angular/forms';
import { ClrFormLayout, ClrFormsModule, ClrLayoutModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

const formMappingKey = 'form-mapping-key';
const patterns = {
  alphaNumeric: /^[a-z\d]+$/i,
  letters: /[a-z]/i,
  numbers: /\d/i,
};

export default {
  title: 'Forms/Required Mark',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrLayoutModule, ClrFormsModule],
    }),
  ],
  argTypes: {
    // inputs
    clrLabelSize: { control: { type: 'number', min: 1, max: 12 } },
    // story helpers
    patterns: { control: { disable: true }, table: { disable: true } },
    form: { control: { disable: true }, table: { disable: true }, mapping: { [formMappingKey]: getForm() } },
    clrLayout: { control: 'radio', options: Object.values(ClrFormLayout).filter(value => typeof value === 'string') },
  },
  args: {
    // inputs
    clrLabelSize: 2,
    // story helpers
    patterns,
    clrLayout: ClrFormLayout.HORIZONTAL,
    screenReaderContent: 'Please fill out the form',
    form: formMappingKey,
    namePlaceholder: '',
  },
};

const RequiredMarkTemplate: StoryFn = args => ({
  template: `
    <form clrForm [formGroup]="form" [clrLayout]="clrLayout" [clrLabelSize]="clrLabelSize">
      <span class="clr-sr-only">{{ screenReaderContent }}</span>
      <span class="clr-required-mark">Required information</span>
      <clr-input-container>
        <label class="clr-required-mark">Name</label>
        <input clrInput formControlName="name" [placeholder]="namePlaceholder" required />
      </clr-input-container>
      <clr-number-input-container>
        <label class="clr-required-mark">Age</label>
        <input clrNumberInput formControlName="age" type="number" min="0" required />
      </clr-number-input-container>
      <clr-password-container>
        <label class="clr-required-mark">Password</label>
        <input clrPassword autocomplete="current-password" formControlName="password" required />
      </clr-password-container>
      <clr-textarea-container>
        <label class="clr-required-mark">Description</label>
        <textarea clrTextarea formControlName="description" required></textarea>
      </clr-textarea-container>
      <clr-control-container>
        <label class="clr-required-mark">Custom Control</label>
        <input clrControl formControlName="customControl" placeholder="Basic text" name="basic" required />
      </clr-control-container>
      <clr-select-container>
        <label class="clr-required-mark">Select</label>
        <select clrSelect name="options" formControlName="select" required>
          <option value="one">One</option>
          <option value="two">Two</option>
          <option value="three">Three</option>
        </select>
      </clr-select-container>
      <clr-checkbox-container>
        <label class="clr-required-mark">Checkbox</label>
        <clr-checkbox-wrapper>
          <input type="checkbox" formControlName="checkbox" clrCheckbox value="option1" name="options1" required />
          <label>Option 1</label>
        </clr-checkbox-wrapper>
        <clr-checkbox-wrapper>
          <input type="checkbox" formControlName="checkbox" clrCheckbox value="option2" name="options2" />
          <label>Option 2</label>
        </clr-checkbox-wrapper>
      </clr-checkbox-container>
      <clr-combobox-container>
        <label class="clr-required-mark">Combobox</label>
        <clr-combobox formControlName="combobox" name="two" placeholder="Select a number" required>
          <clr-options>
            <clr-option clrValue="1">1</clr-option>
            <clr-option clrValue="2">2</clr-option>
            <clr-option clrValue="3">3</clr-option>
          </clr-options>
        </clr-combobox>
      </clr-combobox-container>
      <clr-datalist-container>
        <label class="clr-required-mark">Datalist</label>
        <input clrDatalistInput formControlName="datalist" placeholder="No label" name="Option" required />
        <datalist>
          <option value="1"></option>
          <option value="2"></option>
          <option value="3"></option>
        </datalist>
      </clr-datalist-container>
      <clr-date-container>
        <label class="clr-required-mark">Datepicker</label>
        <input type="date" formControlName="datepicker" autocomplete="off" clrDate name="demo" required />
      </clr-date-container>
      <clr-radio-container>
        <label class="clr-required-mark">Radio</label>
        <clr-radio-wrapper>
          <input type="radio" clrRadio value="option1" formControlName="radio" required />
          <label>Option 1</label>
        </clr-radio-wrapper>
        <clr-radio-wrapper>
          <input type="radio" clrRadio value="option2" formControlName="radio" />
          <label>Option 2</label>
        </clr-radio-wrapper>
      </clr-radio-container>
      <clr-range-container>
        <label class="clr-required-mark">Range</label>
        <input type="range" clrRange formControlName="range" name="three" required />
      </clr-range-container>
      <clr-toggle-container>
        <label class="clr-required-mark">Toggle switch</label>
        <clr-toggle-wrapper>
          <input type="checkbox" clrToggle name="toggle" formControlName="toggle" required value="option1" />
          <label>Option 1</label>
        </clr-toggle-wrapper>
      </clr-toggle-container>
    </form>
  `,
  props: args,
});

function getForm() {
  return new FormGroup({
    name: new FormControl(null),
    age: new FormControl(null),
    password: new FormControl(null),
    description: new FormControl(null),
    customControl: new FormControl(null),
    select: new FormControl(null),
    checkbox: new FormControl(null),
    combobox: new FormControl(null),
    datalist: new FormControl(null),
    datepicker: new FormControl(null),
    radio: new FormControl(null),
    range: new FormControl(null),
    toggle: new FormControl(null),
  });
}

export const HorizontalLayout: StoryObj = {
  render: RequiredMarkTemplate,
};

export const VerticalLayout: StoryObj = {
  render: RequiredMarkTemplate,
  args: { namePlaceholder: 'Test placeholder', clrLayout: ClrFormLayout.VERTICAL },
};

export const CompactLayout: StoryObj = {
  render: RequiredMarkTemplate,
  args: { namePlaceholder: 'Test placeholder', clrLayout: ClrFormLayout.COMPACT },
};
