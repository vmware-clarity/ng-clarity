/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrFormsModule, ClrLayoutModule } from '@clr/angular';
import { moduleMetadata, Story, StoryObj } from '@storybook/angular';
import { CommonModules } from 'helpers/common';

export default {
  title: 'Forms/Input States',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrLayoutModule, ClrFormsModule],
    }),
  ],
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

const FormInputTemplate: Story = args => ({
  template: `
    <form clrForm>
      <div class="clr-form-control" [ngClass]="{'clr-form-control-disabled': isDisabled}">
        <label class="clr-control-label">Text</label>
        <div class="clr-control-container" [ngClass]="{'clr-success': isSuccess, 'clr-error': isError}">
          <div class="clr-input-wrapper">
            <input type="text" class="clr-input" name="name" [ngModel]="name" [disabled]="isDisabled"/>
            <cds-icon class="clr-validate-icon" [shape]="isSuccess ? 'check-circle' : 'exclamation-circle'"></cds-icon>
          </div>
          <span class="clr-subtext">Helper Subtext</span>
          <span *ngIf="isSuccess || isError" class="clr-subtext" [ngClass]="{'success': isSuccess, 'error': isError}">State Subtext</span>
        </div>
      </div>
      
      <div class="clr-form-control" [ngClass]="{'clr-form-control-disabled': isDisabled}">
        <label class="clr-control-label">Number</label>
        <div class="clr-control-container" [ngClass]="{'clr-success': isSuccess, 'clr-error': isError}">
          <div class="clr-input-wrapper">
            <input type="number" class="clr-input" [ngModel]="age" name="age" [disabled]="isDisabled"/>
            <cds-icon class="clr-validate-icon" [shape]="isSuccess ? 'check-circle' : 'exclamation-circle'"></cds-icon>
          </div>
          <span class="clr-subtext">Helper Subtext</span>
          <span *ngIf="isSuccess || isError" class="clr-subtext" [ngClass]="{'success': isSuccess, 'error': isError}" >State Subtext</span>
        </div>
      </div>

      <div class="clr-form-control" [ngClass]="{'clr-form-control-disabled': isDisabled}">
        <label for="example" class="clr-control-label">Password</label>
        <div class="clr-control-container" [ngClass]="{'clr-success': isSuccess, 'clr-error': isError}">
          <div class="clr-input-wrapper">
            <input
              type="password"
              autocomplete="current-password"
              id="example"
              [ngModel]="password" name="password"
              placeholder="Password please!"
              class="clr-input"
              [disabled]="isDisabled"
            />
            <cds-icon class="clr-validate-icon" [shape]="isSuccess ? 'check-circle' : 'exclamation-circle'"></cds-icon>
          </div>
          <span class="clr-subtext">Helper Subtext</span>
          <span *ngIf="isSuccess || isError" class="clr-subtext" [ngClass]="{'success': isSuccess, 'error': isError}" >State Subtext</span>
        </div>
      </div>
      
      <div class="clr-form-control" [ngClass]="{'clr-form-control-disabled': isDisabled}">
        <label for="textarea-basic-error" class="clr-control-label">Textarea</label>
        <div class="clr-control-container" [ngClass]="{'clr-success': isSuccess, 'clr-error': isError}">
          <div class="clr-textarea-wrapper">
            <textarea class="clr-textarea" [ngModel]="description" name="description" [disabled]="isDisabled"></textarea>
            <cds-icon class="clr-validate-icon" [shape]="isSuccess ? 'check-circle' : 'exclamation-circle'"></cds-icon>
          </div>
          <span class="clr-subtext">Helper Subtext</span>
          <span *ngIf="isSuccess || isError" class="clr-subtext" [ngClass]="{'success': isSuccess, 'error': isError}" >State Subtext</span>
        </div>
      </div>
      
      <div class="clr-form-control" [ngClass]="{'clr-form-control-disabled': isDisabled}">
        <label class="clr-control-label">Basic select</label>
        <div class="clr-control-container" [ngClass]="{'clr-success': isSuccess && !isError, 'clr-error': isError}">
          <div class="clr-select-wrapper">
            <select class="clr-select" [ngModel]="options" name="options" [disabled]="isDisabled" required>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
            <cds-icon class="clr-validate-icon" [shape]="isSuccess ? 'check-circle' : 'exclamation-circle'"></cds-icon>
          </div>
          <span class="clr-subtext">Helper Subtext</span>
          <span *ngIf="isSuccess || isError" class="clr-subtext" [ngClass]="{'success': isSuccess, 'error': isError}" >State Subtext</span>
        </div>
      </div>
      
      <div class="clr-form-control" [ngClass]="{'clr-form-control-disabled': isDisabled}">
        <label class="clr-control-label">Checkbox</label>
          <div class="clr-control-container" [ngClass]="{'clr-success': isSuccess, 'clr-error': isError}">
            <div class="clr-checkbox-wrapper">
              <input 
                type="checkbox" 
                value="option" 
                id="option1"
                [ngModel]="option1" name="option1"
                [disabled]="isDisabled"
                class="clr-checkbox" />
              <label for="option1" class="clr-control-label">Option</label>
            </div>
            <span class="clr-subtext">Helper Subtext</span>
            <div class="clr-subtext-wrapper">
            <cds-icon class="clr-validate-icon" [shape]="isSuccess ? 'check-circle' : 'exclamation-circle'"></cds-icon>
              <span *ngIf="isSuccess || isError" class="clr-subtext" [ngClass]="{'success': isSuccess, 'error': isError}" >State Subtext</span>
            </div>
        </div>
      </div>
      
      <clr-date-container [ngClass]="{'clr-success': isSuccess, 'clr-error': isError}">
        <label>Datepicker</label>
        <input type="date" autocomplete="off" clrDate [ngModel]="demo" name="demo" [disabled]="isDisabled"/>
      </clr-date-container>
      
      <div class="clr-form-control" [ngClass]="{'clr-form-control-disabled': isDisabled}">
        <label class="clr-control-label">Basic radio</label>
        <div class="clr-control-container" [ngClass]="{'clr-success': isSuccess, 'clr-error': isError}">
          <div class="clr-radio-wrapper">
            <input type="radio" id="radio1" [ngModel]="radio" name="radio" value="radio1" class="clr-radio" [disabled]="isDisabled"/>
            <label for="radio1" class="clr-control-label">option1</label>
          </div>
          <div class="clr-radio-wrapper">
            <input type="radio" id="radio2" [ngModel]="radio" name="radio" value="radio2" class="clr-radio" [disabled]="isDisabled"/>
            <label for="radio2" class="clr-control-label">option2</label>
          </div>
          <div class="clr-radio-wrapper">
            <input type="radio" id="radio3" [ngModel]="radio" name="radio" value="radio3" class="clr-radio" [disabled]="isDisabled"/>
            <label for="radio3" class="clr-control-label">option3</label>
          </div>
          <span class="clr-subtext">Helper Subtext</span>
          <div class="clr-subtext-wrapper">
          <cds-icon class="clr-validate-icon" [shape]="isSuccess ? 'check-circle' : 'exclamation-circle'"></cds-icon>
            <span *ngIf="isSuccess || isError" class="clr-subtext" [ngClass]="{'success': isSuccess, 'error': isError}" >State Subtext</span>
          </div>
        </div>
      </div>
      
      <clr-range-container>
        <label>Range</label>
        <input type="range" clrRange [ngModel]="three" name="three" [disabled]="isDisabled"/>
      </clr-range-container>
    </form>
  `,
  props: args,
});

export const InputStates: StoryObj = {
  render: FormInputTemplate,
};

export const DisabledStates: StoryObj = {
  render: FormInputTemplate,
  args: { isDisabled: true },
};

export const ErrorStates: StoryObj = {
  render: FormInputTemplate,
  args: { isError: true },
};

export const SuccessStates: StoryObj = {
  render: FormInputTemplate,
  args: { isSuccess: true },
};
