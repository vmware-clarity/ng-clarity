/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-color-demo',
  styleUrls: [],
  template: `
    <h2>Color</h2>
    <ul>
      <li><a [routerLink]="['./color-palette']">Color Palette</a></li>
    </ul>
    <router-outlet></router-outlet>
  `,
  standalone: false,
})
export class ColorsDemo {}
