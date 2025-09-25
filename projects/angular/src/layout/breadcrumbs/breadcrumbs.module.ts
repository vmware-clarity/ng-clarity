/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ClrBreadcrumbItem } from './breadcrumb-item';
import { ClrBreadcrumbs } from './breadcrumbs';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';

@NgModule({
  declarations: [ClrBreadcrumbs, ClrBreadcrumbItem],
  exports: [ClrBreadcrumbs],
  imports: [CommonModule, ClrIconModule, ClrHostWrappingModule, RouterModule],
})
export class ClrBreadcrumbsModule {}
