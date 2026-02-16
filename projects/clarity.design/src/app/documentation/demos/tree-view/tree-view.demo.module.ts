/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { TreeBasicDemo } from './basic-tree/tree-basic';
import { TreeBasicDMDemo } from './basic-tree-DM/tree-basic-DM';
import { BooleanSelectionTreeDemo } from './boolean-selection-tree/boolean-selection-tree';
import { DisabledNodesDemo } from './disabled-nodes/disabled-nodes';
import { DisabledNodesOverviewDemo } from './disabled-nodes-overview/disabled-nodes-overview';
import { DisabledNodesSelectionDemo } from './disabled-nodes-selection/disabled-nodes-selection';
import { HighlightNodesTreeDemo } from './highlighting-nodes-tree/highlighting-nodes-tree';
import { InteractionCheckboxTreeDemo } from './interaction-checkbox-tree/interaction-checkbox-tree';
import { TreeNodeLabelChangeOnExpandDemo } from './label-change-on-expand/label-change-on-expand';
import { LazyLoadingRecursiveTreeDemo } from './lazy-loading-recursive-tree/lazy-loading-recursive-tree';
import { GroceryItemsComponent } from './lazy-loading-selection-tree/grocery-items.component';
import { LazyLoadingSelectionTreeDemo } from './lazy-loading-selection-tree/lazy-loading-selection-tree';
import { LazyLoadingTreeDemo } from './lazy-loading-tree/lazy-loading-tree';
import { RecursiveTreeDemo } from './recursive-tree/recursive-tree';
import { SelectionTreeDemo } from './selection-tree/selection-tree';
import { SmallSelectionTreeDemo } from './small-selection-tree/small-selection-tree';
import { TreeDataLoadingDemo } from './tree-data-loading/tree-data-loading';
import { TreeNodeRoutingDemo } from './tree-node-routing/tree-node-routing';
import { TreeViewDynamicDemo } from './tree-view-dynamic/tree-view-dynamic';
import { TreeViewDemo } from './tree-view.demo';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    RouterModule.forChild([{ path: '', component: TreeViewDemo }]),
    DocTabsModule,
    StyleDocsComponent,
    GroceryItemsComponent,
    ThemedImageComponent,
    StackblitzExampleComponent,
  ],
  declarations: [
    TreeBasicDemo,
    TreeBasicDMDemo,
    BooleanSelectionTreeDemo,
    DisabledNodesDemo,
    DisabledNodesOverviewDemo,
    DisabledNodesSelectionDemo,
    TreeViewDynamicDemo,
    LazyLoadingTreeDemo,
    TreeNodeLabelChangeOnExpandDemo,
    SelectionTreeDemo,
    TreeNodeRoutingDemo,
    SmallSelectionTreeDemo,
    TreeViewDemo,
    RecursiveTreeDemo,
    LazyLoadingSelectionTreeDemo,
    LazyLoadingRecursiveTreeDemo,
    InteractionCheckboxTreeDemo,
    HighlightNodesTreeDemo,
    TreeDataLoadingDemo,
  ],
  exports: [TreeViewDemo],
})
export class TreeDemoModule {}
