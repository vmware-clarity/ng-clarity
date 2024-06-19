/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { _RecycleViewRepeaterStrategy } from '@angular/cdk/collections';
import { EmbeddedViewRef } from '@angular/core';

import { DatagridColumnChanges } from '../enums/column-changes.enum';
import { ColumnsService } from '../providers/columns.service';
import { HIDDEN_COLUMN_CLASS, STRICT_WIDTH_CLASS } from '../render/constants';

export class ClrVirtualScrollRepeater<T, R, C> extends _RecycleViewRepeaterStrategy<T, R, C> {
  constructor(private columnsService: ColumnsService) {
    super();

    this.columnsService.columnsStateChange.subscribe(state => {
      if (!state.columnIndex) {
        return;
      }

      const cachedRowViews = (this as any)._viewCache as EmbeddedViewRef<C>[];

      cachedRowViews.forEach(rowViewRef => {
        rowViewRef.rootNodes.forEach((htmlNode: HTMLElement) => {
          const cell = htmlNode.querySelectorAll(
            `[role=gridcell]:not(.datagrid-fixed-column):not(.datagrid-placeholder-content)`
          )[state.columnIndex] as HTMLElement;

          if (cell) {
            state.changes?.forEach(change => {
              if (change === DatagridColumnChanges.WIDTH) {
                if (state.strictWidth) {
                  cell.classList.add(STRICT_WIDTH_CLASS);
                } else {
                  cell.classList.remove(STRICT_WIDTH_CLASS);
                }
                cell.style.width = state.width + 'px';
              }

              if (change === DatagridColumnChanges.HIDDEN) {
                if (state.hidden) {
                  cell.classList.add(HIDDEN_COLUMN_CLASS);
                } else {
                  cell.classList.remove(HIDDEN_COLUMN_CLASS);
                }
              }
            });
          }
        });
      });
    });
  }
}
