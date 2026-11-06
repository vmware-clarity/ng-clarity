/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ClrAlertModule } from '@clr/angular';

import { DatepickerENUSDemo } from './datepicker-enUS.demo';
import { DatepickerFRDemo } from './datepicker-fr.demo';
import { CodeSnippetComponent } from '../../../../shared/code-snippet/code-snippet.component';

const PROVIDE_LOCALE_EXAMPLE = `
@NgModule({
  imports: [],
  declarations: [],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
})
export class Module {}
`;

const REGISTER_LOCALE_EXAMPLE = `
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);
`;

const LOCALE_DATE_FORMAT_EXAMPLE = `
import { LOCALE_ID, inject } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ClrLocaleDateFormat } from '@clr/angular';

const dateFormat = new ClrLocaleDateFormat(inject(LOCALE_ID));

dateFormat.placeholder; // 'MM/DD/YYYY' for en-US, 'DD/MM/YYYY' for fr
dateFormat.format(new Date(2025, 0, 31)); // '01/31/2025' for en-US, '31/01/2025' for fr
dateFormat.parse('01/31/2025'); // Date for 31 January 2025 (en-US), or null when not a valid day

// Flag text that is not a valid date, which the date picker does not do by itself.
const validDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null =>
  control.value && !dateFormat.parse(control.value) ? { date: true } : null;
`;

@Component({
  selector: 'clr-datepicker-internationalization-demo',
  templateUrl: './datepicker-internationalization.demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ClrAlertModule, DatepickerENUSDemo, DatepickerFRDemo, CodeSnippetComponent],
})
export class DatepickerInternationalizationDemo {
  registerLocaleExample = REGISTER_LOCALE_EXAMPLE;
  provideLocaleExample = PROVIDE_LOCALE_EXAMPLE;
  localeDateFormatExample = LOCALE_DATE_FORMAT_EXAMPLE;
}
