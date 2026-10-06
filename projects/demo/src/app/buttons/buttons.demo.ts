/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-buttons-demo',
  styleUrls: ['./buttons.demo.scss'],
  template: `
    <h2>Buttons</h2>
    <ul>
      <li><a [routerLink]="['./examples']">Examples</a></li>
      <li><a [routerLink]="['./primary-button']">Primary Buttons</a></li>
      <li><a [routerLink]="['./secondary-button']">Secondary Buttons</a></li>
      <li><a [routerLink]="['./tertiary-button']">Tertiary Buttons</a></li>
      <li><a [routerLink]="['./icons']">Icons in Buttons</a></li>
      <li><a [routerLink]="['./buttons-test']">Buttons Test</a></li>
    </ul>
    <router-outlet></router-outlet>
  `,
  standalone: false,
})
export class ButtonsDemo {}
