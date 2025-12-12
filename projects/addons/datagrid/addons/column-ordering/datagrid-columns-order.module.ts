/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrDatagridModule } from '@clr/angular';

import { ColumnOrderDirective } from './column-order.directive';
import { DatagridColumnsOrderDirective } from './datagrid-columns-order.directive';

@NgModule({
  declarations: [ColumnOrderDirective, DatagridColumnsOrderDirective],
  imports: [ClrDatagridModule, CommonModule, DragDropModule],
  exports: [ColumnOrderDirective, DatagridColumnsOrderDirective],
})
export class DatagridColumnsOrderModule {}
