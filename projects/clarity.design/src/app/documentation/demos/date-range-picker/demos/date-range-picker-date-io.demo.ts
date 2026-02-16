/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const HTML_EXAMPLE = `
<form clrForm clrLayout="vertical">
  <clr-date-range-container>
    <label>Date Object</label>
    <input type="date" autocomplete="off" [(clrStartDate)]="startDate" />
    <input type="date" autocomplete="off" [(clrEndDate)]="endDate" />
  </clr-date-range-container>
</form>
<pre>{{ date | json }}</pre>
`;

const TS_EXAMPLE = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClrFormsModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ClrFormsModule],
})
export class ExampleComponent {
  startDate = new Date();
  endDate = new Date();
}
`;

@Component({
  selector: 'clr-date-range-picker-date-io-demo',
  templateUrl: './date-range-picker-date-io.demo.html',
  standalone: false,
})
export class DateRangePickerDateIODemo {
  startDate: Date = new Date('2025-01-06 12:00');
  endDate: Date = new Date('2025-01-24 12:00');

  htmlExample = HTML_EXAMPLE;
  tsExample = TS_EXAMPLE;
}
