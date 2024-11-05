/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

export interface MenuItem {
  label: string;
  url: string;
}

@Component({
  selector: 'clr-framework-demo',
  template: `<h3>UI Frameworks</h3>
    <ul>
      <li><a [routerLink]="['./angular']">Angular</a></li>
      <li><a [routerLink]="['./react']">React</a></li>
    </ul>
    <router-outlet></router-outlet>`,
})
export class FrameworkDemo {}
