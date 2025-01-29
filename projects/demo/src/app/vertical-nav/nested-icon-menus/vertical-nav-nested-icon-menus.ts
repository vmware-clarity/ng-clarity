/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { VerticalNavCases } from '../vertical-nav-cases';

@Component({
  selector: 'clr-vertical-nav-nested-icon-menus-demo',
  templateUrl: './vertical-nav-nested-icon-menus.demo.html',
  styleUrls: ['../vertical-nav.demo.scss'],
})
export class VerticalNavNestedIconMenusDemo {
  case: any;
  collapse = false;

  constructor(verticalNavCases: VerticalNavCases) {
    this.case = verticalNavCases.allNestedIconMenu;
  }
}
