/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrAlertModule,
  ClrCommonFormsModule,
  ClrDatepickerModule,
  ClrPopoverHostDirective,
  ClrStopEscapePropagationDirective,
} from '@clr/angular';
import { DateRangeOption } from '@clr/angular/forms/datepicker/interfaces/date-range.interface';

import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';

const BASIC_EXAMPLE = `
<form clrForm>
  <clr-date-range-container>
    <label>Date Range</label>
    <input type="date" autocomplete="off" clrStartDate name="startDate" [(ngModel)]="startDate" />
    <input type="date" autocomplete="off" clrEndDate name="endDate" [(ngModel)]="endDate" />
  </clr-date-range-container>
</form>
`;

const MIN_EXAMPLE = `
<form clrForm>
  <clr-date-range-container min="2025-01-01">
    <label>Min date: 2025-01-01</label>
    <input type="date" autocomplete="off" clrStartDate name="startDate" [(ngModel)]="startDate" />
    <input type="date" autocomplete="off" clrEndDate name="endDate" [(ngModel)]="endDate" />
    <clr-control-error *clrIfError="'min'">Error message about min date</clr-control-error>
  </clr-date-range-container>
</form>
`;

const MAX_EXAMPLE = `
<form clrForm>
  <clr-date-range-container max="2025-12-31">
    <label>Max date: 2025-12-31</label>
    <input type="date" autocomplete="off" clrStartDate name="startDate" [(ngModel)]="startDate" />
    <input type="date" autocomplete="off" clrEndDate name="endDate" [(ngModel)]="endDate" />
    <clr-control-error *clrIfError="'max'">Error message about max date</clr-control-error>
  </clr-date-range-container>
</form>
`;

const MIN_MAX_EXAMPLE = `
<form clrForm>
  <clr-date-range-container min="2025-01-01" max="2025-12-31">
    <label>Min date: 2025-01-01 AND Max date: 2025-12-31</label>
    <input type="date" autocomplete="off" clrStartDate name="startDate" [(ngModel)]="startDate" />
    <input type="date" autocomplete="off" clrEndDate name="endDate" [(ngModel)]="endDate" />
    <clr-control-error *clrIfError="'min'">Error message about min date</clr-control-error>
    <clr-control-error *clrIfError="'max'">Error message about max date</clr-control-error>
  </clr-date-range-container>
</form>
`;

const COMMON_EXAMPLE_TS = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrFormsModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [FormsModule, ClrFormsModule],
})
export class ExampleComponent {
  startDate: string | undefined;
  endDate: string | undefined;
}
`;

const PREDEFINED_RANGE_OPTIONS = `
<form clrForm>
  <clr-date-range-container [rangeOptions]="dateRangeOptions">
    <label>Predefined Range Options</label>
    <input type="date" autocomplete="off" clrStartDate name="startDate" [(ngModel)]="startDate" />
    <input type="date" autocomplete="off" clrEndDate name="endDate" [(ngModel)]="endDate" />
    <clr-control-error *clrIfError="'min'">Error message about min date</clr-control-error>
    <clr-control-error *clrIfError="'max'">Error message about max date</clr-control-error>
  </clr-date-range-container>
</form>
`;

const PREDEFINED_RANGE_OPTIONS_TS = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateRangeOption } from '@clr/angular/forms/datepicker/interfaces/date-range.interface';
import { ClrFormsModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [FormsModule, ClrFormsModule],
})
export class ExampleComponent {
  startDate: string | undefined;
  endDate: string | undefined;

  dateRangeOptions: DateRangeOption[] = [
    { label: 'Today', value: [new Date(), new Date()] },
    { label: 'Last 7 Days', value: [this.addDays(new Date(), -7), this.addDays(new Date(), -1)] },
    { label: 'Last 14 Days', value: [this.addDays(new Date(), -14), this.addDays(new Date(), -1)] },
    { label: 'Last 30 Days', value: [this.addDays(new Date(), -30), this.addDays(new Date(), -1)] },
    { label: 'Last 90 Days', value: [this.addDays(new Date(), -90), this.addDays(new Date(), -1)] },
  ];

  addDays(date = new Date(), days: number) {
    return new Date(date.getTime() + 86400000 * days);
  }
}
`;

@Component({
  selector: 'clr-datepicker-api-demo',
  templateUrl: './date-range-picker-api.demo.html',
  imports: [
    FormsModule,
    ClrCommonFormsModule,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ClrDatepickerModule,
    StackblitzExampleComponent,
    ClrAlertModule,
  ],
})
export class DateRangePickerAPIDemo {
  basicExample = BASIC_EXAMPLE;
  basicExampleTs = COMMON_EXAMPLE_TS;

  minExample = MIN_EXAMPLE;
  minExampleTs = COMMON_EXAMPLE_TS;

  maxExample = MAX_EXAMPLE;
  maxExampleTs = COMMON_EXAMPLE_TS;

  minMaxExample = MIN_MAX_EXAMPLE;
  minMaxExampleTs = COMMON_EXAMPLE_TS;

  predefinedRangeOptionsExample = PREDEFINED_RANGE_OPTIONS;
  predefinedRangeOptionsExampleTs = PREDEFINED_RANGE_OPTIONS_TS;

  startDateBasicDemo: string | undefined;
  endDateBasicDemo: string | undefined;
  startDateMinDemo: string | undefined;
  endDateMinDemo: string | undefined;
  startDateMaxDemo: string | undefined;
  endDateMaxDemo: string | undefined;
  startDateMinMaxDemo: string | undefined;
  endDateMinMaxDemo: string | undefined;
  startDateRangeDemo: string | undefined;
  endDateRangeDemo: string | undefined;

  dateRangeOptions: DateRangeOption[] = [
    { label: 'Today', value: [new Date(), new Date()] },
    { label: 'Last 7 Days', value: [this.addDays(new Date(), -7), this.addDays(new Date(), -1)] },
    { label: 'Last 14 Days', value: [this.addDays(new Date(), -14), this.addDays(new Date(), -1)] },
    { label: 'Last 30 Days', value: [this.addDays(new Date(), -30), this.addDays(new Date(), -1)] },
    { label: 'Last 90 Days', value: [this.addDays(new Date(), -90), this.addDays(new Date(), -1)] },
  ];

  addDays(date = new Date(), days: number) {
    return new Date(date.getTime() + 86400000 * days);
  }
}
