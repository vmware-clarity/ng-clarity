/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  template: `
    <h2>Layout</h2>
    <ul>
      <li><a [routerLink]="['./layout-all']">Layout - All</a></li>
      <li><a [routerLink]="['./layout-no-subnav']">Layout - No Subnav</a></li>
      <li><a [routerLink]="['./layout-no-vertical-nav']">Layout - No Vertical Nav</a></li>
      <li><a [routerLink]="['./layout-only-header']">Layout - Only Header</a></li>
      <li><a [routerLink]="['./layout-subnav-primary']">Layout - Subnav as Primary Navigation</a></li>
      <li><a [routerLink]="['./layout-vertical-nav-primary']">Layout - Vertical Nav as Primary Navigation</a></li>
      <li><a [routerLink]="['./layout-additional-sections']">Layout - Additional Sections</a></li>
    </ul>
    <router-outlet></router-outlet>
  `,
})
export class LayoutDemo {}
