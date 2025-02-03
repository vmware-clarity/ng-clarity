/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, EventEmitter, HostBinding, Input, Output } from '@angular/core';

import { ClrDateInputBase } from './date-input';
import { DayModel } from './model/day.model';
import { DatepickerFocusService } from './providers/datepicker-focus.service';

@Directive({
  selector: '[clrStartDate]',
  host: {
    '[class.clr-input]': 'true',
    '[style.text-align]': "'right'",
  },
  providers: [DatepickerFocusService],
})
export class ClrStartDateInput extends ClrDateInputBase {
  @Output('clrStartDateChange') override dateChange = new EventEmitter<Date>(false);

  @Input('inputWidth') inputWidth = 13;

  @Input('clrStartDate')
  set date(date: Date | string) {
    this.setDate(date);
  }

  @HostBinding('attr.size')
  get inputSize() {
    return this.inputWidth;
  }

  protected override get userSelectedDayChange() {
    return this.dateNavigationService.selectedDayChange;
  }

  triggerControlInputValidation() {
    if (this.datepickerHasFormControl()) {
      this.control.control?.updateValueAndValidity({ emitEvent: false });
      this.control.control?.setErrors(this.control.control.errors);
    }
  }

  protected override updateDayModel(dayModel: DayModel) {
    this.dateNavigationService.persistedDate = this.dateNavigationService.selectedDay = dayModel;
  }
}
