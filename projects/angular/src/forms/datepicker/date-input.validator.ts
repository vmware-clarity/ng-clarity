/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Optional } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

import { DateIOService } from './providers/date-io.service';

@Directive({
  selector: '[clrDate]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ClrDateInputValidator, multi: true }],
})
export class ClrDateInputValidator implements Validator {
  constructor(@Optional() private dateIOService: DateIOService) {}

  validate(control: AbstractControl): ValidationErrors {
    if (this.dateIOService) {
      const value = this.dateIOService.getDateValueFromDateString(control.value);
      const minDate = this.dateIOService.disabledDates.minDate.toDate();
      const maxDate = this.dateIOService.disabledDates.maxDate.toDate();

      if (value && value < this.dateIOService.disabledDates.minDate.toDate()) {
        return { min: { min: minDate.toLocaleDateString(), actual: value.toLocaleDateString() } };
      } else if (value && value > this.dateIOService.disabledDates.maxDate.toDate()) {
        return { max: { max: maxDate.toLocaleDateString(), actual: value.toLocaleDateString() } };
      }
    }

    return null;
  }
}
