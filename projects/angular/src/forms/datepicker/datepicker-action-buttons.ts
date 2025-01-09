/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Directive, HostListener } from '@angular/core';

import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { DateFormControlService } from './providers/date-form-control.service';
import { DateNavigationService } from './providers/date-navigation.service';

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
  constructor(
    private toggleService: ClrPopoverToggleService,
    private dateNavigationService: DateNavigationService,
    private dateFormControlService: DateFormControlService
  ) {}
  @HostListener('click')
  onClick() {
    if (this.dateNavigationService.selectedDay) {
      this.dateNavigationService.notifySelectedDayChanged(this.dateNavigationService.selectedDay, true);
      this.dateFormControlService.markAsDirty();
    }
    this.toggleService.open = false;
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
  constructor(private toggleService: ClrPopoverToggleService, private dateNavigationService: DateNavigationService) {}

  @HostListener('click')
  onClick() {
    this.dateNavigationService.resetSelectedDay();
    this.toggleService.open = false;
  }
}
