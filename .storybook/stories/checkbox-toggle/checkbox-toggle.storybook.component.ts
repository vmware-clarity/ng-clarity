/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrCheckboxModule } from '@clr/angular';
import { createArray } from 'helpers/common';

export enum CheckboxType {
  Checkbox = 'checkbox',
  Toggle = 'toggle',
}

@Component({
  selector: 'storybook-checkbox-toggle',
  standalone: true,
  imports: [CommonModule, ClrCheckboxModule, FormsModule],
  template: `
    @switch (templateMode) {
      @case ('single') {
        @if (type === 'checkbox') {
          <ng-container
            *ngTemplateOutlet="checkboxTemplate; context: { checked: checked, disabled: disabled }"
          ></ng-container>
        }
        @if (type === 'toggle') {
          <ng-container
            *ngTemplateOutlet="toggleTemplate; context: { checked: checked, disabled: disabled }"
          ></ng-container>
        }
      }
      @case ('showcase') {
        <div style="padding: 20px">
          <span cds-text="subsection">Enabled</span>
          @if (type === 'checkbox') {
            <ng-container
              *ngTemplateOutlet="checkboxTemplate; context: { checked: true, disabled: false }"
            ></ng-container>
          }
          @if (type === 'toggle') {
            <ng-container
              *ngTemplateOutlet="toggleTemplate; context: { checked: true, disabled: false }"
            ></ng-container>
          }
        </div>

        <div style="padding: 20px">
          <span cds-text="subsection">Disabled</span>
          @if (type === 'checkbox') {
            <ng-container
              *ngTemplateOutlet="checkboxTemplate; context: { checked: true, disabled: true }"
            ></ng-container>
          }
          @if (type === 'toggle') {
            <ng-container *ngTemplateOutlet="toggleTemplate; context: { checked: true, disabled: true }"></ng-container>
          }
        </div>
      }
    }
    <ng-template #checkboxTemplate let-isChecked="checked" let-isDisabled="disabled">
      <clr-checkbox-container [clrInline]="clrInline">
        @if (containerLabel) {
          <label>{{ containerLabel }}</label>
        }
        @for (control of createArray(optionCount); track $index; let i = $index) {
          <clr-checkbox-wrapper>
            <input
              type="checkbox"
              clrCheckbox
              value="option1"
              name="options"
              [ngModel]="isChecked"
              [disabled]="disabledIndexes.includes(i) || isDisabled"
            />
            <label>{{ label }} {{ i + 1 }}</label>
          </clr-checkbox-wrapper>
        }
        @if (showHelperText) {
          <clr-control-helper>Helper Subtext</clr-control-helper>
        }
      </clr-checkbox-container>
      @if (templateMode == 'showcase') {
        <clr-checkbox-container>
          @if (containerLabel) {
            <label>{{ containerLabel }}</label>
          }
          <clr-checkbox-wrapper>
            <input type="checkbox" clrCheckbox value="option1" name="options" [disabled]="isDisabled" />
            <label>{{ label }} {{ createArray(optionCount).length }}</label>
          </clr-checkbox-wrapper>
        </clr-checkbox-container>
      }
    </ng-template>
    <ng-template #toggleTemplate let-isChecked="checked" let-isDisabled="disabled">
      <clr-toggle-container [clrInline]="clrInline" [class.clr-toggle-right]="rightAligned">
        @if (containerLabel) {
          <label>{{ containerLabel }}</label>
        }
        @for (control of createArray(optionCount); track $index; let i = $index) {
          <clr-toggle-wrapper>
            <input
              type="checkbox"
              clrToggle
              [ngModel]="isChecked"
              [disabled]="disabledIndexes.includes(i) || isDisabled"
            />
            <label>{{ label }} {{ i + 1 }}</label>
          </clr-toggle-wrapper>
        }
        @if (showHelperText) {
          <clr-control-helper>Helper Subtext</clr-control-helper>
        }
      </clr-toggle-container>
      @if (templateMode == 'showcase') {
        <clr-toggle-container [class.clr-toggle-right]="rightAligned">
          @if (containerLabel) {
            <label>{{ containerLabel }}</label>
          }
          <clr-toggle-wrapper>
            <input type="checkbox" clrToggle [disabled]="isDisabled" />
            <label>{{ label }} {{ createArray(optionCount).length }}</label>
          </clr-toggle-wrapper>
        </clr-toggle-container>
      }
    </ng-template>
  `,
})
export class CheckboxToggleStorybookComponent {
  createArray = createArray;

  @Input() id = '';
  @Input() clrInline = false;
  @Input() type: CheckboxType | string = CheckboxType.Checkbox;
  @Input() label = 'Option';
  @Input() containerLabel;
  @Input() checked = false;
  @Input() disabled = false;
  @Input() showHelperText = false;
  @Input() templateMode: 'single' | 'showcase' = 'single';
  @Input() optionCount = 1;
  @Input() disabledIndexes = [];
  @Input() rightAligned = false;
}
