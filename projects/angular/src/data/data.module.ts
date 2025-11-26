/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';
import { ClrDatagridModule } from '@clr/angular/src/data/datagrid';
import { ClrStackViewModule } from '@clr/angular/src/data/stack-view';
import { ClrTreeViewModule } from '@clr/angular/src/data/tree-view';

@NgModule({
  exports: [ClrDatagridModule, ClrStackViewModule, ClrTreeViewModule],
})
export class ClrDataModule {}
