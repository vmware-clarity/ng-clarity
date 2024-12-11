/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Directive, HostListener, Optional } from '@angular/core';

import { DatePickerHelperService } from './providers/datepicker-helper.service';

@Component({
  selector: 'clr-datepicker-actions',
  template: ` <ng-content></ng-content> `,
  host: {
    '[class.datepicker-actions]': 'true',
  },
})
export class ClrDatepickerActions {}

@Directive({
  selector: '[clrDatepickerApplyAction]',
  host: {
    '[class.btn]': 'true',
    '[class.btn-primary]': 'true',
  },
})
export class ClrDatepickerApplyAction {
  constructor(@Optional() private datePickerHelperService: DatePickerHelperService) {}

  @HostListener('click')
  onClick() {
    this.datePickerHelperService?.persistSelectedDates();
  }
}

@Directive({
  selector: '[clrDatepickerCancelAction]',
  host: {
    '[class.btn]': 'true',
    '[class.btn-outline]': 'true',
  },
})
export class ClrDatepickerCancelAction {
  constructor(@Optional() private datePickerHelperService: DatePickerHelperService) {}

  @HostListener('click')
  onClick() {
    this.datePickerHelperService?.closeDatePicker();
  }
}
