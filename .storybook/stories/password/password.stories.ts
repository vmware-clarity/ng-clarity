/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClrFormsModule, ClrLayoutModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

const formMappingKey = 'form-mapping-key';
const patterns = {
  alphaNumeric: /^[a-z\d]+$/i,
  letters: /[a-z]/i,
  numbers: /\d/i,
};

export default {
  title: 'Password/Password',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrLayoutModule, ClrFormsModule],
    }),
  ],
  argTypes: {
    // story helpers
    patterns: { control: { disable: true }, table: { disable: true } },
    form: { control: { disable: true }, table: { disable: true }, mapping: { [formMappingKey]: getForm() } },
    passStrength: { control: { type: 'number', min: 0, max: 100 } },
  },
  args: {
    // story helpers
    patterns,
    form: formMappingKey,
  },
};

const PasswordTemplate: StoryFn = args => ({
  template: `
    <form clrForm [formGroup]="form" [clrLayout]="'horizontal'" [clrLabelSize]="2">
      <clr-password-container [clrPasswordStrength]="passStrength">
        <label>Password</label>
        <input clrPassword autocomplete="current-password" formControlName="password" required />
        <clr-control-helper>Helper text that shows while it is pristine and valid</clr-control-helper>
        <clr-control-success>Password is valid</clr-control-success>
        <clr-control-error *clrIfError="'required'">Password is required</clr-control-error>
        <clr-control-error *clrIfError="'minlength'">Must be at least 8 characters</clr-control-error>
        <clr-control-error *clrIfError="'pattern'; error as error">
          <ng-container [ngSwitch]="error.requiredPattern">
            <ng-container *ngSwitchCase="patterns.alphaNumeric.toString()">
              Must contain only letters and numbers
            </ng-container>
            <ng-container *ngSwitchCase="patterns.letters.toString()">Must contain at least one letter</ng-container>
            <ng-container *ngSwitchCase="patterns.numbers.toString()">Must contain at least one number</ng-container>
          </ng-container>
        </clr-control-error>
      </clr-password-container>
    </form>
  `,
  props: args,
});

function getForm() {
  return new FormGroup({
    password: new FormControl(null, [
      Validators.minLength(8),
      Validators.pattern(patterns.alphaNumeric),
      Validators.pattern(patterns.letters),
      Validators.pattern(patterns.numbers),
    ]),
  });
}

export const Password: StoryObj = {
  render: PasswordTemplate,
};

export const WeakPasswordStrength: StoryObj = {
  render: PasswordTemplate,
  args: { passStrength: 30 },
};

export const MediumPasswordStrength: StoryObj = {
  render: PasswordTemplate,
  args: { passStrength: 60 },
};

export const StrongPasswordStrength: StoryObj = {
  render: PasswordTemplate,
  args: { passStrength: 90 },
};
