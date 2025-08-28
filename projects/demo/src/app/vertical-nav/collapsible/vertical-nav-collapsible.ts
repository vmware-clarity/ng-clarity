/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { VerticalNavCases } from '../vertical-nav-cases';

@Component({
  selector: 'clr-vertical-nav-collapsible-demo',
  templateUrl: './vertical-nav-collapsible.demo.html',
  styleUrls: ['../vertical-nav.demo.scss'],
  standalone: false,
})
export class VerticalNavCollapsibleDemo {
  case: any;
  collapsible = true;

  private _collapse = true;

  constructor(verticalNavCases: VerticalNavCases) {
    this.case = verticalNavCases.basicMenu;
  }

  get collapse(): boolean {
    return this._collapse;
  }
  set collapse(value: boolean) {
    this._collapse = value;
  }

  toggleCollapsible(): void {
    this.collapsible = !this.collapsible;
  }

  toggleCollapse(): void {
    this.collapse = !this.collapse;
  }
}
