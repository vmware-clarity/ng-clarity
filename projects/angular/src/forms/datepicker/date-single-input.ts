/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, EventEmitter, Input, Output } from '@angular/core';

import { ClrDateInputBase } from './date-input';
import { DayModel } from './model/day.model';
import { DatepickerFocusService } from './providers/datepicker-focus.service';

@Directive({
  selector: '[clrDate]',
  host: {
    '[class.clr-input]': 'true',
  },
  providers: [DatepickerFocusService],
})
export class ClrDateInput extends ClrDateInputBase {
  @Output('clrDateChange') override dateChange = new EventEmitter<Date>(false);

  @Input('clrDate')
  set date(date: Date | string) {
    this.setDate(date);
  }

  @Input()
  set min(dateString: string) {
    this.dateIOService.setMinDate(dateString);
    this.triggerControlValidation();
  }

  @Input()
  set max(dateString: string) {
    this.dateIOService.setMaxDate(dateString);
    this.triggerControlValidation();
  }

  protected override get userSelectedDayChange() {
    return this.dateNavigationService.selectedDayChange;
  }

  protected override updateDayModel(dayModel: DayModel) {
    this.dateNavigationService.persistedDate = this.dateNavigationService.selectedDay = dayModel;
  }

  private triggerControlValidation() {
    if (this.datepickerHasFormControl()) {
      // Set `emitEvent` to false to prevent unnecessary value change event. Status change event will be emitted by `setErrors` below.
      this.control.control?.updateValueAndValidity({ emitEvent: false });
      this.control.control?.setErrors(this.control.control.errors);
    }
  }
}
