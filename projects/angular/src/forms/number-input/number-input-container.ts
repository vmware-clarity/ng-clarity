/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild, forwardRef, Optional } from '@angular/core';

import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { FocusService } from '../common/providers/focus.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
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
        <div class="clr-input-group" [class.clr-focus]="focus" (focusout)="focusOut()">
          <ng-content select="[clrNumberInput]"></ng-content>
          <div class="clr-input-group-actions">
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
        @if (showInvalid) {
        <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger" aria-hidden="true"></cds-icon>
        } @if (showValid) {
        <cds-icon class="clr-validate-icon" shape="check-circle" status="success" aria-hidden="true"></cds-icon>
        }
      </div>
      @if (showHelper) {
      <ng-content select="clr-control-helper"></ng-content>
      } @if (showInvalid) {
      <ng-content select="clr-control-error"></ng-content>
      } @if (showValid) {
      <ng-content select="clr-control-success"></ng-content>
      }
    </div>
  `,
  host: {
    '[class.clr-form-control]': 'true',
    '[class.clr-form-control-disabled]': 'control?.disabled',
    '[class.clr-form-control-readonly]': 'input.readonly',
    '[class.clr-row]': 'addGrid()',
  },
  providers: [FocusService, IfControlStateService, NgControlService, ControlIdService, ControlClassService],
  standalone: false,
})
export class ClrNumberInputContainer extends ClrAbstractContainer {
  focus = false;

  @ContentChild(forwardRef(() => ClrNumberInput)) protected readonly input: ClrNumberInput;

  constructor(
    controlClassService: ControlClassService,
    @Optional() layoutService: LayoutService,
    ngControlService: NgControlService,
    focusService: FocusService,
    protected override ifControlStateService: IfControlStateService
  ) {
    super(ifControlStateService, layoutService, controlClassService, ngControlService);

    this.subscriptions.push(focusService.focusChange.subscribe(state => (this.focus = state)));
  }

  focusOut() {
    this.input.dispatchBlur();
  }
}
