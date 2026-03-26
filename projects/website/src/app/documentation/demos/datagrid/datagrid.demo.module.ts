/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { DatagridDetailAccessibilityGuidance } from './accessibility/datagrid-detail-accessibility-guidance.component';
import { DatagridBasicStructureDemo } from './basic-structure/basic-structure';
import { DatagridBatchActionDemo } from './batch-action/batch-action';
import { DatagridBindingPropertiesDemo } from './binding-properties/binding-properties';
import { DatagridBuiltInFiltersDemo } from './built-in-filters/built-in-filters';
import { DatagridCompactDemo } from './compact/compact';
import { DatagridCustomRenderingDemo } from './custom-rendering/custom-rendering';
import { DatagridCustomSelectAllDemo } from './custom-select-all/custom-select-all';
import { DatagridDemo } from './datagrid.demo';
import { DatagridDetailPaneDemo } from './detail/detail';
import { DatagridExpandableRowsDemo } from './expandable-rows/expandable-rows';
import { DatagridFilteringDemo } from './filtering/filtering';
import { DatagridFixedHeightDemo } from './fixed-height/fixed-height';
import { DatagridFullDemo } from './full/full';
import { DatagridHideShowColumnsDemo } from './hide-show-columns/hide-show-columns';
import { DatagridPaginationDemo } from './pagination/pagination';
import { DatagridPlaceholderDemo } from './placeholder/placeholder';
import { DatagridSelectionDemo } from './selection/selection';
import { DatagridServerDrivenDemo } from './server-driven/server-driven';
import { DatagridSingleActionDemo } from './single-action/single-action';
import { DatagridSelectionSingleDemo } from './single-selection/single-selection';
import { DatagridSmartIteratorDemo } from './smart-iterator/smart-iterator';
import { DatagridSortingDemo } from './sorting/sorting';
import { DatagridUsageDemo } from './usage/usage';
import { ColorFilter } from './utils/color-filter';
import { DatagridVirtualScrollDemo } from './virtual-scroll/virtual-scroll';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';

const routes: Routes = [
  {
    path: '',
    component: DatagridDemo,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'structure',
      },
      {
        path: 'structure',
        component: DatagridBasicStructureDemo,
        data: {
          demoName: 'Basic Structure',
        },
      },
      {
        path: 'custom-rendering',
        component: DatagridCustomRenderingDemo,
        data: {
          demoName: 'Custom Cell Rendering',
        },
      },
      {
        path: 'smart-iterator',
        component: DatagridSmartIteratorDemo,
        data: {
          demoName: 'Smart Iterator',
        },
      },
      {
        path: 'binding-properties',
        component: DatagridBindingPropertiesDemo,
        data: {
          demoName: 'Binding Properties',
        },
      },
      {
        path: 'custom-sorting',
        component: DatagridSortingDemo,
        data: {
          demoName: 'Custom Sorting',
        },
      },
      {
        path: 'custom-filtering',
        component: DatagridFilteringDemo,
        data: {
          demoName: 'Custom Filtering',
        },
      },
      {
        path: 'built-in-filters',
        component: DatagridBuiltInFiltersDemo,
        data: {
          demoName: 'Built-in Filters',
        },
      },
      {
        path: 'pagination',
        component: DatagridPaginationDemo,
        data: {
          demoName: 'Pagination',
        },
      },
      {
        path: 'selection',
        component: DatagridSelectionDemo,
        data: {
          demoName: 'Selection',
        },
      },
      {
        path: 'selection-single',
        component: DatagridSelectionSingleDemo,
        data: {
          demoName: 'Single Selection',
        },
      },
      {
        path: 'custom-select-all',
        component: DatagridCustomSelectAllDemo,
        data: {
          demoName: 'Custom Select All',
        },
      },
      {
        path: 'batch-action',
        component: DatagridBatchActionDemo,
        data: {
          demoName: 'Batch Action',
        },
      },
      {
        path: 'single-action',
        component: DatagridSingleActionDemo,
        data: {
          demoName: 'Single Action',
        },
      },
      {
        path: 'server-driven',
        component: DatagridServerDrivenDemo,
        data: {
          demoName: 'Server Driven',
        },
      },
      {
        path: 'placeholder',
        component: DatagridPlaceholderDemo,
        data: {
          demoName: 'Placeholder',
        },
      },
      {
        path: 'detail-pane',
        component: DatagridDetailPaneDemo,
        data: {
          demoName: 'Detail Pane',
        },
      },
      {
        path: 'expandable-rows',
        component: DatagridExpandableRowsDemo,
        data: {
          demoName: 'Expandable Rows',
        },
      },
      {
        path: 'compact',
        component: DatagridCompactDemo,
        data: {
          demoName: 'Compact',
        },
      },
      {
        path: 'hide-show',
        component: DatagridHideShowColumnsDemo,
        data: {
          demoName: 'Hide/Show',
        },
      },
      {
        path: 'fixed-height',
        component: DatagridFixedHeightDemo,
        data: {
          demoName: 'Fixed Height',
        },
      },
      {
        path: 'virtual-scroll',
        component: DatagridVirtualScrollDemo,
        data: {
          demoName: 'Virtual Scroll',
        },
      },
      {
        path: 'full',
        component: DatagridFullDemo,
        data: {
          demoName: 'Full Demo',
        },
      },
      {
        path: 'usage',
        component: DatagridUsageDemo,
        data: {
          demoName: 'Usage',
        },
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ClarityModule,
    DocTabsModule,
    RouterModule.forChild(routes),
    StyleDocsComponent,
    CodeSnippetComponent,
    ColorFilter,
    StackblitzExampleComponent,
    DatagridBasicStructureDemo,
    DatagridUsageDemo,
    DatagridBatchActionDemo,
    DatagridBindingPropertiesDemo,
    DatagridCompactDemo,
    DatagridCustomRenderingDemo,
    DatagridCustomSelectAllDemo,
    DatagridFilteringDemo,
    DatagridFullDemo,
    DatagridPaginationDemo,
    DatagridSelectionDemo,
    DatagridSelectionSingleDemo,
    DatagridServerDrivenDemo,
    DatagridSingleActionDemo,
    DatagridSmartIteratorDemo,
    DatagridSortingDemo,
    DatagridBuiltInFiltersDemo,
    DatagridPlaceholderDemo,
    DatagridExpandableRowsDemo,
    DatagridFixedHeightDemo,
    DatagridHideShowColumnsDemo,
    DatagridDetailPaneDemo,
    DatagridVirtualScrollDemo,
    DatagridDemo,
    DatagridDetailAccessibilityGuidance,
  ],
  exports: [DatagridDemo],
})
export class DatagridDemoModule {}
