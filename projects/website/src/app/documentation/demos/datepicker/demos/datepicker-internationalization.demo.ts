/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
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

@Component({
  selector: 'clr-datepicker-internationalization-demo',
  templateUrl: './datepicker-internationalization.demo.html',
  imports: [ClrAlertModule, DatepickerENUSDemo, DatepickerFRDemo, CodeSnippetComponent],
})
export class DatepickerInternationalizationDemo {
  registerLocaleExample = REGISTER_LOCALE_EXAMPLE;
  provideLocaleExample = PROVIDE_LOCALE_EXAMPLE;
}
