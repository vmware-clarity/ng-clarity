/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-winsor-newton-demo',
  template: `
    <h5 clrFocusOnViewInit>Winsor & Newton</h5>
    <p>
      Available in over 100 luminous colours and used by artists such as Turner and Sargent, our Professional
      Watercolour is formulated using only the purest pigments to ensure performance and permanence.
    </p>
    <ul>
      <li><a [routerLink]="['./cotman']">Winsor & Newton Cotman</a></li>
      <li><a [routerLink]="['./professional']">Winsor & Newton Professional</a></li>
    </ul>
    <router-outlet></router-outlet>
  `,
  standalone: false,
})
export class WinsorNewtonDemo {}
