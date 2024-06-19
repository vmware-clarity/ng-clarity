/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { _RecycleViewRepeaterStrategy } from '@angular/cdk/collections';
import { EmbeddedViewRef, Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { DatagridColumnChanges } from '../enums/column-changes.enum';
import { ColumnsService } from '../providers/columns.service';
import { CellState } from './set-cell-state';

@Injectable()
export class ClrVirtualScrollRepeater<T, R, C> extends _RecycleViewRepeaterStrategy<T, R, C> implements OnDestroy {
  private subscriptions: Subscription[] = [];
  private cellState = new CellState();

  constructor(private columnsService: ColumnsService) {
    super();
    this.subscriptions.push(
      this.columnsService.columnsStateChange.subscribe(state => {
        if (!state || !state.columnIndex) {
          return;
        }

        const cachedRowViews = (this as any)._viewCache as EmbeddedViewRef<C>[];

        cachedRowViews.forEach(rowViewRef => {
          rowViewRef.rootNodes.forEach((htmlNode: HTMLElement) => {
            const cell = htmlNode.querySelectorAll(
              `[role=gridcell]:not(.datagrid-fixed-column):not(.datagrid-placeholder-content)`
            )[state.columnIndex] as HTMLElement;

            if (!cell) {
              return;
            }

            state.changes?.forEach(change => {
              if (change === DatagridColumnChanges.WIDTH) {
                this.cellState.setWidth(state, cell);
              }

              if (change === DatagridColumnChanges.HIDDEN) {
                this.cellState.setHidden(state, cell);
              }
            });
          });
        });
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
