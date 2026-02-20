/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ClrButtonGroupModule, ClrIcon, ClrLoadingModule, commonStringsDefault } from '@clr/angular';
import { ClrPopoverPosition } from '@clr/angular/popover/common';
import { BUTTON_STYLES, BUTTON_TYPES, getButtonClass } from 'helpers/button-class.helper';
import { createArray } from 'helpers/common';
@Component({
  selector: 'storybook-button-group',
  standalone: true,
  imports: [CommonModule, ClrButtonGroupModule, ClrLoadingModule, ClrIcon],
  template: `
    @if (templateMode !== 'showcase') {
      <div style="text-align: center; margin-top: 20px;">
        <ng-container
          *ngTemplateOutlet="buttonGroupTemplate; context: { buttonType: buttonType, buttonStyle: buttonStyle }"
        ></ng-container>
      </div>
    }

    @if (templateMode === 'showcase') {
      <div>
        @for (btnStyle of BUTTON_STYLES; track btnStyle) {
          <div
            style="text-align: center"
            [ngStyle]="{ 'margin-top': clrMenuPosition.includes('top') ? '200px' : '20px' }"
          >
            @for (btnType of BUTTON_TYPES; track btnType) {
              <div style="margin-top: 10px">
                <ng-container
                  *ngTemplateOutlet="buttonGroupTemplate; context: { buttonType: btnType, buttonStyle: btnStyle }"
                ></ng-container>
              </div>
            }
          </div>
        }
      </div>
    }

    <ng-template #buttonGroupTemplate let-buttonType="buttonType" let-buttonStyle="buttonStyle">
      <clr-button-group
        [ngClass]="getButtonClass({ buttonType, buttonStyle, btnSmallSize })"
        [clrMenuPosition]="clrMenuPosition"
        [clrToggleButtonAriaLabel]="clrToggleButtonAriaLabel"
      >
        @for (_ of createArray(buttonCount); track $index; let i = $index) {
          <clr-button [clrInMenu]="false" [clrLoading]="loading" [disabled]="disabledButtonsPosition.includes(i + 1)">
            <cds-icon shape="home"></cds-icon>
            {{ content }} {{ i + 1 }}
          </clr-button>
        }
        @for (_ of createArray(inMenuButtonCount); track $index; let i = $index) {
          <clr-button [clrInMenu]="true">
            {{ content }} {{ buttonCount + i + 1 }} {{ i % 2 ? 'and a half' : '' }}
          </clr-button>
        }
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
