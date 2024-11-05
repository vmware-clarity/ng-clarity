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
import { BreadcrumbsDemoService } from './breadcrumbs.demo.service';
import { AngularDemo } from './pages/angular';
import { Angular17Demo } from './pages/angular17';
import { Angular18Demo } from './pages/angular18';
import { FrameworkDemo } from './pages/framework';
import { ReactDemo } from './pages/react';

@NgModule({
  imports: [CommonModule, ClarityModule, ROUTING],
  declarations: [BreadcrumbsDemo, AngularDemo, ReactDemo, Angular17Demo, Angular18Demo, FrameworkDemo],
  providers: [BreadcrumbsDemoService],
  exports: [BreadcrumbsDemo, AngularDemo, ReactDemo, Angular17Demo, Angular18Demo, FrameworkDemo],
})
export class BreadcrumbsDemoModule {}
