/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAlertModule } from '@clr/angular';

import { DateRangePickerENUSDemo } from './date-range-picker-enUS.demo';
import { DateRangePickerFRDemo } from './date-range-picker-fr.demo';
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

@Component({
  selector: 'clr-date-range-picker-internationalization-demo',
  templateUrl: './date-range-picker-internationalization.demo.html',
  imports: [ClrAlertModule, DateRangePickerENUSDemo, DateRangePickerFRDemo, CodeSnippetComponent],
})
export class DateRangePickerInternationalizationDemo {
  registerLocaleExample = REGISTER_LOCALE_EXAMPLE;
  provideLocaleExample = PROVIDE_LOCALE_EXAMPLE;
}
