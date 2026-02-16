/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

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
  standalone: false,
})
export class DatepickerInternationalizationDemo {
  registerLocaleExample = REGISTER_LOCALE_EXAMPLE;
  provideLocaleExample = PROVIDE_LOCALE_EXAMPLE;
}
