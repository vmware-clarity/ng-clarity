/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrAlertModule,
  ClrCommonFormsModule,
  ClrDatepickerModule,
  ClrPopoverHostDirective,
  ClrStopEscapePropagationDirective,
} from '@clr/angular';

import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';

const HTML_EXAMPLE = `
<form clrForm clrLayout="vertical">
  <clr-date-container>
    <label>Date Object</label>
    <input type="date" autocomplete="off" [(clrDate)]="date" />
  </clr-date-container>
</form>
<pre>{{ date | json }}</pre>
`;

const TS_EXAMPLE = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ClrFormsModule],
})
export class ExampleComponent {
  date = new Date();
}
`;

@Component({
  selector: 'clr-datepicker-date-io-demo',
  templateUrl: './datepicker-date-io.demo.html',
  imports: [
    ClrAlertModule,
    FormsModule,
    ClrCommonFormsModule,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ClrDatepickerModule,
    StackblitzExampleComponent,
    JsonPipe,
  ],
})
export class DatepickerDateIODemo {
  date: Date = new Date('2023-06-30 12:00');

  htmlExample = HTML_EXAMPLE;
  tsExample = TS_EXAMPLE;
}
