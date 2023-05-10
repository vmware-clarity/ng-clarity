/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, HostBinding, Input } from '@angular/core';

import { isBooleanAttributeSet } from '../../utils/component/is-boolean-attribute-set';

@Component({
  selector: 'clr-progress-bar',
  template: `
    <progress [id]="id" [attr.max]="max" [attr.value]="value" [attr.data-displayval]="displayValue"></progress>
    <span *ngIf="displayStringValue()">{{ displayValue }}</span>
  `,
})
export class ClrProgressBar {
  @Input('clrMax') max: number | string = 100;
  @Input('clrDisplayval') displayval: string;

  /*
   * No need to convert to `number` cause we could have
   * floating point and parseInt will round the numbers
   *
   * working with string won't have any side-effects,
   * we don't do any math so string will do the job.
   */
  @Input('clrValue') value: number | string = 0;

  @HostBinding('attr.id') externalId = '';

  private _ID: string;
  private _labeled: boolean;
  private _fade: boolean;
  private _loop: boolean;
  private _success: boolean;
  private _danger: boolean;
  private _flash: boolean;
  private _flashDanger: boolean;

  @Input()
  get id() {
    return this._ID;
  }
  set id(value: string) {
    this._ID = value;
    this.externalId = null;
  }

  @HostBinding('class.progress')
  get progressClass() {
    return true;
  }

  @Input('clrLabeled')
  set clrLabeled(value: boolean | string) {
    this._labeled = isBooleanAttributeSet(value);
  }

  @HostBinding('class.labeled')
  get labeledClass() {
    return this._labeled;
  }

  @Input('clrFade')
  set clrFade(value: boolean | string) {
    this._fade = isBooleanAttributeSet(value);
  }

  @HostBinding('class.progress-fade')
  get fadeClass() {
    return this._fade;
  }

  @Input('clrLoop')
  set clrLoop(value: boolean | string) {
    this._loop = isBooleanAttributeSet(value);
  }

  @HostBinding('class.loop')
  get loopClass() {
    return this._loop;
  }

  /** @deprecated since 2.0, remove in 4.0 */
  @Input('clrSuccess')
  set clrSuccess(value: boolean | string) {
    this._success = isBooleanAttributeSet(value);
  }

  @HostBinding('class.success')
  get successClass() {
    return this._success;
  }

  /** @deprecated since 2.0, remove in 4.0 */
  @Input('clrDanger')
  set clrDanger(value: boolean | string) {
    this._danger = isBooleanAttributeSet(value);
  }

  @HostBinding('class.danger')
  get dangerClass() {
    return this._danger;
  }

  @Input('clrFlash')
  set clrFlash(value: boolean | string) {
    this._flash = isBooleanAttributeSet(value);
  }

  @HostBinding('class.flash')
  get flashClass() {
    return this._flash;
  }

  /** @deprecated since 2.0, remove in 4.0 */
  @Input('clrFlashDanger')
  set clrFlashDanger(value: boolean | string) {
    this._flashDanger = isBooleanAttributeSet(value);
  }

  @HostBinding('class.flash-danger')
  get flashDangerClass() {
    return this._flashDanger;
  }

  /**
   * Make sure that we always will have something that is readable
   * for the screen reader
   */
  get displayValue() {
    if (this.displayval) {
      return this.displayval;
    }
    return `${this.value || 0}%`;
  }

  /**
   * Display optional text only when labeled is eneabled
   */
  displayStringValue() {
    return this._labeled;
  }
}
