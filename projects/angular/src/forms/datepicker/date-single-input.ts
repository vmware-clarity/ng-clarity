/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
    '[class.clr-date-input]': 'true',
  },
  providers: [DatepickerFocusService],
  standalone: false,
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
  }

  @Input()
  set max(dateString: string) {
    this.dateIOService.setMaxDate(dateString);
  }

  protected override get userSelectedDayChange() {
    return this.dateNavigationService.selectedDayChange;
  }

  protected override updateDayModel(dayModel: DayModel) {
    this.dateNavigationService.persistedDate = this.dateNavigationService.selectedDay = dayModel;
  }
}
