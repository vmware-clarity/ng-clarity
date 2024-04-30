/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Optional } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';

@Directive({
  selector: '[clrDate], [clrRangeStartDate], [clrRangeEndDate]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ClrDateInputValidator, multi: true }],
})
export class ClrDateInputValidator implements Validator {
  constructor(@Optional() private dateIOService: DateIOService, private dateNavigationService: DateNavigationService) {}

  validate(control: AbstractControl): ValidationErrors {
    if (this.dateIOService) {
      const value = this.dateIOService.getDateValueFromDateString(control.value);
      const minDate = this.dateIOService.disabledDates.minDate.toDate();
      const maxDate = this.dateIOService.disabledDates.maxDate.toDate();
      if (value && value < this.dateIOService.disabledDates.minDate.toDate()) {
        return { min: { min: minDate.toLocaleDateString(), actual: value.toLocaleDateString() } };
      } else if (value && value > this.dateIOService.disabledDates.maxDate.toDate()) {
        return { max: { max: maxDate.toLocaleDateString(), actual: value.toLocaleDateString() } };
      } else if (
        this.dateNavigationService.isRangePicker &&
        this.dateNavigationService.selectedDay &&
        this.dateNavigationService.selectedEndDay &&
        this.dateNavigationService.selectedDay.toDate() > this.dateNavigationService.selectedEndDay.toDate()
      ) {
        return { range: { range: true } };
      }
    }

    return null;
  }
}

@Directive({
  selector: '[clrRangeStartDate]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ClrDateRangeStartInputValidator, multi: true }],
})
export class ClrDateRangeStartInputValidator implements Validator {
  constructor(@Optional() private dateIOService: DateIOService, private dateNavigationService: DateNavigationService) {}

  validate(control: AbstractControl): ValidationErrors {
    if (this.dateIOService) {
      const value = this.dateIOService.getDateValueFromDateString(control.value);
      if (
        value &&
        this.dateNavigationService.selectedEndDay &&
        value > this.dateNavigationService.selectedEndDay.toDate()
      ) {
        return { range: { range: true } };
      }
    }

    return null;
  }
}

@Directive({
  selector: '[clrRangeEndDate]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ClrDateRangeEndInputValidator, multi: true }],
})
export class ClrDateRangeEndInputValidator implements Validator {
  constructor(@Optional() private dateIOService: DateIOService, private dateNavigationService: DateNavigationService) {}

  validate(control: AbstractControl): ValidationErrors {
    if (this.dateIOService) {
      const value = this.dateIOService.getDateValueFromDateString(control.value);
      if (value && this.dateNavigationService.selectedDay && value < this.dateNavigationService.selectedDay.toDate()) {
        return { range: { range: true } };
      }
    }

    return null;
  }
}
