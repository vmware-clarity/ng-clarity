/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { VerticalNavCases } from '../vertical-nav-cases';

@Component({
  selector: 'clr-vertical-nav-basic-demo',
  templateUrl: './vertical-nav-basic.demo.html',
  styleUrls: ['../vertical-nav.demo.scss'],
})
export class VerticalNavBasicDemo {
  case: any;

  constructor(verticalNavCases: VerticalNavCases) {
    this.case = verticalNavCases.basicMenu;
  }
}
