/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppfxDatagridModule } from '@clr/addons/datagrid';
import { ClarityModule } from '@clr/angular';

import { UtilsDemoModule } from '../_utils/utils.module';
import { DatagridBasicOnPushDemo } from './basic-with-on-push/basic-on-push';
import { DatagridBasicOnPushWrapperDemo } from './basic-with-on-push/basic-on-push-wrapper';
import { DatagridBindingPropertiesDemo } from './binding-properties/binding-properties';
import { DatagridBuiltInFiltersDemo } from './built-in-filters/built-in-filters';
import { DatagridColumnActionsDemo } from './column-actions/column-actions';
import { DatagridColumnSizingDemo } from './column-sizing/column-sizing';
import { DatagridCompactDemo } from './compact/compact';
import { DatagridConditionalSelectionsDemo } from './conditional-selection/conditional-selection';
import { DatagridDemo } from './datagrid.demo';
import { ROUTING } from './datagrid.demo.routing';
import { DatagridDensityDemo } from './density/density';
import { DatagridDetailDemo } from './detail/detail';
import { DetailWrapper } from './expandable-rows/detail-wrapper';
import { DatagridExpandableRowsDemo } from './expandable-rows/expandable-rows';
import { DatagridFilteringDemo } from './filtering/filtering';
import { DatagridFullDemo } from './full/full';
import { DatagridHideShowDemo } from './hide-show-columns/hide-show';
import { DatagridKitchenSinkDemo } from './kitchen-sink/kitchen-sink';
import { DatagridPaginationDemo } from './pagination/pagination';
import { DatagridConditionalPaginationDemo } from './pagination-conditional/pagination-conditional';
import { DatagridPaginationScrollingDemo } from './pagination-scrolling/pagination-scrolling';
import { DatagridPerformanceDemo } from './performance/performance';
import { DatagridPinnableColumnsDemo } from './pinnable-columns/pinnable-columns';
import { DatagridPreserveSelectionDemo } from './preserve-selection/preserve-selection';
import { DatagridResponsiveFooterDemo } from './responsive-footer/responsive-footer';
import { DatagridScrollingDemo } from './scrolling/scrolling';
import { DatagridSelectionDemo } from './selection/selection';
import { DatagridSelectionRowModeDemo } from './selection-row-mode/selection-row-mode';
import { DatagridSelectionSandboxDemo } from './selection-sandbox/selection-sandbox';
import { DatagridSelectionSingleDemo } from './selection-single/selection-single';
import { DatagridServerDrivenDemo } from './server-driven/server-driven';
import { DatagridSortingDemo } from './sorting/sorting';
import { DatagridTestCasesDemo } from './test-cases/test-cases';
import { DatagridTestCasesAsyncDemo } from './test-cases-async/test-cases-async';
import { ColorFilter } from './utils/color-filter';
import { DatagridVirtualScrollClientSideDemo } from './virtual-scroll-client-side/virtual-scroll-client-side';
import { DatagridVirtualScrollEmptyRowsDemo } from './virtual-scroll-empty-rows/virtual-scroll-empty-rows';
import { DatagridVirtualScrollServerSideDemo } from './virtual-scroll-server-side/virtual-scroll-server-side';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule,
    AppfxDatagridModule,
    ROUTING,
    UtilsDemoModule,
  ],
  declarations: [
    DatagridDemo,
    DatagridBasicOnPushDemo,
    DatagridBasicOnPushWrapperDemo,
    DatagridBindingPropertiesDemo,
    DatagridCompactDemo,
    DatagridDensityDemo,
    DatagridFilteringDemo,
    DatagridFullDemo,
    DatagridHideShowDemo,
    DatagridPaginationDemo,
    DatagridPaginationScrollingDemo,
    DatagridConditionalPaginationDemo,
    DatagridSelectionDemo,
    DatagridSelectionSandboxDemo,
    DatagridSelectionSingleDemo,
    DatagridSelectionRowModeDemo,
    DatagridPreserveSelectionDemo,
    DatagridServerDrivenDemo,
    DatagridSortingDemo,
    DatagridBuiltInFiltersDemo,
    DatagridResponsiveFooterDemo,
    DatagridScrollingDemo,
    DatagridColumnSizingDemo,
    DatagridColumnActionsDemo,
    DatagridPinnableColumnsDemo,
    DatagridExpandableRowsDemo,
    DatagridPerformanceDemo,
    DatagridTestCasesDemo,
    DatagridTestCasesAsyncDemo,
    DatagridVirtualScrollClientSideDemo,
    DatagridVirtualScrollEmptyRowsDemo,
    DatagridVirtualScrollServerSideDemo,
    DatagridKitchenSinkDemo,
    DatagridConditionalSelectionsDemo,
    ColorFilter,
    DatagridDetailDemo,
    DetailWrapper,
  ],
  exports: [
    DatagridDemo,
    DatagridBasicOnPushDemo,
    DatagridBasicOnPushWrapperDemo,
    DatagridBindingPropertiesDemo,
    DatagridCompactDemo,
    DatagridDensityDemo,
    DatagridFilteringDemo,
    DatagridFullDemo,
    DatagridPaginationDemo,
    DatagridPaginationScrollingDemo,
    DatagridConditionalPaginationDemo,
    DatagridSelectionDemo,
    DatagridSelectionSandboxDemo,
    DatagridSelectionSingleDemo,
    DatagridSelectionRowModeDemo,
    DatagridPreserveSelectionDemo,
    DatagridVirtualScrollClientSideDemo,
    DatagridVirtualScrollEmptyRowsDemo,
    DatagridVirtualScrollServerSideDemo,
    DatagridServerDrivenDemo,
    DatagridSortingDemo,
    DatagridBuiltInFiltersDemo,
    DatagridPerformanceDemo,
    DatagridScrollingDemo,
    DatagridColumnSizingDemo,
    DatagridExpandableRowsDemo,
    DatagridTestCasesDemo,
    DatagridTestCasesAsyncDemo,
    DatagridDetailDemo,
    DatagridKitchenSinkDemo,
  ],
})
export class DatagridDemoModule {}
