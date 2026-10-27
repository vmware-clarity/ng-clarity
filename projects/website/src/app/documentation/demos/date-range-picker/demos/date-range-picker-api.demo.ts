/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAlertModule } from '@clr/angular';
import { DATE_RANGE_PICKER_EXAMPLES } from '@clr/examples/date-range-picker';

import { DocExampleComponent } from '../../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-datepicker-api-demo',
  templateUrl: './date-range-picker-api.demo.html',
  imports: [ClrAlertModule, DocExampleComponent],
})
export class DateRangePickerAPIDemo {
  readonly examples = DATE_RANGE_PICKER_EXAMPLES;
}
