/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild, Optional } from '@angular/core';
import { SelectMultipleControlValueAccessor } from '@angular/forms';
import {
  ClrAbstractContainer,
  ControlClassService,
  ControlIdService,
  LayoutService,
  NgControlService,
} from '@clr/angular/src/forms/common';

@Component({
  selector: 'clr-select-container',
  template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div [ngClass]="wrapperClass()">
        <ng-content select="[clrSelect]"></ng-content>
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
  providers: [NgControlService, ControlIdService, ControlClassService],
  standalone: false,
})
export class ClrSelectContainer extends ClrAbstractContainer {
  @ContentChild(SelectMultipleControlValueAccessor, { static: false }) multiple: SelectMultipleControlValueAccessor;

  constructor(
    @Optional() protected override layoutService: LayoutService,
    protected override controlClassService: ControlClassService,
    protected override ngControlService: NgControlService
  ) {
    super(layoutService, controlClassService, ngControlService);
  }

  private get multi() {
    return this.control?.valueAccessor instanceof SelectMultipleControlValueAccessor;
  }

  wrapperClass() {
    return this.multi ? 'clr-multiselect-wrapper' : 'clr-select-wrapper';
  }
}
