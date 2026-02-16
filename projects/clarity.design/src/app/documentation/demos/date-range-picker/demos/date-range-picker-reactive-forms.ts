/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

const HTML_EXAMPLE = `
<form clrForm [formGroup]="dateForm" novalidate>
  <clr-date-range-container>
    <label>Date</label>
    <input type="date" autocomplete="off" clrStartDate formControlName="startDate" />
    <input type="date" autocomplete="off" clrEndDate formControlName="endDate" />
  </clr-date-range-container>
</form>
<pre>{{ dateForm.value | json }}</pre>
`;

const TS_EXAMPLE = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClrFormsModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ReactiveFormsModule, ClrFormsModule],
})
export class ExampleComponent {
  dateForm = new FormGroup({ startDate: new FormControl(), endDate: new FormControl() });
}
`;

@Component({
  selector: 'clr-date-range-picker-reactive-forms-demo',
  templateUrl: './date-range-picker-reactive-forms.html',
  standalone: false,
})
export class DateRangePickerReactiveFormsDemo {
  dateForm = new FormGroup({ startDate: new FormControl(), endDate: new FormControl() });

  htmlExample = HTML_EXAMPLE;
  tsExample = TS_EXAMPLE;
}
