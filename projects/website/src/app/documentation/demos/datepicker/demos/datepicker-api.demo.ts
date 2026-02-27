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

import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';

const BASIC_EXAMPLE = `
<form clrForm>
  <clr-date-container>
    <label>Date</label>
    <input type="date" autocomplete="off" clrDate name="demo" [(ngModel)]="value" />
  </clr-date-container>
</form>
`;

const MIN_EXAMPLE = `
<form clrForm>
  <clr-date-container>
    <label>Min date: 2019-11-17</label>
    <input type="date" autocomplete="off" clrDate name="minDemo" [(ngModel)]="value" min="2019-11-17" />
    <clr-control-error *clrIfError="'min'">Error message about min date</clr-control-error>
  </clr-date-container>
</form>
`;

const MAX_EXAMPLE = `
<form clrForm>
  <clr-date-container>
    <label>Max date: 2019-11-19</label>
    <input type="date" autocomplete="off" clrDate name="maxDemo" [(ngModel)]="value" max="2019-11-19" />
    <clr-control-error *clrIfError="'max'">Error message about max date</clr-control-error>
  </clr-date-container>
</form>
`;

const MIN_MAX_EXAMPLE = `
<form clrForm>
  <clr-date-container>
    <label>Min date: 2019-11-17 AND Max date: 2019-11-19</label>
    <input
      type="date"
      autocomplete="off"
      clrDate
      name="minMaxDemo"
      [(ngModel)]="value"
      min="2019-11-17"
      max="2019-11-19"
    />
    <clr-control-error *clrIfError="'min'">Error message about min date</clr-control-error>
    <clr-control-error *clrIfError="'max'">Error message about max date</clr-control-error>
  </clr-date-container>
</form>
`;

const WITH_ACTION_BUTTONS_EXAMPLE = `
<form clrForm>
  <clr-date-container [showActionButtons]="true">
    <label>Date</label>
    <input type="date" autocomplete="off" clrDate name="withActionButtons" [(ngModel)]="value" />
  </clr-date-container>
</form>
`;

const COMMON_EXAMPLE_TS = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [FormsModule, ClrFormsModule],
})
export class ExampleComponent {
  value: string | undefined;
}
`;

@Component({
  selector: 'clr-datepicker-api-demo',
  templateUrl: './datepicker-api.demo.html',
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
export class DatepickerAPIDemo {
  basicExample = BASIC_EXAMPLE;
  basicExampleTs = COMMON_EXAMPLE_TS;

  minExample = MIN_EXAMPLE;
  minExampleTs = COMMON_EXAMPLE_TS;

  maxExample = MAX_EXAMPLE;
  maxExampleTs = COMMON_EXAMPLE_TS;

  minMaxExample = MIN_MAX_EXAMPLE;
  minMaxExampleTs = COMMON_EXAMPLE_TS;

  withActionButtonsExample = WITH_ACTION_BUTTONS_EXAMPLE;
  withActionButtonsExampleTs = COMMON_EXAMPLE_TS;

  demo: string | undefined;
  minDemo: string | undefined;
  maxDemo: string | undefined;
  minMaxDemo: string | undefined;
  actionButtonsDemo: string | undefined;
}
