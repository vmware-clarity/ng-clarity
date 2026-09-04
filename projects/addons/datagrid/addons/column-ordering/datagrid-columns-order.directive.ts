/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Injector,
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
 * `left`/`right` move the column one step, the same as the arrow keys while it is grabbed.
 * `start`/`end` jump it to either edge. Every direction is resolved inside the column's own group of
 * pinned or scrollable columns, because that is the order the user sees.
 */
export type ColumnMoveDirection = 'left' | 'right' | 'start' | 'end';

/**
 * Reorders the columns of a datagrid through drag and drop, the arrow keys, or `moveColumnTo`.
 *
 * The host is responsible for rendering a new order by destroying and recreating the column views,
 * rather than letting Angular relocate the existing ones. A pinned column is rendered in the
 * datagrid's sticky container and the rest in the scrollable one, so a single declared list of
 * columns ends up split across two DOM parents. Reordering the list then makes Angular's `@for`
 * reconciliation relocate a column against a reference node that lives in the other container, and
 * the DOM insert throws - which leaves the header short of columns, because change detection gives
 * up half way through. Rebuilding gives the reconciliation nothing to relocate, which is what makes
 * every move within a column's own group renderable, including reordering the pinned columns with
 * each other. See `rebuildColumnViews` in DatagridComponent.
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
    private readonly columnOrderingService: DatagridColumnsOrderService,
    private readonly injector: Injector,
    @Inject(DOCUMENT) private readonly document: Document
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
          visibleColumnIndices.moveLeft ? 'left' : 'right'
        );

        if (moved) {
          this.columnOrderingService.focusGrabbedColumn.next();
        }
      })
    );
  }

  /**
   * Whether `moveColumnTo` would actually apply for this column and direction, so a menu action can
   * disable itself instead of letting the user attempt a move that does nothing. Only the edges of
   * the column's own group refuse a move.
   */
  canMoveColumn(visibleColumnIndex: number, direction: ColumnMoveDirection): boolean {
    return this.isMoveApplicable(this.computeTargetIndices(visibleColumnIndex, direction));
  }

  /**
   * Moves the column at `visibleColumnIndex` in the given direction. Returns whether it actually
   * moved, so the keyboard path knows whether to put focus back on the column.
   */
  moveColumnTo(visibleColumnIndex: number, direction: ColumnMoveDirection): boolean {
    const indices = this.computeTargetIndices(visibleColumnIndex, direction);

    if (!this.isMoveApplicable(indices)) {
      return false;
    }

    this.reorderColumn(indices);
    return true;
  }

  /**
   * Brings the column actions menu back on the given column, wherever it ended up.
   *
   * Only needed for a move that rebuilt the column views, which destroys the menu along with the
   * column it belonged to. There is no menu left to re-anchor the way pinning does, so the one on the
   * column in its new place is opened instead - the end state a caller wanted, reached by reopening
   * rather than by keeping the original.
   */
  reopenColumnActions(column: ColumnDefinition<any>, direction: ColumnMoveDirection): void {
    this.findColumnActionsTrigger(column)?.focus();

    // Deferred until the click that started the move has finished propagating. The popover closes on
    // an outside click and only ever forgives the event that opened it, so opening the menu while
    // that click is still in flight - from a button that no longer exists - closes it again straight
    // away. The trigger is looked up again here because the rebuild may have replaced it once more.
    afterNextRender(
      () => {
        const trigger = this.findColumnActionsTrigger(column);

        if (!trigger) {
          return;
        }

        trigger.click();

        // Opening a dropdown through its trigger makes it move focus to its first item, which is not
        // the one that was just used. It does that from a timeout of its own - see
        // DropdownFocusHandler.moveToFirstItemWhenOpen - so putting focus back has to be queued
        // behind it rather than done here. Both are zero delay timeouts and this one is queued while
        // the click above is still on the stack, so it always runs second, and the intermediate focus
        // is never painted.
        setTimeout(() => this.focusMoveAction(direction));
      },
      { injector: this.injector }
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

  /**
   * Whether a move resolved by `computeTargetIndices` is worth applying at all: it has to have a
   * target, and that target has to be a different column. Nothing else can refuse it, because the
   * target is always inside the moved column's own group and the host rebuilds the column views.
   */
  private isMoveApplicable(indices: { previousIndex: number; currentIndex: number }): boolean {
    if (indices.previousIndex < 0 || indices.currentIndex < 0) {
      return false;
    }

    return indices.previousIndex !== indices.currentIndex;
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
   * Resolves a direction relative to `previousColumnIndex` (an index into the *visible* columns)
   * into absolute previous/current indices into `dgColumnsOrderColumns`.
   *
   * The target is looked up within the moved column's own group - pinned columns are rendered in the
   * sticky container and the rest in the scrollable one, so those are the neighbours the user
   * actually sees. Reading the neighbour off the full list instead picks a column from the other
   * container whenever a pinned column sits between them in the array, which is both the wrong
   * target and a move that cannot be rendered.
   */
  private computeTargetIndices(previousColumnIndex: number, direction: ColumnMoveDirection) {
    const visibleColumns = this.dgColumnsOrderColumns.filter(column => !column.hidden);
    const previousColumn = visibleColumns[previousColumnIndex];
    const group = visibleColumns.filter(column => !!column.pinned === !!previousColumn?.pinned);
    const groupIndex = group.indexOf(previousColumn);
    const lastGroupIndex = group.length - 1;

    let targetGroupIndex: number;
    switch (direction) {
      case 'start':
        targetGroupIndex = 0;
        break;
      case 'end':
        targetGroupIndex = lastGroupIndex;
        break;
      case 'left':
        targetGroupIndex = groupIndex - 1;
        break;
      case 'right':
        targetGroupIndex = groupIndex + 1;
        break;
    }
    targetGroupIndex = Math.min(Math.max(targetGroupIndex, 0), lastGroupIndex);

    return this.createColumnIndices(previousColumn, group[targetGroupIndex]);
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

  /**
   * Puts focus on the move action of the open menu, so repeating it does not mean finding it again.
   *
   * The menu is rendered into an overlay outside the datagrid, so it is reached through the document
   * rather than through the host element. Only one menu is ever open - the others are kept out of the
   * DOM entirely - so there is no ambiguity about which one this is.
   */
  private focusMoveAction(direction: ColumnMoveDirection): void {
    this.document.querySelector<HTMLElement>(`.dropdown-menu [appfxcolumnmoveaction="${direction}"]`)?.focus();
  }

  /**
   * The column actions trigger of a column, found by position rather than by identity - after a
   * rebuild the elements are not the ones a caller was holding on to.
   *
   * Pinned columns are rendered in the static container ahead of the rest, so the rendered order has
   * to be reconstructed instead of read straight off the column array.
   */
  private findColumnActionsTrigger(column: ColumnDefinition<any>): HTMLElement | null {
    const visibleColumns = this.dgColumnsOrderColumns.filter(other => !other.hidden);
    const renderedColumns = [
      ...visibleColumns.filter(other => other.pinned),
      ...visibleColumns.filter(other => !other.pinned),
    ];
    const renderedIndex = renderedColumns.findIndex(other => isEqualColumns(column, other));

    if (renderedIndex < 0) {
      return null;
    }

    return this.elementRef.nativeElement
      .querySelectorAll<HTMLElement>('.datagrid-column-actions-toggle')
      .item(renderedIndex);
  }

  private findColumnIndex(column: ColumnDefinition<any>) {
    return this.dgColumnsOrderColumns.findIndex(other => {
      return isEqualColumns(column, other);
    });
  }
}
