/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'clr-dropdown-angular-shadow-root-demo',
  templateUrl: './dropdown-angular-shadow-root.demo.html',
  styleUrls: ['./dropdown.demo.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  standalone: false,
})
export class DropdownAngularShadowRootDemo {}
