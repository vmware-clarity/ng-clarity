/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ClrFormLayout, ClrFormsModule, ClrLayoutModule } from '@clr/angular';
import { argsToTemplate, moduleMetadata, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

@Component({
  selector: 'forms-input-states-components',
  template: `
    <form clrForm [formGroup]="form" [clrLayout]="clrLayout">
      <clr-input-container>
        <label>Text</label>
        <input type="text" clrInput name="name" formControlName="name" />
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-input-container>
      <clr-input-container>
        <label>Number</label>
        <input type="number" clrInput name="age" formControlName="age" />
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-input-container>
      <clr-input-container>
        <label>Password</label>
        <input type="password" clrInput name="password" formControlName="password" />
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-input-container>
      <clr-textarea-container>
        <label>Textarea</label>
        <textarea clrTextarea name="description" formControlName="description"></textarea>
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
        <input type="date" autocomplete="off" clrDate formControlName="date" name="date" />
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
    </form>
  `,
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
    option1: new FormControl(),
    date: new FormControl(),
    radio: new FormControl(),
    toggle: new FormControl(),
  });

  @Input() clrLayout = ClrFormLayout.HORIZONTAL;

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
    clrLayout: { control: 'radio', options: Object.values(ClrFormLayout).filter(value => typeof value === 'string') },
  },
  args: {
    clrLayout: ClrFormLayout.HORIZONTAL,
    isDisabled: false,
    isError: false,
    isSuccess: false,
  },
  render: (args: FormsStoryComponent) => ({
    props: {
      ...args,
    },
    template: `
      <forms-input-states-components ${argsToTemplate(args)}></forms-input-states-components>
    `,
  }),
};

type Story = StoryObj<FormsStoryComponent>;

export const InputStates: Story = {};

export const VerticalInputStates: Story = {
  args: { clrLayout: ClrFormLayout.VERTICAL },
};

export const CompactInputStates: Story = {
  args: { clrLayout: ClrFormLayout.COMPACT },
};

export const DisabledStates: Story = {
  args: { isDisabled: true },
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

export const SuccessStates: Story = {
  args: { isSuccess: true },
};
export const VerticalSuccessStates: Story = {
  args: { isSuccess: true, clrLayout: ClrFormLayout.VERTICAL },
};
export const CompactSuccessStates: Story = {
  args: { isSuccess: true, clrLayout: ClrFormLayout.COMPACT },
};
