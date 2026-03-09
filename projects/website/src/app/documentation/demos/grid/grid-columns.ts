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
  <div class="clr-col-4">
    <span>4</span>
  </div>
  <div class="clr-col-6">
    <span>6</span>
  </div>
  <div class="clr-col-2">
    <span>2</span>
  </div>
</div>
`;

@Component({
  selector: 'clr-grid-demo-columns',
  templateUrl: './grid-columns.html',
  styleUrl: './grid.demo.scss',
  imports: [StackblitzExampleComponent],
})
export class GridColumnsDemo {
  example = EXAMPLE;
  cssExample = CSS_EXAMPLE;
}
