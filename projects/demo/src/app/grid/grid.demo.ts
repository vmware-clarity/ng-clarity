/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-grid-demo',
  styleUrls: ['./grid.demo.scss'],
  template: `
    <h2>Grid</h2>
    <div class="clr-row">
      <div class="clr-col-12 clr-col-md-6">
        <ul>
          <li><a [routerLink]="['./examples']">Examples</a></li>
          <li><a [routerLink]="['./grid-container']">Container class</a></li>
          <li><a [routerLink]="['./grid-columns']">Columns</a></li>
          <li><a [routerLink]="['./grid-columns-stacking']">Column Stacking</a></li>
        </ul>
      </div>
      <div class="clr-col-12 clr-col-md-6">
        <ul>
          <li><a [routerLink]="['./grid-column-wrapping']">Column Wrapping</a></li>
          <li><a [routerLink]="['./grid-no-gutters']">No Gutters</a></li>
          <li><a [routerLink]="['./grid-nesting']">Grid Nesting</a></li>
        </ul>
      </div>
    </div>
    <router-outlet></router-outlet>
  `,
  standalone: false,
})
export class GridDemo {}
