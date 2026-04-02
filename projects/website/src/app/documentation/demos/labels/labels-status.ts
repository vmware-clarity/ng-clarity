/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<h6>Outlined</h6>
<span class="label label-info">Info</span>
<span class="label label-success">Success</span>
<span class="label label-warning">Warning</span>
<span class="label label-danger">Error</span>
<span class="label disabled label-danger">Disabled</span>
<h6>Solid</h6>
<span class="label solid label-info">Info</span>
<span class="label solid label-success">Success</span>
<span class="label solid label-warning">Warning</span>
<span class="label solid label-danger">Error</span>
<span class="label solid disabled label-danger">Disabled</span>
`;

@Component({
  selector: 'clr-labels-status-demo',
  templateUrl: './labels-status.demo.html',
  imports: [StackblitzExampleComponent],
})
export class LabelsStatusDemo {
  example = EXAMPLE;
}
