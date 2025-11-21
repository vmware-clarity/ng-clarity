/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrFormLayout, ClrIcon } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Forms/Input States (Styles only)',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrIcon],
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

const FormInputTemplate: StoryFn = args => ({
  template: `
    <form [class]="'clr-form clr-form-' + clrLayout" [class.clr-form-full-width]="isFullWidth">
      <div class="clr-form-control" [ngClass]="{ 'clr-form-control-disabled': isDisabled }">
        <label class="clr-control-label">Text</label>
        <div class="clr-control-container" [ngClass]="{ 'clr-success': isSuccess, 'clr-error': isError }">
          <div class="clr-input-wrapper">
            <input type="text" class="clr-input" name="name" [ngModel]="name" [disabled]="isDisabled" />
            <cds-icon class="clr-validate-icon" [shape]="isSuccess ? 'check-circle' : 'exclamation-circle'"></cds-icon>
          </div>
          <span class="clr-subtext">Helper Subtext</span>
          <span *ngIf="isSuccess || isError" class="clr-subtext" [ngClass]="{ success: isSuccess, error: isError }">
            State Subtext
          </span>
        </div>
      </div>

      <div class="clr-form-control" [ngClass]="{ 'clr-form-control-disabled': isDisabled }">
        <label class="clr-control-label">Number</label>
        <div class="clr-control-container" [ngClass]="{ 'clr-success': isSuccess, 'clr-error': isError }">
          <div class="clr-input-wrapper">
            <input type="number" class="clr-input" [ngModel]="age" name="age" [disabled]="isDisabled" />
            <cds-icon class="clr-validate-icon" [shape]="isSuccess ? 'check-circle' : 'exclamation-circle'"></cds-icon>
          </div>
          <span class="clr-subtext">Helper Subtext</span>
          <span *ngIf="isSuccess || isError" class="clr-subtext" [ngClass]="{ success: isSuccess, error: isError }">
            State Subtext
          </span>
        </div>
      </div>

      <div class="clr-form-control" [ngClass]="{ 'clr-form-control-disabled': isDisabled }">
        <label for="example" class="clr-control-label">Password</label>
        <div class="clr-control-container" [ngClass]="{ 'clr-success': isSuccess, 'clr-error': isError }">
          <div class="clr-input-wrapper">
            <input
              type="password"
              autocomplete="current-password"
              id="example"
              [ngModel]="password"
              name="password"
              placeholder="Password please!"
              class="clr-input"
              [disabled]="isDisabled"
            />
            <cds-icon class="clr-validate-icon" [shape]="isSuccess ? 'check-circle' : 'exclamation-circle'"></cds-icon>
          </div>
          <span class="clr-subtext">Helper Subtext</span>
          <span *ngIf="isSuccess || isError" class="clr-subtext" [ngClass]="{ success: isSuccess, error: isError }">
            State Subtext
          </span>
        </div>
      </div>

      <div class="clr-form-control" [ngClass]="{ 'clr-form-control-disabled': isDisabled }">
        <label for="textarea-basic-error" class="clr-control-label">Textarea</label>
        <div class="clr-control-container" [ngClass]="{ 'clr-success': isSuccess, 'clr-error': isError }">
          <div class="clr-textarea-wrapper">
            <textarea class="clr-textarea" [ngModel]="description" name="description" [disabled]="isDisabled"></textarea>
            <cds-icon class="clr-validate-icon" [shape]="isSuccess ? 'check-circle' : 'exclamation-circle'"></cds-icon>
          </div>
          <span class="clr-subtext">Helper Subtext</span>
          <span *ngIf="isSuccess || isError" class="clr-subtext" [ngClass]="{ success: isSuccess, error: isError }">
            State Subtext
          </span>
        </div>
      </div>

      <div class="clr-form-control" [ngClass]="{ 'clr-form-control-disabled': isDisabled }">
        <label class="clr-control-label">Basic select</label>
        <div class="clr-control-container" [ngClass]="{ 'clr-success': isSuccess && !isError, 'clr-error': isError }">
          <div class="clr-select-wrapper">
            <select class="clr-select" [ngModel]="options" name="options" [disabled]="isDisabled" required>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
            <cds-icon class="clr-validate-icon" [shape]="isSuccess ? 'check-circle' : 'exclamation-circle'"></cds-icon>
          </div>
          <span class="clr-subtext">Helper Subtext</span>
          <span *ngIf="isSuccess || isError" class="clr-subtext" [ngClass]="{ success: isSuccess, error: isError }">
            State Subtext
          </span>
        </div>
      </div>

      <div class="clr-form-control" [ngClass]="{ 'clr-form-control-disabled': isDisabled }">
        <label class="clr-control-label">Checkbox</label>
        <div class="clr-control-container" [ngClass]="{ 'clr-success': isSuccess, 'clr-error': isError }">
          <div class="clr-checkbox-wrapper">
            <input
              type="checkbox"
              value="option"
              id="option1"
              [ngModel]="option1"
              name="option1"
              [disabled]="isDisabled"
              class="clr-checkbox"
            />
            <label for="option1" class="clr-control-label">Option</label>
          </div>
          <span class="clr-subtext">Helper Subtext</span>
          <div class="clr-subtext-wrapper">
            <cds-icon class="clr-validate-icon" [shape]="isSuccess ? 'check-circle' : 'exclamation-circle'"></cds-icon>
            <span *ngIf="isSuccess || isError" class="clr-subtext" [ngClass]="{ success: isSuccess, error: isError }">
              State Subtext
            </span>
          </div>
        </div>
      </div>

      <div class="clr-form-control" [ngClass]="{ 'clr-form-control-disabled': isDisabled }">
        <label class="clr-control-label">Basic radio</label>
        <div class="clr-control-container" [ngClass]="{ 'clr-success': isSuccess, 'clr-error': isError }">
          <div class="clr-radio-wrapper">
            <input
              type="radio"
              id="radio1"
              [ngModel]="radio"
              name="radio"
              value="radio1"
              class="clr-radio"
              [disabled]="isDisabled"
            />
            <label for="radio1" class="clr-control-label">option1</label>
          </div>
          <div class="clr-radio-wrapper">
            <input
              type="radio"
              id="radio2"
              [ngModel]="radio"
              name="radio"
              value="radio2"
              class="clr-radio"
              [disabled]="isDisabled"
            />
            <label for="radio2" class="clr-control-label">option2</label>
          </div>
          <div class="clr-radio-wrapper">
            <input
              type="radio"
              id="radio3"
              [ngModel]="radio"
              name="radio"
              value="radio3"
              class="clr-radio"
              [disabled]="isDisabled"
            />
            <label for="radio3" class="clr-control-label">option3</label>
          </div>
          <span class="clr-subtext">Helper Subtext</span>
          <div class="clr-subtext-wrapper">
            <cds-icon class="clr-validate-icon" [shape]="isSuccess ? 'check-circle' : 'exclamation-circle'"></cds-icon>
            <span *ngIf="isSuccess || isError" class="clr-subtext" [ngClass]="{ success: isSuccess, error: isError }">
              State Subtext
            </span>
          </div>
        </div>
      </div>

      <div class="clr-form-control">
        <label class="clr-control-label">Full toggle switch</label>
        <div class="clr-control-container" [ngClass]="{ 'clr-success': isSuccess, 'clr-error': isError }">
          <div class="clr-toggle-wrapper">
            <input type="checkbox" id="toggle1" name="toggle-full" value="option1" class="clr-toggle" />
            <label for="toggle1" class="clr-control-label">option 1</label>
          </div>
          <div class="clr-toggle-wrapper">
            <input type="checkbox" id="toggle2" name="toggle-full" value="option2" class="clr-toggle" />
            <label for="toggle2" class="clr-control-label">option 2</label>
          </div>
          <div class="clr-toggle-wrapper">
            <input type="checkbox" id="toggle3" name="toggle-full" value="option3" class="clr-toggle" />
            <label for="toggle3" class="clr-control-label">option 3</label>
          </div>
          <span class="clr-subtext">Helper Subtext</span>
          <div class="clr-subtext-wrapper">
            <cds-icon class="clr-validate-icon" [shape]="isSuccess ? 'check-circle' : 'exclamation-circle'"></cds-icon>
            <span *ngIf="isSuccess || isError" class="clr-subtext" [ngClass]="{ success: isSuccess, error: isError }">
              State Subtext
            </span>
          </div>
        </div>
      </div>
    </form>
  `,
  props: args,
});

export const InputStates: StoryObj = {
  render: FormInputTemplate,
};

export const VerticalInputStates: StoryObj = {
  render: FormInputTemplate,
  args: { clrLayout: ClrFormLayout.VERTICAL },
};

export const CompactInputStates: StoryObj = {
  render: FormInputTemplate,
  args: { clrLayout: ClrFormLayout.COMPACT },
};

export const FullWidthInputStates: StoryObj = {
  render: FormInputTemplate,
  args: { isFullWidth: true },
};

export const VerticaFullWidthInputStates: StoryObj = {
  render: FormInputTemplate,
  args: { clrLayout: ClrFormLayout.VERTICAL, isFullWidth: true },
};

export const CompactFullWidthInputStates: StoryObj = {
  render: FormInputTemplate,
  args: { clrLayout: ClrFormLayout.COMPACT, isFullWidth: true },
};

export const DisabledStates: StoryObj = {
  render: FormInputTemplate,
  args: { isDisabled: true },
};

export const ErrorStates: StoryObj = {
  render: FormInputTemplate,
  args: { isError: true },
};

export const VerticalErrorStates: StoryObj = {
  render: FormInputTemplate,
  args: { isError: true, clrLayout: ClrFormLayout.VERTICAL },
};

export const CompactErrorStates: StoryObj = {
  render: FormInputTemplate,
  args: { isError: true, clrLayout: ClrFormLayout.COMPACT },
};

export const FullWidthErrorStates: StoryObj = {
  render: FormInputTemplate,
  args: { isError: true, isFullWidth: true },
};

export const VerticalFullWidthErrorStates: StoryObj = {
  render: FormInputTemplate,
  args: { isError: true, clrLayout: ClrFormLayout.VERTICAL, isFullWidth: true },
};

export const CompactFullWidthErrorStates: StoryObj = {
  render: FormInputTemplate,
  args: { isError: true, clrLayout: ClrFormLayout.COMPACT, isFullWidth: true },
};

export const SuccessStates: StoryObj = {
  render: FormInputTemplate,
  args: { isSuccess: true },
};

export const VerticalSuccessStates: StoryObj = {
  render: FormInputTemplate,
  args: { isSuccess: true, clrLayout: ClrFormLayout.VERTICAL },
};

export const CompactSuccessStates: StoryObj = {
  render: FormInputTemplate,
  args: { isSuccess: true, clrLayout: ClrFormLayout.COMPACT },
};

export const FullWidthSuccessStates: StoryObj = {
  render: FormInputTemplate,
  args: { isSuccess: true, isFullWidth: true },
};

export const FullWidthVerticalSuccessStates: StoryObj = {
  render: FormInputTemplate,
  args: { isSuccess: true, clrLayout: ClrFormLayout.VERTICAL, isFullWidth: true },
};

export const FullWidthCompactSuccessStates: StoryObj = {
  render: FormInputTemplate,
  args: { isSuccess: true, clrLayout: ClrFormLayout.COMPACT, isFullWidth: true },
};
