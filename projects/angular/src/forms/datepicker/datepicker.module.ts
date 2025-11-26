/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ClrCommonFormsModule } from '@clr/angular/src/forms/common';
import {
  angleIcon,
  calendarIcon,
  checkCircleIcon,
  ClarityIcons,
  ClrIcon,
  eventIcon,
  exclamationCircleIcon,
} from '@clr/angular/src/icon';
import { ClrVerticalNavModule } from '@clr/angular/src/layout/vertical-nav';
import { ÇlrClrPopoverModuleNext } from '@clr/angular/src/popover/common';
import { CdkTrapFocusModule, ClrConditionalModule, ClrHostWrappingModule } from '@clr/angular/src/utils';

import { ClrCalendar } from './calendar';
import { ClrDateContainer } from './date-container';
import { ClrEndDateInput } from './date-end-input';
import { ClrDateInputValidator, ClrEndDateInputValidator, ClrStartDateInputValidator } from './date-input.validator';
import { ClrDateInput } from './date-single-input';
import { ClrStartDateInput } from './date-start-input';
import { ClrDatepickerActions } from './datepicker-action-buttons';
import { ClrDatepickerViewManager } from './datepicker-view-manager';
import { ClrDay } from './day';
import { ClrDaypicker } from './daypicker';
import { ClrMonthpicker } from './monthpicker';
import { ClrYearpicker } from './yearpicker';

export const CLR_DATEPICKER_DIRECTIVES: Type<any>[] = [
  ClrDateInput,
  ClrDay,
  ClrDateContainer,
  ClrDateInputValidator,
  ClrStartDateInput,
  ClrEndDateInput,
  ClrStartDateInputValidator,
  ClrEndDateInputValidator,
  ClrDatepickerViewManager,
  ClrMonthpicker,
  ClrYearpicker,
  ClrDaypicker,
  ClrCalendar,
  ClrDatepickerActions,
];

@NgModule({
  imports: [
    CommonModule,
    CdkTrapFocusModule,
    ClrHostWrappingModule,
    ClrConditionalModule,
    ÇlrClrPopoverModuleNext,
    ClrIcon,
    ClrCommonFormsModule,
    ClrVerticalNavModule,
  ],
  declarations: [CLR_DATEPICKER_DIRECTIVES],
  exports: [CLR_DATEPICKER_DIRECTIVES],
})
export class ClrDatepickerModule {
  constructor() {
    ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon, angleIcon, eventIcon, calendarIcon);
  }
}
