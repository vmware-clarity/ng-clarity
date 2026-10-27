/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-stack-view-demo',
  template: `
    <h2>Stack View</h2>

    <ul>
      <li><a [routerLink]="['./examples']">Examples</a></li>
      <li><a [routerLink]="['./angular-basic']">Basic Stack View component</a></li>
    </ul>

    <router-outlet></router-outlet>
  `,
  standalone: false,
})
export class StackViewDemo {}
