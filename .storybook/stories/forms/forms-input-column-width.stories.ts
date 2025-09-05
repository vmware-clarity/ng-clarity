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

// Class binding for inputs is not working due to 'initControlClass' function for that service being called in the constructor. However moving it to ngOnInit
// breaks the tests.
@Component({
  selector: 'forms-input-states-components',
  template: `
    <form class="clr-form-full-width" clrForm [formGroup]="form" [clrLayout]="clrLayout">
      <h3>Col 1</h3>
      <clr-input-container>
        <label class="clr-col-1">Field 1 label</label>
        <input class="clr-col-1" type="text" clrInput name="name" formControlName="name" />
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-input-container>
      <h3>Col 2</h3>
      <clr-input-container>
        <label class="clr-col-1">Field 2 label</label>
        <input class="clr-col-2" type="text" clrInput name="name" formControlName="name" />
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-input-container>
      <h3>Col 3</h3>
      <clr-input-container>
        <label class="clr-col-1">Field 3 label</label>
        <input class="clr-col-3" type="text" clrInput name="name" formControlName="name" />
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-input-container>
      <h3>Col 4</h3>
      <clr-input-container>
        <label class="clr-col-1">Field 4 label</label>
        <input class="clr-col-4" type="text" clrInput name="name" formControlName="name" />
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-input-container>
      <h3>Col 5</h3>
      <clr-input-container>
        <label class="clr-col-1">Field 5 label</label>
        <input class="clr-col-5" type="text" clrInput name="name" formControlName="name" />
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-input-container>
      <h3>Col 6</h3>
      <clr-input-container>
        <label class="clr-col-1">Field 6 label</label>
        <input class="clr-col-6" type="text" clrInput name="name" formControlName="name" />
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-input-container>
      <h3>Col 7</h3>
      <clr-input-container>
        <label class="clr-col-1">Field 7 label</label>
        <input class="clr-col-7" type="text" clrInput name="name" formControlName="name" />
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-input-container>
      <h3>Col 8</h3>
      <clr-input-container>
        <label class="clr-col-1">Field 8 label</label>
        <input class="clr-col-8" type="text" clrInput name="name" formControlName="name" />
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-input-container>
      <h3>Col 9</h3>
      <clr-input-container>
        <label class="clr-col-1">Field 9 label</label>
        <input class="clr-col-9" type="text" clrInput name="name" formControlName="name" />
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-input-container>
      <h3>Col 10</h3>
      <clr-input-container>
        <label class="clr-col-1">Field 10 label</label>
        <input class="clr-col-10" type="text" clrInput name="name" formControlName="name" />
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-input-container>
      <h3>Col 11</h3>
      <clr-input-container>
        <label class="clr-col-1">Field 11 label</label>
        <input class="clr-col-11" type="text" clrInput name="name" formControlName="name" />
        <clr-control-helper>Helper Subtext</clr-control-helper>
        <clr-control-error>State Subtext</clr-control-error>
        <clr-control-success>State Subtext</clr-control-success>
      </clr-input-container>
    </form>
  `,
  standalone: false,
})
class FormsStoryComponent {
  columns = new Array(11);
  _isDisabled = false;
  _isSuccess = false;
  _isError = false;

  form = new FormGroup({
    name: new FormControl(),
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
  title: 'Forms/Input Column Widths',
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
