/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
import {
  ClrAbstractContainer,
  ClrControlLabel,
  ContainerIdService,
  ControlClassService,
  LayoutService,
  NgControlService,
} from '@clr/angular/forms/common';
import { uniqueIdFactory } from '@clr/angular/utils';

import { ClrRadio } from './radio';

@Component({
  selector: 'clr-radio-container',
  template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [class.clr-control-inline]="clrInline" [ngClass]="controlClass()">
      <ng-content select="clr-radio-wrapper"></ng-content>
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
    '[attr.role]': 'role',
    '[attr.aria-labelledby]': 'ariaLabelledBy',
  },
  providers: [NgControlService, ControlClassService, ContainerIdService],
  standalone: false,
})
export class ClrRadioContainer extends ClrAbstractContainer implements AfterContentInit {
  role: string;
  ariaLabelledBy: string;

  @ContentChildren(ClrRadio, { descendants: true }) radios: QueryList<ClrRadio>;
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

  ngAfterContentInit() {
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
