/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClrIcon } from '@clr/angular/icon';
import { ClrHostWrappingModule } from '@clr/angular/utils';

import { ClrBreadcrumbItem } from './breadcrumb-item';
import { ClrBreadcrumbs } from './breadcrumbs';

@NgModule({
  declarations: [ClrBreadcrumbs, ClrBreadcrumbItem],
  exports: [ClrBreadcrumbs, ClrIcon],
  imports: [CommonModule, ClrIcon, ClrHostWrappingModule, RouterModule],
})
export class ClrBreadcrumbsModule {}
