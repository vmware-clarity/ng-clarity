/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ChartsAccessibility } from './accessibility/charts-accessibility';
import { ChartsColors } from './colors/charts-colors';
import { ChartsOverview } from './overview/charts-overview';
import { DocTabActiveDirective } from '../../../shared/doc-tabs/doc-tab-active.directive';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  templateUrl: './charts.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    DocTabActiveDirective,
    ChartsOverview,
    ChartsColors,
    ChartsAccessibility,
  ],
})
export class ChartsDemo extends ClarityDocComponent {
  constructor() {
    super('charts');
  }
}
