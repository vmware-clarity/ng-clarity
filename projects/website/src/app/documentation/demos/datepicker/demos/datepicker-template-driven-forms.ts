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
  ClrCommonFormsModule,
  ClrDatepickerModule,
  ClrPopoverHostDirective,
  ClrStopEscapePropagationDirective,
} from '@clr/angular';

import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';

const HTML_EXAMPLE = `
<form clrForm #simpleForm="ngForm">
  <clr-date-container>
    <label>Enter Date</label>
    <input type="date" autocomplete="off" name="date" [(ngModel)]="date" clrDate />
  </clr-date-container>
</form>
<pre>{{ simpleForm.value | json }}</pre>
`;

const TS_EXAMPLE = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, FormsModule, ClrFormsModule],
})
export class ExampleComponent {
  date: string = '01/02/2015';
}
`;

@Component({
  selector: 'clr-datepicker-template-driven-forms-demo',
  templateUrl: './datepicker-template-driven-forms.html',
  imports: [
    FormsModule,
    ClrCommonFormsModule,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ClrDatepickerModule,
    StackblitzExampleComponent,
    JsonPipe,
  ],
})
export class DatepickerTemplateDrivenFormsDemo {
  date = '01/02/2015';

  htmlExample = HTML_EXAMPLE;
  tsExample = TS_EXAMPLE;
}
