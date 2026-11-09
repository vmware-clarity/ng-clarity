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
import { Component, LOCALE_ID, inject } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ClrLocaleDateFormat } from '@clr/angular';

// Flags text that is not a valid date, which the date picker does not do by itself.
export function validDate(dateFormat: ClrLocaleDateFormat): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    control.value && !dateFormat.parse(control.value) ? { date: true } : null;
}

@Component({/* ... */})
export class MyComponent {
  // One instance per component, created where inject() is available.
  private readonly dateFormat = new ClrLocaleDateFormat(inject(LOCALE_ID));

  readonly start = new FormControl('', [validDate(this.dateFormat)]);

  get startDate(): Date | null {
    return this.dateFormat.parse(this.start.value ?? ''); // e.g. '01/31/2025' (en-US) -> 31 January 2025
  }

  setStart(date: Date): void {
    this.start.setValue(this.dateFormat.format(date)); // '01/31/2025' for en-US, '31/01/2025' for fr
  }
}
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
