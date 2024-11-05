/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-angular-demo',
  template: `
    <h4 clrFocusOnViewInit>Angular</h4>
    <p>
      Angular is a development platform, built on TypeScript. As a platform, Angular includes: A component-based
      framework for building scalable web applications A collection of well-integrated libraries that cover a wide
      variety of features, including routing, forms management, client-server communication, and more A suite of
      developer tools to help you develop, build, test, and update your code
    </p>

    <p>Latest Angular versions:</p>
    <ul>
      <li><a [routerLink]="['./angular17']">Angular v17</a></li>
      <li><a [routerLink]="['./angular18']">Angular v18</a></li>
    </ul>
    <router-outlet></router-outlet>
  `,
})
export class AngularDemo {}
