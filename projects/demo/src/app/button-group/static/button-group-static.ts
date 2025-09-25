/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-button-group-static-demo',
  styleUrls: ['../button-group.demo.scss'],
  template: `
    <h4>Static Styles</h4>
    <ul>
      <li><a [routerLink]="['./basic-structure']">Basic Structure</a></li>
      <li><a [routerLink]="['./types']">Types</a></li>
      <li><a [routerLink]="['./directions']">Directions</a></li>
      <li><a [routerLink]="['./icons']">Icons</a></li>
      <li><a [routerLink]="['./icon-button-group']">Icon Button Group</a></li>
      <li><a [routerLink]="['./icons-with-text']">Icons with Text</a></li>
      <li><a [routerLink]="['./checkboxes']">Checkboxes</a></li>
      <li><a [routerLink]="['./radios']">Radios</a></li>
      <li><a [routerLink]="['./cards']">Cards</a></li>
    </ul>
    <router-outlet></router-outlet>
  `,
  standalone: false,
})
export class ButtonGroupStaticDemo {}
