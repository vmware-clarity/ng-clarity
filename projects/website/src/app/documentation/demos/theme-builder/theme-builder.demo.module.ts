/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ThemeBuilderAddonDemo } from './theme-builder.demo';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: ThemeBuilderAddonDemo }]), ThemeBuilderAddonDemo],
  exports: [ThemeBuilderAddonDemo],
})
export class ThemeBuilderAddonDemoModule {}
