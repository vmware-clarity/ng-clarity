/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
    <ng-container [ngSwitch]="templateMode">
      <!-- Single Mode: Render a single checkbox or toggle -->
      <ng-container *ngSwitchCase="'single'">
        <ng-container *ngIf="type === 'checkbox'">
          <ng-container
            *ngTemplateOutlet="checkboxTemplate; context: { checked: this.checked, disabled: this.disabled }"
          ></ng-container>
        </ng-container>
        <ng-container *ngIf="type === 'toggle'">
          <ng-container
            *ngTemplateOutlet="toggleTemplate; context: { checked: this.checked, disabled: this.disabled }"
          ></ng-container>
        </ng-container>
      </ng-container>

      <!-- Showcase Mode: Render examples of Enabled and Disabled states -->
      <ng-container *ngSwitchCase="'showcase'">
        <div style="padding: 20px">
          <span cds-text="subsection">Enabled</span>
          <ng-container *ngIf="type === 'checkbox'">
            <ng-container
              *ngTemplateOutlet="checkboxTemplate; context: { checked: true, disabled: false }"
            ></ng-container>
          </ng-container>
          <ng-container *ngIf="type === 'toggle'">
            <ng-container
              *ngTemplateOutlet="toggleTemplate; context: { checked: true, disabled: false }"
            ></ng-container>
          </ng-container>
        </div>

        <div style="padding: 20px">
          <span cds-text="subsection">Disabled</span>
          <ng-container *ngIf="type === 'checkbox'">
            <ng-container
              *ngTemplateOutlet="checkboxTemplate; context: { checked: true, disabled: true }"
            ></ng-container>
          </ng-container>
          <ng-container *ngIf="type === 'toggle'">
            <ng-container *ngTemplateOutlet="toggleTemplate; context: { checked: true, disabled: true }"></ng-container>
          </ng-container>
        </div>
      </ng-container>
    </ng-container>
    <ng-template #checkboxTemplate let-isChecked="checked" let-isDisabled="disabled">
      <clr-checkbox-container [clrInline]="clrInline">
        <label *ngIf="containerLabel">{{ containerLabel }}</label>
        <clr-checkbox-wrapper *ngFor="let control of createArray(optionCount); let i = index">
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
        <clr-control-helper *ngIf="showHelperText">Helper Subtext</clr-control-helper>
      </clr-checkbox-container>
      <clr-checkbox-container *ngIf="templateMode == 'showcase'">
        <label *ngIf="containerLabel">{{ containerLabel }}</label>
        <clr-checkbox-wrapper>
          <input type="checkbox" clrCheckbox value="option1" name="options" [disabled]="isDisabled" />
          <label>{{ label }} {{ createArray(optionCount).length }}</label>
        </clr-checkbox-wrapper>
      </clr-checkbox-container>
    </ng-template>
    <ng-template #toggleTemplate let-isChecked="checked" let-isDisabled="disabled">
      <clr-toggle-container [clrInline]="clrInline" [class.clr-toggle-right]="rightAligned">
        <label *ngIf="containerLabel">{{ containerLabel }}</label>
        <clr-toggle-wrapper *ngFor="let control of createArray(optionCount); let i = index">
          <input
            type="checkbox"
            clrToggle
            [ngModel]="isChecked"
            [disabled]="disabledIndexes.includes(i) || isDisabled"
          />
          <label>{{ label }} {{ i + 1 }}</label>
        </clr-toggle-wrapper>
        <clr-control-helper *ngIf="showHelperText">Helper Subtext</clr-control-helper>
      </clr-toggle-container>
      <clr-toggle-container *ngIf="templateMode == 'showcase'" [class.clr-toggle-right]="rightAligned">
        <label *ngIf="containerLabel">{{ containerLabel }}</label>
        <clr-toggle-wrapper>
          <input type="checkbox" clrToggle [disabled]="isDisabled" />
          <label>{{ label }} {{ createArray(optionCount).length }}</label>
        </clr-toggle-wrapper>
      </clr-toggle-container>
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
