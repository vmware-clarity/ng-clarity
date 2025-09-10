/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-modal-demo',
  template: `
    <h2>Modal</h2>

    <ul>
      <li><a [routerLink]="['./static']">Modal Styles</a></li>
      <li><a [routerLink]="['./old-close-button']">Old Close Buttons</a></li>
      <li><a [routerLink]="['./sizes']">Modal Sizes</a></li>
      <li><a [routerLink]="['./max-height']">Max-Height</a></li>
      <li><a [routerLink]="['./backdrop']">Modal Backdrop</a></li>
      <li><a [routerLink]="['./animation']">Animation</a></li>
      <li><a [routerLink]="['./dynamic-show']">Hide and Show Dynamically</a></li>
      <li><a [routerLink]="['./dynamic-sizing']">Dynamically Change Sizes</a></li>
      <li><a [routerLink]="['./static-backdrop']">Close When Clicking Backdrop</a></li>
      <li><a [routerLink]="['./not-closable']">Force User Action</a></li>
      <li><a [routerLink]="['./focus-trap']">Trap User Focus</a></li>
      <li><a [routerLink]="['./modal-form']">Modal Form</a></li>
    </ul>

    <router-outlet></router-outlet>
  `,
  standalone: false,
})
export class ModalDemo {}
