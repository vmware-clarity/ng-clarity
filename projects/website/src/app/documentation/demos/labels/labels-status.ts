/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<span class="label label-info">Info</span>
<span class="label label-success">Success</span>
<span class="label label-warning">Warning</span>
<span class="label label-danger">Error</span>
`;

@Component({
  selector: 'clr-labels-status-demo',
  templateUrl: './labels-status.demo.html',
  imports: [StackblitzExampleComponent],
})
export class LabelsStatusDemo {
  example = EXAMPLE;
}
