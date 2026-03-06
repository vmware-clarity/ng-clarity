/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild, forwardRef, Optional } from '@angular/core';
import {
  ClrAbstractContainer,
  ControlClassService,
  ControlIdService,
  FormsFocusService,
  LayoutService,
  NgControlService,
} from '@clr/angular/forms/common';

import { ClrNumberInput } from './number-input';

@Component({
  selector: 'clr-number-input-container',
  template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-number-input-wrapper">
        <div class="clr-input-group" [class.clr-focus]="focus">
          <ng-content select="[clrNumberInput]"></ng-content>
          <div class="clr-input-group-actions" (focusout)="focusOut()">
            <button
              type="button"
              class="clr-input-group-icon-action"
              (click)="input.stepDown()"
              [disabled]="control?.disabled"
            >
              <cds-icon shape="minus" size="sm"></cds-icon>
            </button>
            <div class="clr-number-input-separator"></div>
            <button
              type="button"
              class="clr-input-group-icon-action"
              (click)="input.stepUp()"
              [disabled]="control?.disabled"
            >
              <cds-icon shape="plus" size="sm"></cds-icon>
            </button>
          </div>
        </div>
      </div>
      <div class="clr-subtext-container">
        @if (showHelper) {
          <ng-content select="clr-control-helper"></ng-content>
        }
        @if (showInvalid) {
          <ng-content select="clr-control-error"></ng-content>
        }
        @if (showValid) {
          <ng-content select="clr-control-success"></ng-content>
        }
      </div>
    </div>
  `,
  host: {
    '[class.clr-form-control]': 'true',
    '[class.clr-form-control-disabled]': 'control?.disabled',
    '[class.clr-form-control-readonly]': 'input.readonly',
    '[class.clr-row]': 'addGrid()',
  },
  providers: [FormsFocusService, NgControlService, ControlIdService, ControlClassService],
  standalone: false,
})
export class ClrNumberInputContainer extends ClrAbstractContainer {
  focus = false;

  @ContentChild(forwardRef(() => ClrNumberInput)) protected readonly input: ClrNumberInput;

  constructor(
    controlClassService: ControlClassService,
    @Optional() layoutService: LayoutService,
    ngControlService: NgControlService,
    focusService: FormsFocusService
  ) {
    super(layoutService, controlClassService, ngControlService);

    this.subscriptions.push(focusService.focusChange.subscribe(state => (this.focus = state)));
  }

  focusOut() {
    this.input.dispatchBlur();
  }
}
