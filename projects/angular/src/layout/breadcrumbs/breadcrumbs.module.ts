/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ClrIconModule } from '../../icon/icon.module';
import { ClrHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';
import { ClrBreadcrumbItem } from './breadcrumb-item';
import { ClrBreadcrumbs } from './breadcrumbs';

@NgModule({
  declarations: [ClrBreadcrumbs, ClrBreadcrumbItem],
  exports: [ClrBreadcrumbs, ClrBreadcrumbItem, RouterModule],
  imports: [CommonModule, ClrIconModule, ClrHostWrappingModule, RouterModule],
})
export class ClrBreadcrumbsModule {}
