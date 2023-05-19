/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input, Optional, Renderer2 } from '@angular/core';

import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';

@Component({
  selector: 'clr-range-container',
  template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-range-wrapper" [class.progress-fill]="hasProgress">
        <ng-content select="[clrRange]"></ng-content>
        <span *ngIf="hasProgress" class="fill-input" [style.width]="getRangeProgressFillWidth()"></span>
        <cds-icon
          *ngIf="showInvalid"
          class="clr-validate-icon"
          shape="exclamation-circle"
          status="danger"
          aria-hidden="true"
        ></cds-icon>
        <cds-icon
          *ngIf="showValid"
          class="clr-validate-icon"
          shape="check-circle"
          status="success"
          aria-hidden="true"
        ></cds-icon>
      </div>
      <ng-content select="clr-control-helper" *ngIf="showHelper"></ng-content>
      <ng-content select="clr-control-error" *ngIf="showInvalid"></ng-content>
      <ng-content select="clr-control-success" *ngIf="showValid"></ng-content>
    </div>
  `,
  host: {
    '[class.clr-form-control]': 'true',
    '[class.clr-form-control-disabled]': 'control?.disabled',
    '[class.clr-row]': 'addGrid()',
  },
  providers: [IfControlStateService, NgControlService, ControlIdService, ControlClassService],
})
export class ClrRangeContainer extends ClrAbstractContainer {
  private _hasProgress = false;

  @Input('clrRangeHasProgress')
  get hasProgress() {
    return this._hasProgress;
  }
  set hasProgress(val: boolean) {
    const valBool = !!val;
    if (valBool !== this._hasProgress) {
      this._hasProgress = valBool;
    }
  }

  constructor(
    @Optional() layoutService: LayoutService,
    controlClassService: ControlClassService,
    ngControlService: NgControlService,
    private renderer: Renderer2,
    private idService: ControlIdService,
    protected override ifControlStateService: IfControlStateService
  ) {
    super(ifControlStateService, layoutService, controlClassService, ngControlService);
  }

  getRangeProgressFillWidth(): string {
    const input = this.renderer.selectRootElement('[clrRange]#' + this.idService.id);

    const inputWidth = input.offsetWidth;
    const inputMinValue = +input.min;
    let inputMaxValue = +input.max;

    if (inputMinValue === 0 && inputMaxValue === 0) {
      inputMaxValue = 100;
    }

    const inputMiddle = (inputMinValue + inputMaxValue) / 2;
    const inputValue = !!this.control && this.control.value !== undefined ? this.control.value : inputMiddle;
    const valueAsPercent = ((inputValue - inputMinValue) * 100) / (inputMaxValue - inputMinValue);

    return (valueAsPercent * inputWidth) / 100 + 'px';
  }
}
