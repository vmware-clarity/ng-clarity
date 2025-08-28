/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { VerticalNavCases } from '../vertical-nav-cases';

@Component({
  selector: 'clr-vertical-nav-header-and-divider-demo',
  templateUrl: './vertical-nav-header-and-divider.demo.html',
  styleUrls: ['../vertical-nav.demo.scss'],
  standalone: false,
})
export class VerticalNavHeaderAndDividerDemo {
  case: any;

  constructor(verticalNavCases: VerticalNavCases) {
    this.case = verticalNavCases.basicMenu;
  }
}
