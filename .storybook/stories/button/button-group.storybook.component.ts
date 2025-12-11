/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ClrButtonGroupModule, ClrIcon, ClrLoadingModule, commonStringsDefault } from '@clr/angular';
import { BUTTON_STYLES, BUTTON_TYPES, getButtonClass } from 'helpers/button-class.helper';
import { createArray } from 'helpers/common';

import { ClrPopoverPosition } from '../../../projects/angular/src/popover/common/utils/popover-positions';

@Component({
  selector: 'storybook-button-group',
  standalone: true,
  imports: [CommonModule, ClrButtonGroupModule, ClrLoadingModule, ClrIcon],
  template: `
    <!-- Default Template -->
    <div *ngIf="templateMode !== 'showcase'" style="text-align: center; margin-top: 100px;">
      <ng-container
        *ngTemplateOutlet="buttonGroupTemplate; context: { buttonType: buttonType, buttonStyle: buttonStyle }"
      ></ng-container>
    </div>

    <!-- Showcase Template -->
    <div *ngIf="templateMode === 'showcase'">
      <div
        *ngFor="let btnStyle of BUTTON_STYLES"
        style="text-align: center"
        [ngStyle]="{ 'margin-top': clrMenuPosition.includes('top') ? '200px' : '20px' }"
      >
        <div *ngFor="let btnType of BUTTON_TYPES" style="margin-top: 10px">
          <ng-container
            *ngTemplateOutlet="buttonGroupTemplate; context: { buttonType: btnType, buttonStyle: btnStyle }"
          ></ng-container>
        </div>
      </div>
    </div>

    <ng-template #buttonGroupTemplate let-buttonType="buttonType" let-buttonStyle="buttonStyle">
      <clr-button-group
        [ngClass]="getButtonClass({ buttonType, buttonStyle, btnSmallSize })"
        [clrMenuPosition]="clrMenuPosition"
        [clrToggleButtonAriaLabel]="clrToggleButtonAriaLabel"
      >
        <clr-button
          *ngFor="let _ of createArray(buttonCount); let i = index"
          [clrInMenu]="false"
          [clrLoading]="loading"
          [disabled]="disabledButtonsPosition.includes(i + 1)"
        >
          <cds-icon shape="home"></cds-icon>
          {{ content }} {{ i + 1 }}
        </clr-button>
        <clr-button *ngFor="let _ of createArray(inMenuButtonCount); let i = index" [clrInMenu]="true">
          {{ content }} {{ buttonCount + i + 1 }} {{ i % 2 ? 'and a half' : '' }}
        </clr-button>
      </clr-button-group>
    </ng-template>
  `,
})
export class ButtonGroupStorybookComponent {
  BUTTON_STYLES = BUTTON_STYLES;
  BUTTON_TYPES = BUTTON_TYPES;
  getButtonClass = getButtonClass;
  createArray = createArray;

  // Determines which template to use: 'default' or 'showcase'
  @Input() templateMode: 'default' | 'showcase' = 'default';

  // Inputs from the story args
  @Input() btnSmallSize = false; //btn-sm
  @Input() clrMenuPosition = ClrPopoverPosition.BOTTOM_LEFT;
  @Input() loading = false;
  @Input() clrToggleButtonAriaLabel: string = commonStringsDefault.rowActions;
  @Input() buttonCount = 3;
  @Input() inMenuButtonCount = 3;
  @Input() disabledButtonsPosition: number[] = [];
  @Input() content = 'Hello World!';
  @Input() buttonType = 'primary';
  @Input() buttonStyle = 'outline';
}
