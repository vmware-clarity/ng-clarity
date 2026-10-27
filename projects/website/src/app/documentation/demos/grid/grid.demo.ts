/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAlertModule } from '@clr/angular';
import { GRID_EXAMPLES } from '@clr/examples/grid';

import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-grid-demo',
  templateUrl: './grid.demo.html',
  styleUrl: './grid.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [DocTabsComponent, DocTabComponent, DocExampleComponent, ClrAlertModule, StyleDocsComponent],
})
export class GridDemo extends ClarityDocComponent {
  readonly examples = GRID_EXAMPLES;

  constructor() {
    super('grid');
  }
}
