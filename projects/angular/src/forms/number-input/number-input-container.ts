/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild, ElementRef, forwardRef, Optional } from '@angular/core';

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
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-number-input-wrapper">
        <div class="clr-input-group" [class.clr-focus]="focus">
          <ng-content select="[clrNumberInput]"></ng-content>
          <div class="clr-input-group-actions">
            <button
              type="button"
              class="clr-input-group-icon-action"
              (click)="stepDown($event)"
              [disabled]="control?.disabled"
            >
              <cds-icon shape="minus" size="sm"></cds-icon>
            </button>
            <div class="clr-number-input-separator"></div>
            <button
              type="button"
              class="clr-input-group-icon-action"
              (click)="stepUp($event)"
              [disabled]="control?.disabled"
            >
              <cds-icon shape="plus" size="sm"></cds-icon>
            </button>
          </div>
        </div>
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
    '[class.clr-form-control-readonly]': 'readonly',
    '[class.clr-row]': 'addGrid()',
  },
  providers: [FocusService, IfControlStateService, NgControlService, ControlIdService, ControlClassService],
})
export class ClrNumberInputContainer extends ClrAbstractContainer {
  focus = false;

  @ContentChild(forwardRef(() => ClrNumberInput), { read: ElementRef }) protected readonly input: ElementRef;

  constructor(
    public el: ElementRef,
    controlClassService: ControlClassService,
    @Optional() layoutService: LayoutService,
    ngControlService: NgControlService,
    focusService: FocusService,
    protected override ifControlStateService: IfControlStateService
  ) {
    super(ifControlStateService, layoutService, controlClassService, ngControlService);

    this.subscriptions.push(focusService.focusChange.subscribe(state => (this.focus = state)));
  }

  protected get readonly() {
    // eslint-disable-next-line eqeqeq
    return this.input?.nativeElement.getAttribute('readonly') != null;
  }

  stepUp(event): void {
    if (this.input) {
      event.preventDefault();
      this.input.nativeElement.stepUp();
      this.input.nativeElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      this.control.control.markAllAsTouched();
    }
  }

  stepDown(event): void {
    if (this.input) {
      event.preventDefault();
      this.input.nativeElement.stepDown();
      this.input.nativeElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      this.control.control.markAllAsTouched();
    }
  }
}
