/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkDrag } from '@angular/cdk/drag-drop';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ClrDatagrid } from '@clr/angular';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { getDatagridKeyNavigationController, isEqualColumns } from './datagrid-columns-order.helpers';
import { DatagridColumnsOrderService } from './datagrid-columns-order.service';
import { ColumnDefinition } from '../../shared/column/column-definitions';

@Directive({
  selector: 'clr-dg-column[appfxColumnOrder]',
  standalone: false,
})
export class ColumnOrderDirective implements OnDestroy, OnInit {
  @HostBinding('class.grabbed') isGrabbed = false;

  @Input() columnData: ColumnDefinition<any>;

  @Input() columnIndex: number;

  private subs = new Subscription();

  constructor(
    private readonly datagrid: ClrDatagrid,
    readonly elementRef: ElementRef<HTMLElement>,
    private readonly columnOrderingService: DatagridColumnsOrderService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly cdkDrag: CdkDrag
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

    if (isCurrentColumnGrabbed && (isLeft || isRight)) {
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

    if (!isCurrentColumnGrabbed && isSpace) {
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

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private moveColumn(isLeft: boolean) {
    this.columnOrderingService.moveVisibleColumn.next({
      moveLeft: isLeft,
      visibleColumnIndex: this.columnIndex,
    });
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
