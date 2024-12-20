/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';

import { ClrBreadcrumbsModule } from './breadcrumbs';
import { ClrMainContainerModule } from './main-container/main-container.module';
import { ClrNavigationModule } from './nav/navigation.module';
import { ClrTabsModule } from './tabs/tabs.module';
import { ClrVerticalNavModule } from './vertical-nav/vertical-nav.module';

@NgModule({
  exports: [ClrMainContainerModule, ClrNavigationModule, ClrTabsModule, ClrVerticalNavModule, ClrBreadcrumbsModule],
})
export class ClrLayoutModule {}
