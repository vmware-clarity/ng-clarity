/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
  selector: 'forms-input-group',
  template: `
    <form clrForm [formGroup]="form" [clrLayout]="clrLayout">
      <clr-input-container>
        <label>With icon on right side</label>
        <input type="text" clrInput name="text" formControlName="text" />
        <cds-icon shape="calendar" clrInputPrefix></cds-icon>
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-input-container>
      <clr-input-container>
        <label>With icon on left side</label>
        <input type="text" clrInput name="text" formControlName="text" />
        <cds-icon shape="calendar" clrInputSuffix></cds-icon>
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-input-container>
      <clr-input-container>
        <label>With icon on both sides</label>
        <input type="text" clrInput name="text" formControlName="text" />
        <cds-icon shape="calendar" clrInputSuffix></cds-icon>
        <cds-icon shape="calendar" clrInputPrefix></cds-icon>
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-input-container>
      <clr-input-container>
        <label>With text prefix + suffix</label>
        <input type="text" clrInput name="text" formControlName="text" />
        <div clrInputPrefix>$</div>
        <div clrInputSuffix>.00</div>
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-input-container>
      <clr-input-container>
        <label>Basic input with a select</label>
        <input type="text" clrInput name="text" formControlName="text" />
        <div clrInputPrefix>
          <select>
            <option>http://</option>
            <option>https://</option>
            <option>git://</option>
          </select>
        </div>
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-input-container>
    </form>
  `,
})
class FormsStoryComponent {
  _isDisabled = false;
  _isSuccess = false;
  _isError = false;

  form = new FormGroup({
    text: new FormControl(),
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
  title: 'Forms/Input Group',
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
  },
  render: (args: FormsStoryComponent) => ({
    props: {
      ...args,
    },
    template: `
      <forms-input-group ${argsToTemplate(args)}></forms-input-group>
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
