/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild, Optional } from '@angular/core';
import { SelectMultipleControlValueAccessor } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

import { NgControlService } from '../common/providers/ng-control.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ClrAbstractContainer } from '../common/abstract-container';
import { LayoutService } from '../common/providers/layout.service';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ClrDestroyService } from '../../utils/destroy';

@Component({
  selector: 'clr-select-container',
  template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div [ngClass]="wrapperClass()">
        <ng-content select="[clrSelect]"></ng-content>
        <cds-icon
          *ngIf="showInvalid"
          class="clr-validate-icon"
          status="danger"
          shape="exclamation-circle"
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
  providers: [IfControlStateService, NgControlService, ControlIdService, ControlClassService, ClrDestroyService],
})
export class ClrSelectContainer extends ClrAbstractContainer {
  @ContentChild(SelectMultipleControlValueAccessor, { static: false })
  multiple: SelectMultipleControlValueAccessor;
  private multi = false;

  constructor(
    @Optional() protected override layoutService: LayoutService,
    protected override controlClassService: ControlClassService,
    protected override ngControlService: NgControlService,
    protected override ifControlStateService: IfControlStateService,
    private destroy$: ClrDestroyService
  ) {
    super(ifControlStateService, layoutService, controlClassService, ngControlService, destroy$);
  }

  ngOnInit() {
    this.ngControlService.controlChanges.pipe(takeUntil(this.destroy$)).subscribe(control => {
      if (control) {
        this.multi = control.valueAccessor instanceof SelectMultipleControlValueAccessor;
        this.control = control;
      }
    });
  }

  wrapperClass() {
    return this.multi ? 'clr-multiselect-wrapper' : 'clr-select-wrapper';
  }
}
