/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  template: `
    <h2>Dropdowns</h2>
    <ul>
      <li><a [routerLink]="['./default']">Default Styles (Static)</a></li>
      <li><a [routerLink]="['./positioning']">Positioning with CSS Classnames (Static)</a></li>
      <li><a [routerLink]="['./icon-toggle']">Clarity Icon Toggle (Static)</a></li>
      <li><a [routerLink]="['./buttonlink-toggle']">Button Link Toggle (Static)</a></li>
      <li><a [routerLink]="['./angular-positioning']">Positioning with Angular</a></li>
      <li><a [routerLink]="['./angular-shadow-root']">Shadow Root Angular</a></li>
      <li><a [routerLink]="['./angular-nested']">Nested menu with Angular</a></li>
      <li><a [routerLink]="['./multi-click']">Stay Open After Click Event (Angular)</a></li>
      <li><a [routerLink]="['./dropdown-header']">Dropdown Header</a></li>
    </ul>
    <router-outlet></router-outlet>
  `,
  standalone: false,
})
export class DropdownDemo {}
