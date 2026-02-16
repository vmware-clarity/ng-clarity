/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Component } from '@angular/core';

import { ClarityDocComponent } from '../clarity-doc';

registerLocaleData(localeFr);

@Component({
  selector: 'clr-date-range-picker-demo',
  templateUrl: './date-range-picker.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
})
export class DateRangePickerDemo extends ClarityDocComponent {
  expanded = true;

  constructor() {
    super('date-range-picker');
  }
}
