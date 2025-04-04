/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID, NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';

import { I18nA11yDemo } from './i18n-a11y.demo';
import { ROUTING } from './i18n-a11y.demo.routing';

registerLocaleData(localeFr);

@NgModule({
  imports: [CommonModule, ClarityModule, ROUTING],
  declarations: [I18nA11yDemo],
  exports: [I18nA11yDemo],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
})
export class I18nA11yDemoModule {}
