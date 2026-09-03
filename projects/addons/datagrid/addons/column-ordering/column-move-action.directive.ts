/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, HostListener, Input } from '@angular/core';

import { ColumnMoveDirection, DatagridColumnsOrderDirective } from './datagrid-columns-order.directive';

/**
 * Moves this column left, right, to the start, or to the end of the reorderable columns, meant for
 * a `clrDgColumnAction` item inside a column's `clr-dg-column-actions` menu.
 *
 * The move itself, and whether it is even possible right now, both live on
 * `DatagridColumnsOrderDirective` - the same place the mouse and keyboard reordering already go
 * through, so a menu action can never apply a move those paths would refuse. This directive only
 * connects a menu item's index and direction to that.
 *
 * `DatagridColumnsOrderDirective` is injected rather than `DatagridColumnsOrderService`, because
 * the column order array (`dgColumnsOrderColumns`) that the pinned-column guard needs lives on the
 * directive, not the service.
 */
@Directive({
  selector: '[appfxColumnMoveAction]',
  exportAs: 'appfxColumnMoveAction',
  standalone: false,
})
export class ColumnMoveActionDirective {
  @Input('appfxColumnMoveAction') direction: ColumnMoveDirection;

  @Input() columnIndex: number;

  constructor(private readonly columnsOrderDirective: DatagridColumnsOrderDirective) {}

  get disabled(): boolean {
    return !this.columnsOrderDirective.canMoveColumn(this.columnIndex, this.direction);
  }

  @HostListener('click')
  protected onClick() {
    if (!this.disabled) {
      this.columnsOrderDirective.moveColumnTo(this.columnIndex, this.direction);
    }
  }
}
