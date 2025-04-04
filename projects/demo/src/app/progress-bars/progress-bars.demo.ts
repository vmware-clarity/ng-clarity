/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-progress-bars-demo',
  styleUrls: ['./progress-bars.demo.scss'],
  template: `
    <h2>Progress Bars</h2>
    <ul>
      <li><a [routerLink]="['./progress-bar-examples']">Progress Bar Examples</a></li>
      <li><a [routerLink]="['./progress-bar-colors']">Progress Bar Colors</a></li>
      <li><a [routerLink]="['./progress-bar-animations']">Progress Bar Animations</a></li>
      <li><a [routerLink]="['./progress-bar-cards']">Progress Bars in Cards</a></li>
      <li><a [routerLink]="['./progress-bar-loop']">Indeterminate Progress Bar</a></li>
      <li><a [routerLink]="['./progress-bar-static']">Static Progress Bar</a></li>
      <li><a [routerLink]="['./progress-bar-static-cards']">Static Progress Bar in Cards</a></li>
      <li><a [routerLink]="['./progress-bar-inline']">Inline Progress Bar</a></li>
      <li><a [routerLink]="['./progress-bar-inline-cards']">Inline Progress Bar in Cards</a></li>
      <li><a [routerLink]="['./progress-bar-component']">Progress Bar Component</a></li>
    </ul>
    <router-outlet></router-outlet>
  `,
})
export class ProgressBarsDemo {}
