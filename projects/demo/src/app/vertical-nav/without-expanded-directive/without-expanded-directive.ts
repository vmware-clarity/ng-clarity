/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { VerticalNavCases } from '../vertical-nav-cases';

@Component({
  selector: 'clr-without-expanded-directive-demo',
  templateUrl: './without-expanded-directive.html',
  styleUrls: ['../vertical-nav.demo.scss'],
  standalone: false,
})
export class WithoutExpandedDirectiveDemo {
  case: any;
  option = 'text';
  groupExpand = true;
  navCollapsed = false;

  constructor(verticalNavCases: VerticalNavCases) {
    this.case = verticalNavCases.allNestedIconMenu;
  }

  updateGroupExpand(event: any) {
    this.groupExpand = event;
  }

  updateNavCollapsed(val: boolean): void {
    this.navCollapsed = val;
  }

  toggleNav(): void {
    this.navCollapsed = !this.navCollapsed;
  }

  toggleGroup(): void {
    this.groupExpand = !this.groupExpand;
  }
}
