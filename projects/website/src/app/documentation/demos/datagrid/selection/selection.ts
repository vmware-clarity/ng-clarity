/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAlertModule } from '@clr/angular';
import { DATAGRID_EXAMPLES } from '@clr/examples/datagrid';

import { SNIPPETS } from './snippets';
import { CodeSnippetComponent } from '../../../../shared/code-snippet/code-snippet.component';
import { DocExampleComponent } from '../../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-datagrid-selection-demo',
  templateUrl: 'selection.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [DocExampleComponent, CodeSnippetComponent, ClrAlertModule],
})
export class DatagridSelectionDemo {
  readonly examples = DATAGRID_EXAMPLES;
  readonly snippets = SNIPPETS;
}
