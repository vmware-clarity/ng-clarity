/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { LayoutNoSubnavDemo } from './layout-no-subnav';
import { LayoutNoVerticalNavDemo } from './layout-no-vertical-nav';
import { LayoutOnlyHeaderDemo } from './layout-only-header';
import { LayoutSubnavPrimaryDemo } from './layout-subnav-primary';
import { LayoutVerticalNavPrimaryDemo } from './layout-vertical-nav-primary';

@Component({
  selector: 'clr-navigation-types-demo',
  templateUrl: './navigation-types.demo.html',
  imports: [
    LayoutNoVerticalNavDemo,
    LayoutNoSubnavDemo,
    LayoutOnlyHeaderDemo,
    LayoutVerticalNavPrimaryDemo,
    LayoutSubnavPrimaryDemo,
  ],
})
export class NavigationTypesDemo {}
