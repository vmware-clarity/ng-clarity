/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

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
import { GridDemo } from './grid.demo';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    RouterModule.forChild([{ path: '', component: GridDemo }]),
    DocTabsModule,
    StyleDocsComponent,
    StackblitzExampleComponent,
    GridAutoLayout1Demo,
    GridAutoLayout2Demo,
    GridAutoLayout3Demo,
    GridAutoLayout4Demo,
    GridColumnsDemo,
    GridColumnStackingDemo,
    GridColumnWrappingDemo,
    GridColumnOffsettingDemo,
    GridColumnOrderingDemo,
    GridItemsHorizontalAlignmentDemo,
    GridItemsIndividualVerticalAlignmentDemo,
    GridItemsVerticalAlignmentDemo,
    GridNestingDemo,
    GridDemo,
  ],
  exports: [GridDemo],
})
export class GridDemoModule {}
