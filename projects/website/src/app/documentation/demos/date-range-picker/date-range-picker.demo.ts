/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Component } from '@angular/core';

import { DateRangePickerAPIDemo } from './demos/date-range-picker-api.demo';
import { DateRangePickerInternationalizationDemo } from './demos/date-range-picker-internationalization.demo';
import { DateRangePickerIODemo } from './demos/date-range-picker-io.demo';
import { DocTabActiveDirective } from '../../../shared/doc-tabs/doc-tab-active.directive';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';

registerLocaleData(localeFr);

@Component({
  selector: 'clr-date-range-picker-demo',
  templateUrl: './date-range-picker.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    ThemedImageComponent,
    DocTabActiveDirective,
    DateRangePickerAPIDemo,
    DateRangePickerInternationalizationDemo,
    DateRangePickerIODemo,
    StyleDocsComponent,
  ],
})
export class DateRangePickerDemo extends ClarityDocComponent {
  expanded = true;

  constructor() {
    super('date-range-picker');
  }
}
