/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  inject,
  Input,
  Optional,
  QueryList,
} from '@angular/core';
import {
  ClrAbstractContainer,
  ContainerIdService,
  ControlClassService,
  LayoutService,
  NgControlService,
} from '@clr/angular/forms/common';
import { clrHasRequiredValidator, ClrHostAttribute, uniqueIdFactory } from '@clr/angular/utils';

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
      @if (showHelper) {
        <div class="clr-subtext-wrapper">
          <ng-content select="clr-control-helper"></ng-content>
        </div>
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
    '[attr.role]': 'role',
    '[attr.aria-labelledby]': 'ariaLabelledBy',
    '[attr.aria-required]': 'ariaRequired',
    '[attr.aria-invalid]': 'ariaInvalid',
  },
  providers: [NgControlService, ControlClassService, ContainerIdService],
  standalone: false,
})
export class ClrRadioContainer extends ClrAbstractContainer implements AfterContentInit {
  role: string;
  ariaLabelledBy: string;

  @ContentChildren(ClrRadio, { descendants: true }) radios: QueryList<ClrRadio>;

  private inline = false;
  private _generatedId = uniqueIdFactory();
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  // What the application writes or binds on the group itself is kept: see ClrHostAttribute.
  private readonly ariaRequiredAttribute = new ClrHostAttribute(this.host, 'aria-required');
  private readonly ariaInvalidAttribute = new ClrHostAttribute(this.host, 'aria-invalid');

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

  /**
   * The group's requirement and validity, reported once on the `radiogroup` — which is
   * where ARIA puts them — rather than on each radio, all of which share one control.
   */
  protected get ariaRequired(): string | null {
    return this.ariaRequiredAttribute.value(!!this.role && clrHasRequiredValidator(this.control?.control));
  }

  /**
   * Whether the group's choice is invalid, once the user has had a chance to make one:
   * touched, the same rule as every other wrapped control, whether or not an error
   * message is projected.
   */
  protected get ariaInvalid(): string | null {
    return this.ariaInvalidAttribute.value(!!this.role && !!this.control?.invalid && !!this.control?.touched);
  }

  ngAfterContentInit() {
    this.setAriaRoles();
    this.setAriaLabelledBy();
  }

  private setAriaRoles() {
    this.role = this.radios.length ? 'radiogroup' : null;
  }

  private setAriaLabelledBy() {
    if (this.label && !this.label.idAttr) {
      this.label.idAttr = this._generatedId;
    }

    this.ariaLabelledBy = this.radios?.length && this.label ? this.label.idAttr : null;
  }
}
