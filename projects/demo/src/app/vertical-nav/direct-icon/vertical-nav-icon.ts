/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { VerticalNavCases } from '../vertical-nav-cases';

@Component({
  selector: 'clr-vertical-nav-direct-icon-demo',
  templateUrl: './vertical-nav-icon.demo.html',
  styleUrls: ['../vertical-nav.demo.scss'],
})
export class VerticalNavDirectIconDemo {
  case: any;

  private _collapse = false;

  constructor(verticalNavCases: VerticalNavCases) {
    this.case = verticalNavCases.iconMenu;
  }

  get collapse(): boolean {
    return this._collapse;
  }
  set collapse(value: boolean) {
    this._collapse = value;
  }
}
