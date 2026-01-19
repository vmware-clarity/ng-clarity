/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
  forwardRef,
  Input,
  Optional,
  QueryList,
} from '@angular/core';

import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrControlLabel } from '../common';
import { ClrRadio } from './radio';
import { ClrAbstractContainer } from '../common/abstract-container';
import { ContainerIdService } from '../common/providers/container-id.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';

@Component({
  selector: 'clr-radio-container',
  template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [class.clr-control-inline]="clrInline" [ngClass]="controlClass()">
      <ng-content select="clr-radio-wrapper"></ng-content>
      @if (showHelper) {
        <div class="clr-subtext-wrapper">
          <ng-content select="clr-control-helper"></ng-content>
        </div>
      }
      @if (showValid || showInvalid) {
        <div class="clr-subtext-wrapper">
          @if (showInvalid) {
            <cds-icon
              class="clr-validate-icon"
              shape="exclamation-circle"
              status="danger"
              aria-hidden="true"
            ></cds-icon>
          }
          @if (showValid) {
            <cds-icon class="clr-validate-icon" shape="check-circle" status="success" aria-hidden="true"></cds-icon>
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
    '[attr.role]': 'role',
    '[attr.aria-labelledby]': 'ariaLabelledBy',
  },
  providers: [NgControlService, ControlClassService, ContainerIdService],
  standalone: false,
})
export class ClrRadioContainer extends ClrAbstractContainer implements AfterContentInit {
  role: string;
  ariaLabelledBy: string;

  @ContentChildren(forwardRef(() => ClrRadio), { descendants: true }) radios: QueryList<ClrRadio>;
  @ContentChild(ClrControlLabel, { read: ElementRef, static: true }) groupLabel: ElementRef<HTMLElement>;

  private inline = false;
  private _generatedId = uniqueIdFactory();

  constructor(
    @Optional() protected override layoutService: LayoutService,
    protected override controlClassService: ControlClassService,
    protected override ngControlService: NgControlService
  ) {
    super(layoutService, controlClassService, ngControlService);
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
