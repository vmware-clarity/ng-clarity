/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
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

  constructor(public verticalNavCases: VerticalNavCases) {
    this.case = this.verticalNavCases.iconMenu;
  }

  get collapse(): boolean {
    return this._collapse;
  }
  set collapse(value: boolean) {
    this._collapse = value;
  }
}
