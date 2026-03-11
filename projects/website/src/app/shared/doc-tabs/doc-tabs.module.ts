/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';

import { DocTabActiveDirective } from './doc-tab-active.directive';
import { DocTabComponent } from './doc-tab.component';
import { DocTabsComponent } from './doc-tabs.component';

/**
 * This is a convenience module which exports a group of standalone components/directives that are used together.
 */
@NgModule({
  imports: [DocTabsComponent, DocTabComponent, DocTabActiveDirective],
  exports: [DocTabsComponent, DocTabComponent, DocTabActiveDirective],
})
export class DocTabsModule {}
