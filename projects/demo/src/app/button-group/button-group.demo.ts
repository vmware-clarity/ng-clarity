/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-button-group-demo',
  styleUrls: ['./button-group.demo.scss'],
  template: `
    <h2>Button Group</h2>
    <ul>
      <li><a [routerLink]="['./static']">Static styles</a></li>
      <li><a [routerLink]="['./angular']">Angular component</a></li>
    </ul>
    <router-outlet></router-outlet>
  `,
  standalone: false,
})
export class ButtonGroupDemo {}
