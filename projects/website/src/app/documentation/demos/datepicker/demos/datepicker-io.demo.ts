/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAlertModule } from '@clr/angular';

import { DatepickerDateIODemo } from './datepicker-date-io.demo';
import { DatepickerReactiveFormsDemo } from './datepicker-reactive-forms';
import { DatepickerTemplateDrivenFormsDemo } from './datepicker-template-driven-forms';

@Component({
  selector: 'clr-datepicker-io-demo',
  templateUrl: './datepicker-io.demo.html',
  imports: [DatepickerDateIODemo, DatepickerTemplateDrivenFormsDemo, DatepickerReactiveFormsDemo, ClrAlertModule],
})
export class DatepickerIODemo {}
