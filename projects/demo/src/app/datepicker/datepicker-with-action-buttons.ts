/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'clr-daterangepicker-demo',
  styleUrls: ['./datepicker.demo.scss'],
  templateUrl: './datepicker-with-action-buttons.html',
  standalone: false,
})
export class DatePickerWithActionButtonsDemo {
  dateForm = new FormGroup({
    showActionButtons: new FormControl(true),
    date: new FormControl(),
    minDate: new FormControl('2024-02-01'),
    maxDate: new FormControl('2025-12-31'),
  });
}
