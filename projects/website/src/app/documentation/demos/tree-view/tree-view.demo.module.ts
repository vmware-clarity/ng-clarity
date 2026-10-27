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

import { TreeBasicDemo } from './basic-tree/tree-basic';
import { DisabledNodesOverviewDemo } from './disabled-nodes-overview/disabled-nodes-overview';
import { HighlightNodesTreeDemo } from './highlighting-nodes-tree/highlighting-nodes-tree';
import { InteractionCheckboxTreeDemo } from './interaction-checkbox-tree/interaction-checkbox-tree';
import { SmallSelectionTreeDemo } from './small-selection-tree/small-selection-tree';
import { TreeDataLoadingDemo } from './tree-data-loading/tree-data-loading';
import { TreeNodeRoutingDemo } from './tree-node-routing/tree-node-routing';
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
    ThemedImageComponent,
    StackblitzExampleComponent,
    TreeBasicDemo,
    DisabledNodesOverviewDemo,
    TreeNodeRoutingDemo,
    SmallSelectionTreeDemo,
    TreeViewDemo,
    InteractionCheckboxTreeDemo,
    HighlightNodesTreeDemo,
    TreeDataLoadingDemo,
  ],
  exports: [TreeViewDemo],
})
export class TreeDemoModule {}
