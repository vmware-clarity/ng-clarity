/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClrIcon } from '@clr/angular/src/icon';
import { ClrHostWrappingModule } from '@clr/angular/src/utils';

import { ClrBreadcrumbItem } from './breadcrumb-item';
import { ClrBreadcrumbs } from './breadcrumbs';

@NgModule({
  declarations: [ClrBreadcrumbs, ClrBreadcrumbItem],
  exports: [ClrBreadcrumbs, ClrIcon],
  imports: [CommonModule, ClrIcon, ClrHostWrappingModule, RouterModule],
})
export class ClrBreadcrumbsModule {}
