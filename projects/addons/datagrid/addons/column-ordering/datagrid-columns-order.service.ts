/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import type { ColumnMoveDirection } from './datagrid-columns-order.directive';
import { ColumnDefinition } from '../../shared/column/column-definitions';

/**
 * Provides subjects for communication between appfxDgColumnsOrder and appfxColumnOrder
 * directives.
 */
@Injectable()
export class DatagridColumnsOrderService {
  /**
   * Emits the column which should be marked as grabbed. If the column is null all columns are
   * marked as not grabbed
   */
  readonly grabbedColumn = new BehaviorSubject<ColumnDefinition<any> | null>(null);

  /**
   * Emits when the column should be moved as result of left or right arrow key press.
   */
  readonly moveVisibleColumn = new Subject<{
    visibleColumnIndex: number;
    moveLeft: boolean;
  }>();

  /**
   * Event emitter to tell the dragged column to set focus
   */
  readonly focusGrabbedColumn = new Subject<void>();

  /**
   * The column whose actions menu has to be opened again, with the move action that was used in it.
   *
   * A move that rebuilds the column views destroys the open menu along with its column, so the
   * column in its new place opens its own menu instead. A BehaviorSubject, because that column may be
   * created before or after the move reports itself here.
   */
  readonly reopenColumnActions = new BehaviorSubject<{
    column: ColumnDefinition<any>;
    direction: ColumnMoveDirection;
  } | null>(null);
}
