/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';

import { LayoutAdditionalSectionsDemo } from './layout-additional-sections';
import { LayoutAllDemo } from './layout-all';
import { LayoutNoSubnavDemo } from './layout-no-subnav';
import { LayoutNoVerticalNavDemo } from './layout-no-vertical-nav';
import { LayoutOnlyHeaderDemo } from './layout-only-header';
import { LayoutSizeDemo } from './layout-size';
import { LayoutSubnavPrimaryDemo } from './layout-subnav-primary';
import { LayoutVerticalNavPrimaryDemo } from './layout-vertical-nav-primary';
import { LayoutDemo } from './layout.demo';
import { ROUTING } from './layout.demo.routing';

@NgModule({
  imports: [CommonModule, ClarityModule, ROUTING],
  declarations: [
    LayoutDemo,
    LayoutAllDemo,
    LayoutNoSubnavDemo,
    LayoutNoVerticalNavDemo,
    LayoutOnlyHeaderDemo,
    LayoutSubnavPrimaryDemo,
    LayoutVerticalNavPrimaryDemo,
    LayoutAdditionalSectionsDemo,
    LayoutSizeDemo,
  ],
  exports: [
    LayoutDemo,
    LayoutAllDemo,
    LayoutNoSubnavDemo,
    LayoutNoVerticalNavDemo,
    LayoutOnlyHeaderDemo,
    LayoutSubnavPrimaryDemo,
    LayoutVerticalNavPrimaryDemo,
    LayoutAdditionalSectionsDemo,
    LayoutSizeDemo,
  ],
})
export class LayoutDemoModule {}
