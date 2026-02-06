/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Optional } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';

@Directive({
  selector: '[clrDate], [clrStartDate], [clrEndDate]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ClrDateInputValidator, multi: true }],
  standalone: false,
})
export class ClrDateInputValidator implements Validator {
  constructor(@Optional() private dateIOService: DateIOService) {}

  validate(control: AbstractControl): ValidationErrors {
    if (this.dateIOService) {
      const value = this.dateIOService.getDateValueFromDateString(control.value);
      const minDate = this.dateIOService.disabledDates.minDate.toDate();
      const maxDate = this.dateIOService.disabledDates.maxDate.toDate();

      if (value && value < minDate) {
        return { min: { min: minDate.toLocaleDateString(), actual: value.toLocaleDateString() } };
      } else if (value && value > maxDate) {
        return { max: { max: maxDate.toLocaleDateString(), actual: value.toLocaleDateString() } };
      }
    }

    return null;
  }
}

@Directive({
  selector: '[clrStartDate]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ClrStartDateInputValidator, multi: true }],
  standalone: false,
})
export class ClrStartDateInputValidator implements Validator {
  constructor(
    @Optional() private dateIOService: DateIOService,
    @Optional() private dateNavigationService: DateNavigationService
  ) {}

  validate(control: AbstractControl): ValidationErrors {
    if (this.dateIOService) {
      const value = this.dateIOService.getDateValueFromDateString(control.value);
      const endDate = this.dateNavigationService?.selectedEndDay?.toDate();

      if (value && endDate && value > endDate) {
        return { range: { startDate: value, endDate } };
      }
    }

    return null;
  }
}

@Directive({
  selector: '[clrEndDate]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ClrEndDateInputValidator, multi: true }],
  standalone: false,
})
export class ClrEndDateInputValidator implements Validator {
  constructor(
    @Optional() private dateIOService: DateIOService,
    @Optional() private dateNavigationService: DateNavigationService
  ) {}

  validate(control: AbstractControl): ValidationErrors {
    if (this.dateIOService) {
      const value = this.dateIOService.getDateValueFromDateString(control.value);
      const startDate = this.dateNavigationService?.selectedDay?.toDate();

      if (value && startDate && value < startDate) {
        return { range: { startDate, endDate: value } };
      }
    }

    return null;
  }
}
