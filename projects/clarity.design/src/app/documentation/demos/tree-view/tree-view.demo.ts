/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
} from '@cds/core/icon';

import { ClarityDocComponent } from '../clarity-doc';

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
  standalone: false,
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
