/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, HostListener, Input, Optional } from '@angular/core';
import { ClrDatagridColumnActions } from '@clr/angular/data/datagrid';

import { ColumnMoveDirection, DatagridColumnsOrderDirective } from './datagrid-columns-order.directive';

/**
 * Moves this column left, right, to the start, or to the end of the reorderable columns, meant for
 * a `clrDropdownItem` inside a column's `clr-dg-column-actions` menu. The item should keep the menu
 * open with `[clrCloseMenuOnClick]="false"`, so the move can be repeated; this directive then keeps
 * the menu attached to the column it belongs to.
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

  constructor(
    private readonly columnsOrderDirective: DatagridColumnsOrderDirective,
    private readonly elementRef: ElementRef<HTMLElement>,
    // Resolvable because the item is projected into the menu, whose host is on its injector path.
    @Optional() private readonly columnActions: ClrDatagridColumnActions | null
  ) {}

  get disabled(): boolean {
    return !this.columnsOrderDirective.canMoveColumn(this.columnIndex, this.direction);
  }

  @HostListener('click')
  protected onClick() {
    if (this.disabled) {
      return;
    }

    // Read before the move, because afterwards this index points at whichever column took its place.
    const column = this.columnsOrderDirective.dgColumnsOrderColumns.filter(other => !other.hidden)[this.columnIndex];

    if (!this.columnsOrderDirective.moveColumnTo(this.columnIndex, this.direction) || !column) {
      return;
    }

    // Normally the menu survives the move, so it only has to be re-anchored to the trigger, which
    // travelled with the column. Once a column is pinned though, applying the move rebuilds the
    // column views, and this very button is destroyed with the column it belonged to - there is no
    // menu left to re-anchor, so the one on the column in its new place is opened instead to end up
    // in the same state.
    if (this.elementRef.nativeElement.isConnected) {
      this.columnActions?.repositionMenu();
    } else {
      this.columnsOrderDirective.reopenColumnActions(column, this.direction);
    }
  }
}
