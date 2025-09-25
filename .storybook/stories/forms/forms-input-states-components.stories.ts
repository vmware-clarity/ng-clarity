/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ClrFormLayout, ClrFormsModule, ClrLayoutModule } from '@clr/angular';
import { moduleMetadata, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

@Component({
  selector: 'forms-input-states-components',
  template: `
    <form
      clrForm
      [formGroup]="form"
      [clrLayout]="clrLayout"
      [class.clr-form-full-width]="isFullWidth"
      [class.is-readonly]="isReadonly"
    >
      <clr-input-container>
        <label>Text</label>
        <input type="text" clrInput name="name" formControlName="name" [readonly]="isReadonly" />
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-input-container>
      <clr-number-input-container>
        <label>Number</label>
        <input type="number" clrNumberInput name="age" formControlName="age" [readonly]="isReadonly" />
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-number-input-container>
      <clr-password-container>
        <label>Password</label>
        <input type="password" clrPassword name="password" formControlName="password" [readonly]="isReadonly" />
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-password-container>
      <clr-textarea-container>
        <label>Textarea</label>
        <textarea clrTextarea name="description" formControlName="description" [readonly]="isReadonly"></textarea>
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-textarea-container>
      <clr-select-container>
        <label>Basic select</label>
        <select clrSelect name="options" formControlName="selectedOption">
          <option value="one">One</option>
          <option value="two">Two</option>
          <option value="three">Three</option>
        </select>
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-select-container>
      <clr-datalist-container>
        <label>Datalist</label>
        <input
          clrDatalistInput
          placeholder="No label"
          name="datalist"
          formControlName="datalist"
          [readonly]="isReadonly"
        />
        <datalist>
          <option value="one"></option>
          <option value="two"></option>
          <option value="three"></option>
        </datalist>
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-datalist-container>
      <clr-combobox-container>
        <label>Combobox</label>
        <clr-combobox name="combobox" formControlName="selectedOptionCombobox">
          <clr-options>
            <clr-option [clrValue]="'one'">One</clr-option>
            <clr-option [clrValue]="'two'">Two</clr-option>
            <clr-option [clrValue]="'three'">Three</clr-option>
          </clr-options>
        </clr-combobox>
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-combobox-container>
      <clr-checkbox-container>
        <label>Checkbox</label>
        <clr-checkbox-wrapper>
          <input type="checkbox" clrCheckbox name="option1" value="option1" formControlName="option1" />
          <label>Option 1</label>
        </clr-checkbox-wrapper>
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-checkbox-container>
      <clr-date-container>
        <label>Datepicker</label>
        <input type="date" autocomplete="off" clrDate formControlName="date" name="date" [readonly]="isReadonly" />
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-date-container>
      <clr-radio-container>
        <label>Basic radio</label>
        <clr-radio-wrapper>
          <input type="radio" clrRadio name="radio" value="radio1" formControlName="radio" />
          <label>Option 1</label>
        </clr-radio-wrapper>
        <clr-radio-wrapper>
          <input type="radio" clrRadio name="radio" value="radio2" formControlName="radio" />
          <label>Option 2</label>
        </clr-radio-wrapper>
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-radio-container>
      <clr-toggle-container>
        <label>Full toggle switch</label>
        <clr-toggle-wrapper>
          <input type="checkbox" clrToggle value="option1" name="toggle-full" formControlName="toggle" />
          <label>Option 1</label>
        </clr-toggle-wrapper>
        <clr-toggle-wrapper>
          <input type="checkbox" clrToggle value="option2" name="toggle-full" formControlName="toggle" />
          <label>Option 2</label>
        </clr-toggle-wrapper>
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-toggle-container>
      <clr-file-input-container>
        <label>File Input</label>
        <input type="file" formControlName="files" multiple required clrFileInput />
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-file-input-container>
      <clr-range-container [clrRangeHasProgress]="true">
        <label>Range</label>
        <input type="range" clrRange name="three" formControlName="range" />
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-range-container>
    </form>
  `,
  styles: [
    `
      .is-readonly {
        clr-range-container,
        clr-file-input-container,
        clr-toggle-container,
        clr-radio-container,
        clr-checkbox-container,
        clr-select-container,
        clr-combobox-container {
          display: none;
        }
      }
    `,
  ],
  standalone: false,
})
class FormsStoryComponent {
  _isDisabled = false;
  _isSuccess = false;
  _isError = false;

  form = new FormGroup({
    name: new FormControl(),
    age: new FormControl(),
    password: new FormControl(),
    description: new FormControl(),
    selectedOption: new FormControl(),
    selectedOptionCombobox: new FormControl(),
    datalist: new FormControl(),
    option1: new FormControl(),
    date: new FormControl(),
    radio: new FormControl(),
    toggle: new FormControl(),
    files: new FormControl(),
    range: new FormControl(50),
  });

  @Input() clrLayout = ClrFormLayout.HORIZONTAL;
  @Input() isFullWidth = false;
  @Input() isReadonly = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  @Input()
  get isDisabled() {
    return this._isDisabled;
  }
  set isDisabled(value: boolean) {
    this._isDisabled = value;
    this.setControlsState();
  }

  @Input()
  get isError() {
    return this._isError;
  }
  set isError(value: boolean) {
    this._isError = value;
    this.setControlsState();
  }

  @Input()
  get isSuccess() {
    return this._isSuccess;
  }
  set isSuccess(value: boolean) {
    this._isSuccess = value;
    this.setControlsState();
  }
  setControlsState() {
    this.form.enable();
    Object.keys(this.form.controls).forEach(control => {
      if (this._isDisabled) {
        this.form.get(control)?.disable();
      } else {
        if (this._isError && !this._isSuccess) {
          this.form.get(control).setErrors({ required: true });
          this.form.get(control).markAsTouched();
          this.form.get(control).markAsDirty();
        } else if (this._isSuccess) {
          this.form.get(control).setErrors(null);
          this.form.get(control).markAsTouched();
        }
      }
    });
    this.form.updateValueAndValidity();
    this.changeDetectorRef.detectChanges();
  }
}

export default {
  title: 'Forms/Input States (Using Components)',
  component: FormsStoryComponent,
  decorators: [
    moduleMetadata({
      declarations: [FormsStoryComponent],
      imports: [...CommonModules, ClrLayoutModule, ClrFormsModule],
    }),
  ],
  argTypes: {
    getProviderFromContainer: { control: { disable: true }, table: { disable: true } },
    triggerValidation: { control: { disable: true }, table: { disable: true } },
    clrLayout: {
      control: { type: 'radio' },
      options: Object.values(ClrFormLayout).filter(value => typeof value === 'string'),
    },
  },
  args: {
    clrLayout: ClrFormLayout.HORIZONTAL,
    isDisabled: false,
    isError: false,
    isSuccess: false,
    isFullWidth: false,
  },
};

type Story = StoryObj<FormsStoryComponent>;

export const InputStates: Story = {};

export const VerticalInputStates: Story = {
  args: { clrLayout: ClrFormLayout.VERTICAL },
};

export const CompactInputStates: Story = {
  args: { clrLayout: ClrFormLayout.COMPACT },
};

export const FullWidthInputStates: Story = {
  args: { isFullWidth: true },
};

export const VerticaFullWidthInputStates: Story = {
  args: { clrLayout: ClrFormLayout.VERTICAL, isFullWidth: true },
};

export const CompactFullWidthInputStates: Story = {
  args: { clrLayout: ClrFormLayout.COMPACT, isFullWidth: true },
};

export const DisabledStates: Story = {
  args: { isDisabled: true },
};
export const ReadonlyStates: Story = {
  args: { isReadonly: true },
};

export const ErrorStates: Story = {
  args: { isError: true },
};
export const VerticalErrorStates: Story = {
  args: { isError: true, clrLayout: ClrFormLayout.VERTICAL },
};
export const CompactErrorStates: Story = {
  args: { isError: true, clrLayout: ClrFormLayout.COMPACT },
};

export const FullWidthErrorStates: Story = {
  args: { isError: true, isFullWidth: true },
};

export const VerticalFullWidthErrorStates: Story = {
  args: { isError: true, clrLayout: ClrFormLayout.VERTICAL, isFullWidth: true },
};

export const CompactFullWidthErrorStates: Story = {
  args: { isError: true, clrLayout: ClrFormLayout.COMPACT, isFullWidth: true },
};

export const SuccessStates: Story = {
  args: { isSuccess: true },
};
export const VerticalSuccessStates: Story = {
  args: { isSuccess: true, clrLayout: ClrFormLayout.VERTICAL },
};
export const CompactSuccessStates: Story = {
  args: { isSuccess: true, clrLayout: ClrFormLayout.COMPACT },
};

export const FullWidthSuccessStates: Story = {
  args: { isSuccess: true, isFullWidth: true },
};

export const FullWidthVerticalSuccessStates: Story = {
  args: { isSuccess: true, clrLayout: ClrFormLayout.VERTICAL, isFullWidth: true },
};

export const FullWidthCompactSuccessStates: Story = {
  args: { isSuccess: true, clrLayout: ClrFormLayout.COMPACT, isFullWidth: true },
};
