/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { UtilsDemoModule } from '../_utils/utils.module';
import { DatagridBasicStructureDemo } from './basic-structure/basic-structure';
import { DatagridBasicOnPushDemo } from './basic-with-on-push/basic-on-push';
import { DatagridBasicOnPushWrapperDemo } from './basic-with-on-push/basic-on-push-wrapper';
import { DatagridBindingPropertiesDemo } from './binding-properties/binding-properties';
import { DatagridBuiltInFiltersDemo } from './built-in-filters/built-in-filters';
import { DatagridColumnSizingDemo } from './column-sizing/column-sizing';
import { DatagridCompactDemo } from './compact/compact';
import { DatagridConditionalSelectionsDemo } from './conditional-selection/conditional-selection';
import { DatagridCustomRenderingDemo } from './custom-rendering/custom-rendering';
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
import { DatagridPlaceholderDemo } from './placeholder/placeholder';
import { DatagridPreserveSelectionDemo } from './preserve-selection/preserve-selection';
import { DatagridResponsiveFooterDemo } from './responsive-footer/responsive-footer';
import { DatagridScrollingDemo } from './scrolling/scrolling';
import { DatagridSelectionDemo } from './selection/selection';
import { DatagridSelectionRowModeDemo } from './selection-row-mode/selection-row-mode';
import { DatagridSelectionSingleDemo } from './selection-single/selection-single';
import { DatagridServerDrivenDemo } from './server-driven/server-driven';
import { DatagridSmartIteratorDemo } from './smart-iterator/smart-iterator';
import { DatagridSortingDemo } from './sorting/sorting';
import { DatagridTestCasesDemo } from './test-cases/test-cases';
import { DatagridTestCasesAsyncDemo } from './test-cases-async/test-cases-async';
import { ColorFilter } from './utils/color-filter';
import { DatagridVirtualScrollClientSideDemo } from './virtual-scroll-client-side/virtual-scroll-client-side';
import { DatagridVirtualScrollEmptyRowsDemo } from './virtual-scroll-empty-rows/virtual-scroll-empty-rows';
import { DatagridVirtualScrollServerSideDemo } from './virtual-scroll-server-side/virtual-scroll-server-side';

@NgModule({
  imports: [CommonModule, FormsModule, ClarityModule, ROUTING, UtilsDemoModule],
  declarations: [
    DatagridDemo,
    DatagridBasicStructureDemo,
    DatagridBasicOnPushDemo,
    DatagridBasicOnPushWrapperDemo,
    DatagridBindingPropertiesDemo,
    DatagridCompactDemo,
    DatagridDensityDemo,
    DatagridCustomRenderingDemo,
    DatagridFilteringDemo,
    DatagridFullDemo,
    DatagridHideShowDemo,
    DatagridPaginationDemo,
    DatagridPaginationScrollingDemo,
    DatagridConditionalPaginationDemo,
    DatagridSelectionDemo,
    DatagridSelectionSingleDemo,
    DatagridSelectionRowModeDemo,
    DatagridPreserveSelectionDemo,
    DatagridServerDrivenDemo,
    DatagridSmartIteratorDemo,
    DatagridSortingDemo,
    DatagridBuiltInFiltersDemo,
    DatagridResponsiveFooterDemo,
    DatagridPlaceholderDemo,
    DatagridScrollingDemo,
    DatagridColumnSizingDemo,
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
    DatagridBasicStructureDemo,
    DatagridBasicOnPushDemo,
    DatagridBasicOnPushWrapperDemo,
    DatagridBindingPropertiesDemo,
    DatagridCompactDemo,
    DatagridDensityDemo,
    DatagridCustomRenderingDemo,
    DatagridFilteringDemo,
    DatagridFullDemo,
    DatagridPaginationDemo,
    DatagridPaginationScrollingDemo,
    DatagridConditionalPaginationDemo,
    DatagridSelectionDemo,
    DatagridSelectionSingleDemo,
    DatagridSelectionRowModeDemo,
    DatagridPreserveSelectionDemo,
    DatagridVirtualScrollClientSideDemo,
    DatagridVirtualScrollEmptyRowsDemo,
    DatagridVirtualScrollServerSideDemo,
    DatagridServerDrivenDemo,
    DatagridSmartIteratorDemo,
    DatagridSortingDemo,
    DatagridBuiltInFiltersDemo,
    DatagridPlaceholderDemo,
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
