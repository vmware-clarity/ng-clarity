/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import {
  ClrAbstractContainer,
  ControlClassService,
  ControlIdService,
  NgControlService,
} from '@clr/angular/forms/common';

@Component({
  selector: 'clr-input-container',
  template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <div class="clr-input-group">
          <ng-content select="[clrInputPrefix]"></ng-content>
          <ng-content select="[clrInput]"></ng-content>
          <ng-content select="[clrInputSuffix]"></ng-content>
        </div>
      </div>
      @if (showHelper || showInvalid || showValid) {
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
      }
    </div>
  `,
  host: {
    '[class.clr-form-control]': 'true',
    '[class.clr-form-control-disabled]': 'control?.disabled',
    '[class.clr-row]': 'addGrid()',
  },
  providers: [NgControlService, ControlIdService, ControlClassService],
  standalone: false,
})
export class ClrInputContainer extends ClrAbstractContainer {}
