/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { DATAGRID_EXAMPLES } from '@clr/examples/datagrid';

import { DocExampleComponent } from '../../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-datagrid-custom-rendering-demo',
  templateUrl: './custom-rendering.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [DocExampleComponent],
})
export class DatagridCustomRenderingDemo {
  readonly examples = DATAGRID_EXAMPLES;
}
