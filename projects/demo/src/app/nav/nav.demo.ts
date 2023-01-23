/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-nav-demo',
  styleUrls: [],
  template: `
    <h2>Navigation</h2>
    <ul>
      <li><a [routerLink]="['./headers']">Headers</a></li>
      <li><a [routerLink]="['./nav-tabs']">Navs/Nav Tabs</a></li>
      <li><a [routerLink]="['./subnav']">SubNav</a></li>
    </ul>
    <router-outlet></router-outlet>
  `,
})
export class NavDemo {}
