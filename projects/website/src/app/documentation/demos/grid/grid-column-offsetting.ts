/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { CSS_EXAMPLE } from './grid-css-example';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<div class="clr-row">
  <div class="clr-col-sm-4">
    <span>clr-col-sm-4</span>
  </div>
  <div class="clr-col-sm-6 clr-offset-sm-2">
    <span>clr-col-sm-6 clr-offset-sm-2</span>
  </div>
</div>
`;

@Component({
  selector: 'clr-grid-demo-column-offsetting',
  templateUrl: './grid-column-offsetting.html',
  styleUrl: './grid.demo.scss',
  imports: [StackblitzExampleComponent],
})
export class GridColumnOffsettingDemo {
  example = EXAMPLE;
  cssExample = CSS_EXAMPLE;
}
