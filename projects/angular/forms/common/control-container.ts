/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrAbstractContainer } from './abstract-container';
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
      </div>
      <clr-control-subtext-container [showHelper]="showHelper" [showInvalid]="showInvalid" [showValid]="showValid">
        <ng-content select="clr-control-helper" ngProjectAs="clr-control-helper"></ng-content>
        <ng-content select="clr-control-error" ngProjectAs="clr-control-error"></ng-content>
        <ng-content select="clr-control-success" ngProjectAs="clr-control-success"></ng-content>
      </clr-control-subtext-container>
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
export class ClrControlContainer extends ClrAbstractContainer {}
