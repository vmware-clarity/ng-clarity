/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'app-breadcrumb-dashboard-example',
  template: ` <h2>Framework</h2>
    <p>
      A front-end development framework is a pre-written collection of standardized HTML, CSS, and JavaScript code that
      developers can use to build web applications or websites more efficiently. Front-end frameworks typically provide
      a set of tools, libraries, and conventions for building user interfaces, handling events, managing application
      states, and interacting with APIs.
    </p>
    <p>We have the below UI frameworks:</p>
    <ul>
      <li><a [routerLink]="['./angular']">Angular</a></li>
      <li><a [routerLink]="['./react']">React</a></li>
    </ul>`,
  standalone: false,
})
export class BreadcrumbDashboardExample {}
