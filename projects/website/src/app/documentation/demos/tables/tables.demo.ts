/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TablesBasicDemo } from './tables-basic';
import { TablesCompactDemo } from './tables-compact';
import { TablesCompactNoborderDemo } from './tables-compact-noborder';
import { TablesLeftcellDemo } from './tables-leftcell';
import { TablesMultilineDemo } from './tables-multiline';
import { TablesNoborderDemo } from './tables-noborder';
import { TablesVerticalDemo } from './tables-vertical';
import { TablesVerticalNoborderCompactDemo } from './tables-vertical-noborder-compact';
import { TablesWidthDemo } from './tables-width';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-tables-demo',
  templateUrl: './tables.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    RouterLink,
    TablesBasicDemo,
    TablesLeftcellDemo,
    TablesMultilineDemo,
    TablesNoborderDemo,
    TablesCompactDemo,
    TablesCompactNoborderDemo,
    TablesVerticalDemo,
    TablesVerticalNoborderCompactDemo,
    TablesWidthDemo,
    StyleDocsComponent,
  ],
})
export class TablesDemo extends ClarityDocComponent {
  constructor() {
    super('table');
  }
}
