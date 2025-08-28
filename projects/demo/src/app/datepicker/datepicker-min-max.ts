/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'clr-datepicker-min-max-demo',
  templateUrl: './datepicker-min-max.html',
  styleUrls: ['./datepicker.demo.scss'],
  standalone: false,
})
export class DatepickerMinMaxDemo {
  minDate = '2017-04-01';
  maxDate = '2017-04-30';
  model = '04/15/2017';
  reactiveDateForm = new FormGroup({ date: new FormControl('04/15/2017') });

  toggleMaxDate() {
    if (this.maxDate) {
      this.maxDate = null;
    } else {
      this.maxDate = '2019-11-19';
    }
  }

  toggleMinDate() {
    if (this.minDate) {
      this.minDate = null;
    } else {
      this.minDate = '2019-11-17';
    }
  }
}
