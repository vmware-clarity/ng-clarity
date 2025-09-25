/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, OnDestroy } from '@angular/core';

import { DatagridRowRenderer } from './row-renderer';
import { ColumnsService } from '../providers/columns.service';

@Directive({
  selector: 'clr-dg-row-detail',
  standalone: false,
})
export class DatagridRowDetailRenderer extends DatagridRowRenderer implements OnDestroy {
  constructor(
    private parentRow: DatagridRowRenderer,
    columnsService: ColumnsService
  ) {
    super(columnsService);
    parentRow.expandableRows.push(this);
  }

  override ngOnDestroy() {
    this.parentRow.expandableRows = [];
    super.ngOnDestroy();
  }
}
