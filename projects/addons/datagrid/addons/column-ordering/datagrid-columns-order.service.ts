/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

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
}
