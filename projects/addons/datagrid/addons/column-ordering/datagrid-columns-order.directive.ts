/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { map, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { isEqualColumns } from './datagrid-columns-order.helpers';
import { DatagridColumnsOrderService } from './datagrid-columns-order.service';
import { ColumnOrderChanged } from '../../interfaces/column-state';
import { ColumnDefinition } from '../../shared/column/column-definitions';

/**
 * The direction of a one step column move, the same as the arrow keys while a column is grabbed.
 */
export enum ColumnMoveDirection {
  Left = 'left',
  Right = 'right',
}

/**
 * Reorders the columns of a datagrid through drag and drop, the arrow keys, or `moveColumnTo`.
 *
 * Pinned columns are not moved. The datagrid renders them in its sticky container and the rest in
 * the scrollable one, so a single declared list of columns is split across two DOM parents, and
 * reordering pinned columns makes Angular's `@for` relocate a column against a reference node in the
 * other container - the DOM insert throws. Moves between the scrollable columns are not affected.
 */
@Directive({
  selector: 'clr-datagrid[appfxDgColumnsOrder]',
  providers: [DatagridColumnsOrderService],
  standalone: false,
})
export class DatagridColumnsOrderDirective implements OnInit, OnDestroy, OnChanges {
  @Input() dgColumnsOrderColumns: ColumnDefinition<any>[];

  @Input() dgColumnsVirtualScrolling = false;

  @Output() dgColumnsOrderChange = new EventEmitter<ColumnOrderChanged>();
  private subs = new Subscription();

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly cdkDropList: CdkDropList,
    private readonly columnOrderingService: DatagridColumnsOrderService
  ) {
    cdkDropList.orientation = 'horizontal';
  }

  ngOnInit() {
    this.subs.add(
      this.cdkDropList.dropped
        .pipe(
          filter(droppedData => !!droppedData?.item?.data?.displayName),
          map(droppedData => {
            return this.findColumnIndices(droppedData.item.data, droppedData.currentIndex);
          }),
          filter(columnIndices => columnIndices.currentIndex !== columnIndices.previousIndex),
          filter(columnIndices => this.isReorderAllowed(columnIndices))
        )
        .subscribe(columnIndices => {
          this.reorderColumn(columnIndices);
        })
    );

    // The arrow keys go through moveColumnTo() as well, so the keyboard and the column actions menu
    // can never disagree about which move is possible.
    this.subs.add(
      this.columnOrderingService.moveVisibleColumn.subscribe(visibleColumnIndices => {
        const moved = this.moveColumnTo(
          visibleColumnIndices.visibleColumnIndex,
          visibleColumnIndices.moveLeft ? ColumnMoveDirection.Left : ColumnMoveDirection.Right
        );

        if (moved) {
          this.columnOrderingService.focusGrabbedColumn.next();
        }
      })
    );
  }

  /**
   * Whether `moveColumnTo` would actually apply for this column and direction, so a menu action can
   * disable itself instead of letting the user attempt a move that does nothing. A pinned column, or
   * one at either edge of the scrollable columns, has no move to make.
   */
  canMoveColumn(visibleColumnIndex: number, direction: ColumnMoveDirection): boolean {
    return !!this.computeTargetIndices(visibleColumnIndex, direction);
  }

  /**
   * Moves the column at `visibleColumnIndex` in the given direction. Returns whether it actually
   * moved, so the keyboard path knows whether to put focus back on the column.
   */
  moveColumnTo(visibleColumnIndex: number, direction: ColumnMoveDirection): boolean {
    const indices = this.computeTargetIndices(visibleColumnIndex, direction);

    if (!indices) {
      return false;
    }

    this.reorderColumn(indices);
    return true;
  }

  setDgColumnsContainer(): void {
    // Clarity doesn't expose the scrollable datagrid container, and I didn't find a way to
    // get it from the parent component or directive, so we need to use querySelector
    // When virtualScrolling is enabled grid data and grid header are split into two different
    // scrollable containers. In this case we aim for the grid header.
    let selector = 'div.datagrid';
    if (this.dgColumnsVirtualScrolling) {
      selector += ' div.datagrid-header';
    }
    const scrollableContainer = this.elementRef.nativeElement.querySelector(selector) as HTMLElement;
    if (scrollableContainer) {
      // A workaround for the cdkDropList directive. The issue is that draggable columns are not direct
      // children of the drop list container on which the cdkDropList directive is applied. The selector
      // that can be provided to the cdkDropList directive and that directive can use to find an alternate
      // element container for the drop list container doesn't work. The clarity column separators are
      // draggable and inside column elements, and the drop list container is not their parent.
      // The correct fix is the clarity to support column reordering as they have better access to the
      // datagrid dom structure.
      (this.cdkDropList._dropListRef as any)._container = scrollableContainer;
      this.cdkDropList._dropListRef.element = scrollableContainer;
      this.cdkDropList.element = new ElementRef<HTMLElement>(scrollableContainer);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dgColumnsVirtualScrolling']) {
      this.setDgColumnsContainer();
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  /**
   * Guards the drag and drop path, where a drop can target any column and so is not confined to the
   * dragged column's own group. Dropping a loose column among the pinned ones does not pin it, it
   * only changes where it sits in the list, so the column would stay in the scrollable container and
   * land somewhere the user did not aim for. A drop that spans a pinned column is refused instead.
   *
   * `moveColumnTo` does not need this: it always resolves a target inside the moved column's own
   * group, so it can never cross the boundary in the first place.
   */
  private isReorderAllowed(indices: { previousIndex: number; currentIndex: number }): boolean {
    if (indices.previousIndex < 0 || indices.currentIndex < 0) {
      return false;
    }

    const from = Math.min(indices.previousIndex, indices.currentIndex);
    const to = Math.max(indices.previousIndex, indices.currentIndex);

    // Only rendered columns matter, a hidden pinned column is not in either container.
    return !this.dgColumnsOrderColumns.slice(from, to + 1).some(column => column.pinned && !column.hidden);
  }

  private reorderColumn(indices: { previousIndex: number; currentIndex: number }) {
    const value = [...this.dgColumnsOrderColumns];
    moveItemInArray(value, indices.previousIndex, indices.currentIndex);
    this.dgColumnsOrderColumns = value;
    this.dgColumnsOrderChange.emit({ ...indices, columns: this.dgColumnsOrderColumns });
  }

  /**
   * Resolves a one step move of the column at `visibleColumnIndex` (an index into the visible columns)
   * into indices into `dgColumnsOrderColumns`, or `null` when there is no move to make.
   *
   * The neighbour is taken among the scrollable columns, because those are the ones the user sees side
   * by side - a pinned column between them in the array is rendered in the other container. A pinned
   * column itself is not moved, see the class comment.
   */
  private computeTargetIndices(visibleColumnIndex: number, direction: ColumnMoveDirection) {
    const column = this.dgColumnsOrderColumns.filter(other => !other.hidden)[visibleColumnIndex];
    const scrollableColumns = this.dgColumnsOrderColumns.filter(other => !other.hidden && !other.pinned);
    const index = scrollableColumns.indexOf(column);
    const target = scrollableColumns[index + (direction === ColumnMoveDirection.Left ? -1 : 1)];

    if (index < 0 || !target) {
      return null;
    }

    return this.createColumnIndices(column, target);
  }

  private findColumnIndices(previousColumn: ColumnDefinition<any>, currentDroppedItemIndex: number) {
    const mappedColumnDragItems = this.cdkDropList.getSortedItems().map(item => item.data);

    const currentColumn = mappedColumnDragItems.find((column, index) => {
      //For some reason the index of the dropped item in the dropped event start from 1 not from 0
      return index >= currentDroppedItemIndex - 1 && !!column;
    });

    return this.createColumnIndices(previousColumn, currentColumn);
  }

  private createColumnIndices(previousColumn: ColumnDefinition<any>, currentColumn: ColumnDefinition<any>) {
    const previousIndex = this.findColumnIndex(previousColumn);
    const currentIndex = this.findColumnIndex(currentColumn);
    return {
      previousIndex: previousIndex,
      currentIndex: currentIndex,
    };
  }

  private findColumnIndex(column: ColumnDefinition<any>) {
    return this.dgColumnsOrderColumns.findIndex(other => {
      return isEqualColumns(column, other);
    });
  }
}
