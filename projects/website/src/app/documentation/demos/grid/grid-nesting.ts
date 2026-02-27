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
<div class="clr-row clr-example-nesting-row">
  <div class="clr-col-9">
    <span>9</span>
    <div class="clr-row clr-example-nesting-row">
      <div class="clr-col-3">
        <span>3</span>
      </div>
      <div class="clr-col-9">
        <span>9</span>
      </div>
    </div>
  </div>
  <div class="clr-col-3">
    <span>3</span>
  </div>
</div>
`;

const CSS_EXAMPLE_2 = `
.clr-example-nesting-row {
  background: hsl(206, 25%, 25%);
  margin: 0.3rem 0;
}

.clr-example-nesting-row .clr-example-nesting-row {
  background: hsl(206, 13%, 44%);
}
`;

@Component({
  selector: 'clr-grid-demo-nesting',
  templateUrl: './grid-nesting.html',
  styleUrl: './grid.demo.scss',
  imports: [StackblitzExampleComponent],
})
export class GridNestingDemo {
  example = EXAMPLE;
  cssExample = `${CSS_EXAMPLE}${CSS_EXAMPLE_2}`;
}
