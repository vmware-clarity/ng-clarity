/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClrIcon, ClrIconModule } from '@clr/angular';

import { LabelsClickableDemo } from './labels-clickable';
import { LabelsColorOptionsDemo } from './labels-color-options';
import { LabelsDefaultDemo } from './labels-default';
import { LabelsStatusDemo } from './labels-status';
import { LabelsWithBadgesDemo } from './labels-with-badges';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-labels-demo',
  templateUrl: './labels.demo.html',
  styleUrl: './labels.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    DoDontComponent,
    ClrIcon,
    ClrIconModule,
    RouterLink,
    LabelsDefaultDemo,
    LabelsColorOptionsDemo,
    LabelsClickableDemo,
    LabelsStatusDemo,
    LabelsWithBadgesDemo,
    StyleDocsComponent,
  ],
})
export class LabelsDemo extends ClarityDocComponent {
  hideJames = false;
  hideJimmy = false;

  constructor() {
    super('label');
  }
}
