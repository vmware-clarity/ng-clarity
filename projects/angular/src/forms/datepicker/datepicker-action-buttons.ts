/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Directive, HostBinding, HostListener, Optional } from '@angular/core';

import { DatePickerHelperService } from './providers/datepicker-helper.service';

@Component({
  selector: 'clr-datepicker-actions',
  template: `
    <div class="action-buttons">
      <ng-content></ng-content>
    </div>
  `,
})
export class ClrDatepickerActions {}

@Directive({
  selector: '[clrDatepickerApplyAction]',
})
export class ClrDatepickerApplyAction {
  @HostBinding('class') className = 'btn btn-primary';

  constructor(@Optional() private datePickerHelperService: DatePickerHelperService) {}

  @HostListener('click')
  onClick() {
    this.datePickerHelperService?.persistSelectedDates();
  }
}

@Directive({
  selector: '[clrDatepickerCancelAction]',
})
export class ClrDatepickerCancelAction {
  @HostBinding('class') className = 'btn btn-outline';

  constructor(@Optional() private datePickerHelperService: DatePickerHelperService) {}

  @HostListener('click')
  onClick() {
    this.datePickerHelperService?.closeDatePicker();
  }
}
