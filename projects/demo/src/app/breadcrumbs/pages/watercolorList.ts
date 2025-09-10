/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-watercolor-list-demo',
  template: `
    <h4 clrFocusOnViewInit>Watercolors</h4>
    <p>
      Watercolors are a water-based medium used to create art by applying a brush to a surface with a mixture of
      pigment, water, and a binder
    </p>

    <p>Popular watercolor brands:</p>
    <ul>
      <li><a [routerLink]="['./daniel-smith']">Daniel Smith</a></li>
      <li><a [routerLink]="['./winsor-newton']">Winsor & Newton</a></li>
    </ul>
  `,
  standalone: false,
})
export class WatercolorListDemo {}
