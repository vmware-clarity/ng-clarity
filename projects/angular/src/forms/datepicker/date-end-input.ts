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
  selector: '[clrEndDate]',
  host: {
    '[class.clr-input]': 'true',
    '[class.clr-date-end-input]': 'true',
  },
  providers: [DatepickerFocusService],
  standalone: false,
})
export class ClrEndDateInput extends ClrDateInputBase {
  @Output('clrEndDateChange') override dateChange = new EventEmitter<Date>(false);

  @Input('inputWidth') inputWidth = 13;

  @Input('clrEndDate')
  set date(date: Date | string) {
    this.setDate(date);
  }

  @HostBinding('attr.size')
  get inputSize() {
    return this.inputWidth;
  }

  protected override get userSelectedDayChange() {
    return this.dateNavigationService.selectedEndDayChange;
  }

  ngOnInit() {
    this.subscriptions.push(this.dateIOService.maxDateChange.subscribe(() => this.triggerControlInputValidation()));
  }

  protected override updateDayModel(dayModel: DayModel) {
    this.dateNavigationService.persistedEndDate = this.dateNavigationService.selectedEndDay = dayModel;
  }
}
