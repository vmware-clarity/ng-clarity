/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';

import { BreadcrumbsDemo } from './breadcrumbs.demo';
import { ROUTING } from './breadcrumbs.demo.routing';
import { DanielSmithDemo } from './pages/daniel-smith';
import { OilsDemo } from './pages/oils';
import { PaintsDemo } from './pages/paints';
import { WatercolorDemo } from './pages/watercolor';
import { WinsorNewtonDemo } from './pages/winsor-newton';

@NgModule({
  imports: [CommonModule, ClarityModule, ROUTING],
  declarations: [BreadcrumbsDemo, PaintsDemo, OilsDemo, WatercolorDemo, WinsorNewtonDemo, DanielSmithDemo],
  exports: [BreadcrumbsDemo, PaintsDemo, OilsDemo, WatercolorDemo, WinsorNewtonDemo, DanielSmithDemo],
})
export class BreadcrumbsDemoModule {}
