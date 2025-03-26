/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';

import { BreadcrumbsHrefDemo } from './breadcrumbs-href.demo';
import { BreadcrumbsRoutingDemo } from './breadcrumbs-routing.demo';
import { BreadcrumbsDemo } from './breadcrumbs.demo';
import { ROUTING } from './breadcrumbs.demo.routing';
import { WNCotmanDemo } from './pages/coltman';
import { DanielSmithDemo } from './pages/daniel-smith';
import { OilsDemo } from './pages/oils';
import { PaintsDemo } from './pages/paints';
import { PaintsListDemo } from './pages/paintsList';
import { WNProfessionalDemo } from './pages/professional';
import { WatercolorDemo } from './pages/watercolor';
import { WatercolorListDemo } from './pages/watercolorList';
import { WinsorNewtonDemo } from './pages/winsor-newton';

@NgModule({
  imports: [CommonModule, ClarityModule, ROUTING],
  declarations: [
    BreadcrumbsHrefDemo,
    BreadcrumbsRoutingDemo,
    BreadcrumbsDemo,
    PaintsDemo,
    PaintsListDemo,
    OilsDemo,
    WatercolorDemo,
    WNCotmanDemo,
    WatercolorListDemo,
    WinsorNewtonDemo,
    WNProfessionalDemo,
    DanielSmithDemo,
  ],
  exports: [
    BreadcrumbsHrefDemo,
    BreadcrumbsRoutingDemo,
    BreadcrumbsDemo,
    PaintsDemo,
    PaintsListDemo,
    OilsDemo,
    WatercolorDemo,
    WNCotmanDemo,
    WatercolorListDemo,
    WinsorNewtonDemo,
    WNProfessionalDemo,
    DanielSmithDemo,
  ],
})
export class BreadcrumbsDemoModule {}
