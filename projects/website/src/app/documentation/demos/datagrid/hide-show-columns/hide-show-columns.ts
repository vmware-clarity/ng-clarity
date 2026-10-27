/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DATAGRID_EXAMPLES } from '@clr/examples/datagrid';

import { DocExampleComponent } from '../../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-datagrid-hide-show-columns-demo',
  templateUrl: './hide-show-columns.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [DocExampleComponent, RouterLink],
})
export class DatagridHideShowColumnsDemo {
  readonly examples = DATAGRID_EXAMPLES;
}
