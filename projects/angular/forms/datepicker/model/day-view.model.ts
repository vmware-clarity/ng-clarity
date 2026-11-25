/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { signal } from '@angular/core';

import { DayModel } from './day.model';

export class DayViewModel {
  // The calendar moves selection and focus between days without creating new day views,
  // so these two flags are signals: the day view that renders them refreshes when they change.
  private readonly _isSelected = signal(false);
  private readonly _isFocusable = signal(false);

  constructor(
    public dayModel: DayModel,
    public isTodaysDate: boolean = false,
    public isExcluded: boolean = false,
    public isDisabled: boolean = false,
    isSelected: boolean = false,
    isFocusable: boolean = false,
    public isRangeStartDay: boolean = false,
    public isRangeEndDay: boolean = false
  ) {
    this.isSelected = isSelected;
    this.isFocusable = isFocusable;
  }

  get isSelected(): boolean {
    return this._isSelected();
  }
  set isSelected(value: boolean) {
    this._isSelected.set(value);
  }

  get isFocusable(): boolean {
    return this._isFocusable();
  }
  set isFocusable(value: boolean) {
    this._isFocusable.set(value);
  }

  /**
   * Gets the tab index based on the isFocusable flag.
   */
  get tabIndex(): number {
    return this.isFocusable ? 0 : -1;
  }
}
