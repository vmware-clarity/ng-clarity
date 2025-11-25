/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';
import { ClrBreadcrumbsModule } from '@clr/angular/src/layout/breadcrumbs';
import { ClrMainContainerModule } from '@clr/angular/src/layout/main-container';
import { ClrNavigationModule } from '@clr/angular/src/layout/nav';
import { ClrTabsModule } from '@clr/angular/src/layout/tabs';
import { ClrVerticalNavModule } from '@clr/angular/src/layout/vertical-nav';

@NgModule({
  exports: [ClrMainContainerModule, ClrNavigationModule, ClrTabsModule, ClrVerticalNavModule, ClrBreadcrumbsModule],
})
export class ClrLayoutModule {}
