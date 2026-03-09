/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAlertModule } from '@clr/angular';

import { GridAutoLayout1Demo } from './grid-auto-layout-1';
import { GridAutoLayout2Demo } from './grid-auto-layout-2';
import { GridAutoLayout3Demo } from './grid-auto-layout-3';
import { GridAutoLayout4Demo } from './grid-auto-layout-4';
import { GridColumnOffsettingDemo } from './grid-column-offsetting';
import { GridColumnOrderingDemo } from './grid-column-ordering';
import { GridColumnStackingDemo } from './grid-column-stacking';
import { GridColumnWrappingDemo } from './grid-column-wrapping';
import { GridColumnsDemo } from './grid-columns';
import { GridItemsHorizontalAlignmentDemo } from './grid-items-horizontal-alignment';
import { GridItemsIndividualVerticalAlignmentDemo } from './grid-items-individual-vertical-alignment';
import { GridItemsVerticalAlignmentDemo } from './grid-items-vertical-alignment';
import { GridNestingDemo } from './grid-nesting';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-grid-demo',
  templateUrl: './grid.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    GridColumnsDemo,
    GridColumnStackingDemo,
    GridColumnWrappingDemo,
    GridAutoLayout1Demo,
    GridAutoLayout2Demo,
    GridAutoLayout3Demo,
    GridAutoLayout4Demo,
    GridColumnOffsettingDemo,
    ClrAlertModule,
    GridColumnOrderingDemo,
    GridItemsVerticalAlignmentDemo,
    GridItemsIndividualVerticalAlignmentDemo,
    GridItemsHorizontalAlignmentDemo,
    GridNestingDemo,
    StyleDocsComponent,
  ],
})
export class GridDemo extends ClarityDocComponent {
  constructor() {
    super('grid');
  }
}
