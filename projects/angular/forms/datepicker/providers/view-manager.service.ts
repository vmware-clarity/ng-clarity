/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, signal } from '@angular/core';
import { ClrPopoverPosition } from '@clr/angular/popover/common';

const enum DatepickerViewEnum {
  MONTHVIEW = 'MONTHVIEW',
  YEARVIEW = 'YEARVIEW',
  DAYVIEW = 'DAYVIEW',
}

/**
 * This service manages which view is visible in the datepicker popover.
 */
@Injectable()
export class ViewManagerService {
  private readonly _position = signal(ClrPopoverPosition.BOTTOM_LEFT);
  private readonly _currentView = signal(DatepickerViewEnum.DAYVIEW);

  get position(): ClrPopoverPosition {
    return this._position();
  }
  set position(value: ClrPopoverPosition) {
    this._position.set(value);
  }

  get isDayView(): boolean {
    return this._currentView() === DatepickerViewEnum.DAYVIEW;
  }

  get isYearView(): boolean {
    return this._currentView() === DatepickerViewEnum.YEARVIEW;
  }

  get isMonthView(): boolean {
    return this._currentView() === DatepickerViewEnum.MONTHVIEW;
  }

  changeToMonthView(): void {
    this._currentView.set(DatepickerViewEnum.MONTHVIEW);
  }

  changeToYearView(): void {
    this._currentView.set(DatepickerViewEnum.YEARVIEW);
  }

  changeToDayView(): void {
    this._currentView.set(DatepickerViewEnum.DAYVIEW);
  }
}
