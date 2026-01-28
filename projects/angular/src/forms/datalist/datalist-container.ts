/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Optional } from '@angular/core';

import { ClrAbstractContainer } from '../common/abstract-container';
import { DatalistIdService } from './providers/datalist-id.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { FocusService } from '../common/providers/focus.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';

@Component({
  selector: 'clr-datalist-container',
  template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <div class="clr-input-group" [class.clr-focus]="focus" #datalist>
          <ng-content select="[clrDatalistInput]"></ng-content>
          <ng-content select="datalist"></ng-content>
          <cds-icon shape="angle" class="clr-datalist-caret" direction="down" (click)="showPicker(datalist)"></cds-icon>
        </div>
        @if (showInvalid) {
          <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger" aria-hidden="true"></cds-icon>
        }
        @if (showValid) {
          <cds-icon class="clr-validate-icon" shape="check-circle" status="success" aria-hidden="true"></cds-icon>
        }
      </div>
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
  `,
  host: {
    '[class.clr-form-control]': 'true',
    '[class.clr-form-control-disabled]': 'control?.disabled',
    '[class.clr-row]': 'addGrid()',
  },
  providers: [ControlClassService, ControlIdService, FocusService, NgControlService, DatalistIdService],
  standalone: false,
})
export class ClrDatalistContainer extends ClrAbstractContainer {
  focus = false;

  constructor(
    controlClassService: ControlClassService,
    @Optional() layoutService: LayoutService,
    ngControlService: NgControlService,
    focusService: FocusService
  ) {
    super(layoutService, controlClassService, ngControlService);

    this.subscriptions.push(focusService.focusChange.subscribe(state => (this.focus = state)));
  }

  showPicker(datalist: HTMLElement) {
    const datalistInput = datalist.querySelector('input[clrDatalistInput]') as HTMLInputElement;
    if (datalistInput) {
      datalistInput.focus();
      datalistInput.showPicker();
    }
  }
}
