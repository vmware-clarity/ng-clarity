/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrFormsModule, ClrLayoutModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <form clrForm>
      <clr-input-container [ngClass]="{'clr-success': isSuccess, 'clr-error': isError}">
        <label>Text</label>
        <input clrInput name="name" value="Test Value" [ngModel]="name" [disabled]="isDisabled"/>
      </clr-input-container>
      <clr-input-container [ngClass]="{'clr-success': isSuccess, 'clr-error': isError}">
        <label>Number</label>
        <input clrInput type="number" [ngModel]="age" name="age" [disabled]="isDisabled"/>
      </clr-input-container>
      <clr-password-container [ngClass]="{'clr-success': isSuccess, 'clr-error': isError}">
        <label>Password</label>
        <input clrPassword autocomplete="current-password" [ngModel]="password" name="password" [disabled]="isDisabled"/>
      </clr-password-container>
      <clr-textarea-container [ngClass]="{'clr-success': isSuccess, 'clr-error': isError}">
        <label>Textarea</label>
        <textarea clrTextarea [ngModel]="description" name="description" [disabled]="isDisabled"></textarea>
      </clr-textarea-container>
      <clr-select-container [ngClass]="{'clr-success': isSuccess, 'clr-error': isError}">
        <label>Select</label>
        <select clrSelect [ngModel]="options" name="options" [disabled]="isDisabled">
          <option value="one">One</option>
          <option value="two">Two</option>
          <option value="three">Three</option>
        </select>
      </clr-select-container>
      <clr-checkbox-container [ngClass]="{'clr-success': isSuccess, 'clr-error': isError}">
        <label>Checkbox</label>
        <clr-checkbox-wrapper>
          <input type="checkbox" clrCheckbox value="option1" [ngModel]="options1" name="options1" [disabled]="isDisabled"/>
          <label>Option 1</label>
        </clr-checkbox-wrapper>
        <clr-checkbox-wrapper>
          <input type="checkbox" clrCheckbox value="option2" [ngModel]="options2" name="options2" [disabled]="isDisabled"/>
          <label>Option 2</label>
        </clr-checkbox-wrapper>
      </clr-checkbox-container>
      <clr-date-container [ngClass]="{'clr-success': isSuccess, 'clr-error': isError}">
        <label>Datepicker</label>
        <input type="date" autocomplete="off" clrDate [ngModel]="demo" name="demo" [disabled]="isDisabled"/>
      </clr-date-container>
      <clr-radio-container [ngClass]="{'clr-success': isSuccess, 'clr-error': isError}">
        <label>Radio</label>
        <clr-radio-wrapper>
          <input type="radio" clrRadio [ngModel]="radioOpt1" name="radioOpt1" value="radioOpt1" [disabled]="isDisabled"/>
          <label>Option 1</label>
        </clr-radio-wrapper>
        <clr-radio-wrapper>
          <input type="radio" clrRadio [ngModel]="radioOpt2" name="radioOpt2" value="radioOpt2" [disabled]="isDisabled"/>
          <label>Option 2</label>
        </clr-radio-wrapper>
      </clr-radio-container>
      <clr-range-container [ngClass]="{'clr-success': isSuccess, 'clr-error': isError}">
        <label>Range</label>
        <input type="range" clrRange [ngModel]="three" name="three" [disabled]="isDisabled"/>
      </clr-range-container>
      <clr-input-container [ngClass]="{'clr-success': isSuccess, 'clr-error': isError}">
        <label>Helper text</label>
        <input clrInput [ngModel]="name1" name="name1"[disabled]="isDisabled"/>
        <clr-control-helper>Helper text</clr-control-helper>
      </clr-input-container>
    </form>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Forms/Input States',
  argTypes: {
    getProviderFromContainer: { control: { disable: true }, table: { disable: true } },
    triggerValidation: { control: { disable: true }, table: { disable: true } },
    isDisabled: { defaultValue: false, control: { type: 'boolean' } },
    isError: { defaultValue: false, control: { type: 'boolean' } },
    isSuccess: { defaultValue: false, control: { type: 'boolean' } },
  },
  args: {
    isDisabled: false,
    isError: false,
    isSuccess: false,
  },
};

const variants: Parameters[] = [{ isDisabled: true }, { isError: true }, { isSuccess: true }];

setupStorybook([ClrFormsModule, ClrLayoutModule], defaultStory, defaultParameters, variants);
