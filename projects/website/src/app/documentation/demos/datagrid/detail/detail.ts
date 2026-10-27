/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DATAGRID_EXAMPLES } from '@clr/examples/datagrid';

import { CodeSnippetComponent } from '../../../../shared/code-snippet/code-snippet.component';
import { DocExampleComponent } from '../../../../shared/doc-example/doc-example.component';
import { DatagridDetailAccessibilityGuidance } from '../accessibility/datagrid-detail-accessibility-guidance.component';

const DETAIL_PANE_EXAMPLE = `
<clr-dg-detail *clrIfDetail="let detail">
  <clr-dg-detail-header>{{ detail.name }}</clr-dg-detail-header>
  <clr-dg-detail-body>
    <!-- ... -->
  </clr-dg-detail-body>
</clr-dg-detail>
`;

const DETAIL_WIDTH_EXAMPLE = `
<clr-dg-detail *clrIfDetail="let detail" [clrDetailWidth]="50">
  <clr-dg-detail-header>{{ detail.name }}</clr-dg-detail-header>
  <clr-dg-detail-body>
    <!-- ... -->
  </clr-dg-detail-body>
</clr-dg-detail>
`;

@Component({
  templateUrl: 'detail.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [DocExampleComponent, CodeSnippetComponent, DatagridDetailAccessibilityGuidance, RouterLink],
})
export class DatagridDetailPaneDemo {
  readonly examples = DATAGRID_EXAMPLES;
  detailPaneExample = DETAIL_PANE_EXAMPLE;
  detailWidthExample = DETAIL_WIDTH_EXAMPLE;
}
