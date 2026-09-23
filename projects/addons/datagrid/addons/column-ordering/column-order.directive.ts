/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkDrag } from '@angular/cdk/drag-drop';
import {
  AfterContentInit,
  afterNextRender,
  ChangeDetectorRef,
  ContentChild,
  contentChildren,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ClrDatagrid, ClrDatagridColumnActions } from '@clr/angular/data/datagrid';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ColumnMoveActionDirective } from './column-move-action.directive';
import { ColumnMoveDirection } from './datagrid-columns-order.directive';
import { getDatagridKeyNavigationController, isEqualColumns } from './datagrid-columns-order.helpers';
import { DatagridColumnsOrderService } from './datagrid-columns-order.service';
import { ColumnDefinition } from '../../shared/column/column-definitions';

@Directive({
  selector: 'clr-dg-column[appfxColumnOrder]',
  standalone: false,
})
export class ColumnOrderDirective implements AfterContentInit, OnDestroy, OnInit {
  @HostBinding('class.grabbed') isGrabbed = false;

  @Input() columnData: ColumnDefinition<any>;

  @Input() columnIndex: number;

  @ContentChild(ClrDatagridColumnActions) private columnActions: ClrDatagridColumnActions | undefined;

  // Projected into the menu, but created along with this column - they exist while the menu is closed.
  private readonly moveActions = contentChildren(ColumnMoveActionDirective, { descendants: true });

  private subs = new Subscription();

  constructor(
    private readonly datagrid: ClrDatagrid,
    readonly elementRef: ElementRef<HTMLElement>,
    private readonly columnOrderingService: DatagridColumnsOrderService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly cdkDrag: CdkDrag,
    private readonly injector: Injector
  ) {
    cdkDrag.previewContainer = 'parent';
  }

  @HostListener('keydown', ['$event'])
  keydown(event: KeyboardEvent) {
    const isColumnTarget = (event.target as HTMLElement)?.tagName === 'CLR-DG-COLUMN';
    if (!isColumnTarget) {
      return;
    }

    const isSpace = event.code === 'Space';
    const isLeft = event.code === 'ArrowLeft';
    const isRight = event.code === 'ArrowRight';
    const isUp = event.code === 'ArrowUp';
    const isDown = event.code === 'ArrowDown';
    const isEsc = event.code === 'Escape';
    const isCurrentColumnGrabbed = isEqualColumns(this.columnData, this.columnOrderingService.grabbedColumn.value);
    // A pinned column is rendered in the sticky container instead of the scrollable one, so it is
    // not part of the reorderable group. Mouse dragging is refused through cdkDragDisabled, and
    // keyboard reordering has to be refused here for the same reason. Releasing stays allowed, so a
    // column that gets pinned while it is grabbed can still be let go of.
    const isReorderable = !this.columnData?.pinned;

    if (isCurrentColumnGrabbed && (isLeft || isRight) && isReorderable) {
      event.stopImmediatePropagation();
      event.preventDefault();
      this.moveColumn(isLeft);
    }

    if (isSpace) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }

    if (isCurrentColumnGrabbed && (isEsc || isDown || isUp || isSpace)) {
      // Remove grabbed css of the columns
      this.columnOrderingService.grabbedColumn.next(null);
    }

    if (!isCurrentColumnGrabbed && isSpace && isReorderable) {
      // Set grabbed css of the column provided as parameter
      this.columnOrderingService.grabbedColumn.next(this.columnData);
    }
  }

  ngOnInit() {
    this.subs.add(
      this.columnOrderingService.grabbedColumn
        .pipe(
          filter(other => {
            return isEqualColumns(this.columnData, other) !== this.isGrabbed;
          })
        )
        .subscribe(() => {
          this.updateGrabbedState();
        })
    );

    this.subs.add(
      this.columnOrderingService.focusGrabbedColumn.pipe(filter(() => this.isGrabbed)).subscribe(() => {
        this.setActiveCell();
      })
    );

    this.subs.add(
      this.cdkDrag.started.subscribe(() => {
        //Remove grabbed css of the columns, when user start dragging with the mouse
        this.columnOrderingService.grabbedColumn.next(null);
      })
    );
  }

  ngAfterContentInit() {
    this.subs.add(
      this.columnOrderingService.reopenColumnActions
        .pipe(filter(request => !!request && isEqualColumns(this.columnData, request.column)))
        .subscribe(request => this.reopenColumnActions(request))
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private moveColumn(isLeft: boolean) {
    this.columnOrderingService.moveVisibleColumn.next({
      moveLeft: isLeft,
      visibleColumnIndex: this.columnIndex,
    });
  }

  /**
   * Opens this column's actions menu on the move action that was just used, for a move that
   * destroyed the menu the user had open. See `DatagridColumnsOrderService.reopenColumnActions`.
   */
  private reopenColumnActions(request: { column: ColumnDefinition<any>; direction: ColumnMoveDirection }) {
    // Deferred until the click that started the move has finished propagating. The popover closes
    // on an outside click and only forgives the event that opened it, so opening it while that click
    // is still in flight would close it again straight away.
    //
    // The request stays in the service until then rather than being taken now: the rebuild may
    // replace this column once more before it renders, and a destroyed column drops this callback,
    // so the column that replaces it has to be able to pick the request up in turn.
    afterNextRender(
      () => {
        if (this.columnOrderingService.reopenColumnActions.value !== request) {
          return;
        }

        this.columnOrderingService.reopenColumnActions.next(null);

        if (!this.columnActions) {
          return;
        }

        this.columnActions.popoverService.open = true;

        // Back on the action that was used, so repeating the move does not mean finding it again. A
        // timeout for the same reason the dropdown uses one to focus its first item: the menu's
        // overlay is not attached to the document yet at this point.
        const moveAction = this.moveActions().find(action => action.direction === request.direction);
        setTimeout(() => moveAction?.focus());
      },
      { injector: this.injector }
    );
  }

  private updateGrabbedState() {
    this.isGrabbed = !this.isGrabbed;
    this.changeDetectorRef.markForCheck();
  }

  private setActiveCell() {
    getDatagridKeyNavigationController(this.datagrid).setActiveCell(this.elementRef.nativeElement);

    getDatagridKeyNavigationController(this.datagrid).focusElement(this.elementRef.nativeElement);
  }
}
