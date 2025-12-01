/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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

import { ColumnOrderChanged } from '../../interfaces/column-state';
import { ColumnDefinition } from '../../shared/column/column-definitions';
import { isEqualColumns } from './datagrid-columns-order.helpers';
import { DatagridColumnsOrderService } from './datagrid-columns-order.service';

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
          filter(columnIndices => columnIndices.currentIndex !== columnIndices.previousIndex)
        )
        .subscribe(columnIndices => {
          this.reorderColumn(columnIndices);
        })
    );

    this.subs.add(
      this.columnOrderingService.moveVisibleColumn
        .pipe(
          map(visibleColumnIndices => {
            return this.getColumnIndices(visibleColumnIndices.moveLeft, visibleColumnIndices.visibleColumnIndex);
          }),
          filter(columnIndices => {
            return columnIndices.previousIndex !== columnIndices.currentIndex;
          })
        )
        .subscribe(columnIndices => {
          this.reorderColumn(columnIndices);
          this.columnOrderingService.focusGrabbedColumn.next();
        })
    );
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

  private reorderColumn(indices: { previousIndex: number; currentIndex: number }) {
    const value = [...this.dgColumnsOrderColumns];
    moveItemInArray(value, indices.previousIndex, indices.currentIndex);
    this.dgColumnsOrderColumns = value;
    this.dgColumnsOrderChange.emit({ ...indices, columns: this.dgColumnsOrderColumns });
  }

  private getColumnIndices(moveLeft: boolean, previousColumnIndex: number) {
    const visibleColumns = this.dgColumnsOrderColumns.filter(column => !column.hidden);
    const newVisibleColumnIndex = moveLeft ? previousColumnIndex - 1 : previousColumnIndex + 1;
    let currenColumnIndex = newVisibleColumnIndex >= 0 ? newVisibleColumnIndex : 0;
    currenColumnIndex = currenColumnIndex < visibleColumns.length - 1 ? currenColumnIndex : visibleColumns.length - 1;
    const previousColumn = visibleColumns[previousColumnIndex];
    const currentColumn = visibleColumns[currenColumnIndex];
    return this.createColumnIndices(previousColumn, currentColumn);
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
