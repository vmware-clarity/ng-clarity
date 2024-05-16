/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'clr-datepicker-in-reactive-forms-demo',
  styleUrls: ['./datepicker.demo.scss'],
  templateUrl: './datepicker-in-reactive-forms.html',
})
export class DatepickerInReactiveForms {
  dateForm = new FormGroup({
    date: new FormControl('03/05/2018'),
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  dateChanged(date: Date) {
    console.log(date);
  }

  stDateChanged(date: Date) {
    console.log(date);
  }

  endDateChanged(date: Date) {
    console.log(date);
  }
}
