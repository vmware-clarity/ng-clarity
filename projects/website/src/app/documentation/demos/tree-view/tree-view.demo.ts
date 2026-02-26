/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import {
  barChartIcon,
  buildingIcon,
  calendarIcon,
  ClarityIcons,
  ClrAlertModule,
  ClrIcon,
  ClrIconModule,
  dashboardIcon,
  envelopeIcon,
  fileIcon,
  flagIcon,
  folderIcon,
  imageIcon,
  infoCircleIcon,
  lineChartIcon,
  mapIcon,
  tasksIcon,
} from '@clr/angular';

import { ClarityDocComponent } from '../clarity-doc';
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
import { LazyLoadingSelectionTreeDemo } from './lazy-loading-selection-tree/lazy-loading-selection-tree';
import { LazyLoadingTreeDemo } from './lazy-loading-tree/lazy-loading-tree';
import { RecursiveTreeDemo } from './recursive-tree/recursive-tree';
import { SelectionTreeDemo } from './selection-tree/selection-tree';
import { SmallSelectionTreeDemo } from './small-selection-tree/small-selection-tree';
import { TreeDataLoadingDemo } from './tree-data-loading/tree-data-loading';
import { TreeNodeRoutingDemo } from './tree-node-routing/tree-node-routing';
import { TreeViewDynamicDemo } from './tree-view-dynamic/tree-view-dynamic';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@Component({
  selector: 'clr-tree-view-demo',
  templateUrl: './tree-view.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  styles: [
    `
      .demo-list {
        column-count: 2;
        list-style-position: inside;
      }
    `,
  ],
  imports: [
    DocTabsComponent,
    DocTabComponent,
    TreeBasicDemo,
    TreeViewDynamicDemo,
    SmallSelectionTreeDemo,
    ThemedImageComponent,
    ClrIcon,
    ClrIconModule,
    ClrAlertModule,
    HighlightNodesTreeDemo,
    InteractionCheckboxTreeDemo,
    DisabledNodesOverviewDemo,
    TreeDataLoadingDemo,
    TreeBasicDMDemo,
    DisabledNodesDemo,
    TreeNodeLabelChangeOnExpandDemo,
    TreeNodeRoutingDemo,
    SelectionTreeDemo,
    DisabledNodesSelectionDemo,
    BooleanSelectionTreeDemo,
    RecursiveTreeDemo,
    LazyLoadingTreeDemo,
    LazyLoadingSelectionTreeDemo,
    LazyLoadingRecursiveTreeDemo,
    StyleDocsComponent,
  ],
})
export class TreeViewDemo extends ClarityDocComponent {
  constructor() {
    super('tree-view');
    ClarityIcons.addIcons(
      infoCircleIcon,
      folderIcon,
      fileIcon,
      buildingIcon,
      lineChartIcon,
      calendarIcon,
      dashboardIcon,
      mapIcon,
      barChartIcon,
      tasksIcon,
      flagIcon,
      imageIcon,
      envelopeIcon
    );
  }
}
