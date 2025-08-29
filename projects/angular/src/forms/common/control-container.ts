/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from './if-control-state/if-control-state.service';
import { ControlClassService } from './providers/control-class.service';
import { ControlIdService } from './providers/control-id.service';
import { NgControlService } from './providers/ng-control.service';

@Component({
  selector: 'clr-control-container',
  template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
    <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <ng-content></ng-content>
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
    '[class.clr-row]': 'addGrid()',
  },
  providers: [IfControlStateService, NgControlService, ControlIdService, ControlClassService],
  standalone: false,
})
export class ClrControlContainer extends ClrAbstractContainer {}
