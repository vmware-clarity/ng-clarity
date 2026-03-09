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
  <div class="clr-col-6">
    <span>clr-col-7</span>
  </div>
  <div class="clr-col-8">
    <span>clr-col-8</span>
  </div>
</div>
`;

@Component({
  selector: 'clr-grid-demo-column-wrapping',
  templateUrl: './grid-column-wrapping.html',
  styleUrl: './grid.demo.scss',
  imports: [StackblitzExampleComponent],
})
export class GridColumnWrappingDemo {
  example = EXAMPLE;
  cssExample = CSS_EXAMPLE;
}
