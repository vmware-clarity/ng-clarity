/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  Input,
  Optional,
  QueryList,
} from '@angular/core';

import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrLabel } from '../common';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ContainerIdService } from '../common/providers/container-id.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { ClrRadio } from './radio';

@Component({
  selector: 'clr-radio-container',
  template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [class.clr-control-inline]="clrInline" [ngClass]="controlClass()">
      <ng-content select="clr-radio-wrapper"></ng-content>
      <div class="clr-subtext-wrapper">
        <ng-content select="clr-control-helper" *ngIf="showHelper"></ng-content>
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
        <ng-content select="clr-control-error" *ngIf="showInvalid"></ng-content>
        <ng-content select="clr-control-success" *ngIf="showValid"></ng-content>
      </div>
    </div>
  `,
  host: {
    '[class.clr-form-control]': 'true',
    '[class.clr-form-control-disabled]': 'control?.disabled',
    '[class.clr-row]': 'addGrid()',
    '[attr.role]': 'role',
    '[attr.aria-labelledby]': 'ariaLabelledBy',
  },
  providers: [NgControlService, IfControlStateService, ControlClassService, ContainerIdService],
})
export class ClrRadioContainer extends ClrAbstractContainer implements AfterContentInit {
  role: string;
  ariaLabelledBy: string;

  @ContentChildren(ClrRadio, { descendants: true }) radios: QueryList<ClrRadio>;
  @ContentChild(ClrLabel, { read: ElementRef, static: true }) groupLabel: ElementRef<HTMLElement>;

  private inline = false;
  private _generatedId = uniqueIdFactory();

  constructor(
    @Optional() protected override layoutService: LayoutService,
    protected override controlClassService: ControlClassService,
    protected override ngControlService: NgControlService,
    protected override ifControlStateService: IfControlStateService
  ) {
    super(ifControlStateService, layoutService, controlClassService, ngControlService);
  }

  /*
   * Here we want to support the following cases
   * clrInline - true by presence
   * clrInline="true|false" - unless it is explicitly false, strings are considered true
   * [clrInline]="true|false" - expect a boolean
   */
  @Input()
  get clrInline() {
    return this.inline;
  }
  set clrInline(value: boolean | string) {
    if (typeof value === 'string') {
      this.inline = value === 'false' ? false : true;
    } else {
      this.inline = !!value;
    }
  }

  override ngAfterContentInit() {
    this.setAriaRoles();
    this.setAriaLabelledBy();
  }

  private setAriaRoles() {
    this.role = this.radios.length ? 'radiogroup' : null;
  }

  private setAriaLabelledBy() {
    const _id = this.groupLabel?.nativeElement.getAttribute('id');
    if (!_id) {
      this.groupLabel?.nativeElement.setAttribute('id', this._generatedId);
      this.ariaLabelledBy = this.radios.length ? this._generatedId : null;
    } else {
      this.ariaLabelledBy = this.radios.length ? _id : null;
    }
  }
}
