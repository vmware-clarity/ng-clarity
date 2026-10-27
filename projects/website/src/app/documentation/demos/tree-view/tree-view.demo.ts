/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgComponentOutlet } from '@angular/common';
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
import { TREE_VIEW_EXAMPLES } from '@clr/examples/tree-view';

import { ClarityDocComponent } from '../clarity-doc';
import { TreeBasicDemo } from './basic-tree/tree-basic';
import { DisabledNodesOverviewDemo } from './disabled-nodes-overview/disabled-nodes-overview';
import { HighlightNodesTreeDemo } from './highlighting-nodes-tree/highlighting-nodes-tree';
import { InteractionCheckboxTreeDemo } from './interaction-checkbox-tree/interaction-checkbox-tree';
import { SmallSelectionTreeDemo } from './small-selection-tree/small-selection-tree';
import { TreeDataLoadingDemo } from './tree-data-loading/tree-data-loading';
import { TreeNodeRoutingDemo } from './tree-node-routing/tree-node-routing';
import { AiSkillComponent } from '../../../shared/ai-skill/ai-skill.component';
import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';
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
    SmallSelectionTreeDemo,
    ThemedImageComponent,
    ClrIcon,
    ClrIconModule,
    ClrAlertModule,
    HighlightNodesTreeDemo,
    InteractionCheckboxTreeDemo,
    DisabledNodesOverviewDemo,
    TreeDataLoadingDemo,
    TreeNodeRoutingDemo,
    StyleDocsComponent,
    AiSkillComponent,
    DocExampleComponent,
    NgComponentOutlet,
  ],
})
export class TreeViewDemo extends ClarityDocComponent {
  readonly examples = TREE_VIEW_EXAMPLES;

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
