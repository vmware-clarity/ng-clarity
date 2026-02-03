/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Directive, Host, Inject, Input, OnDestroy, Optional } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { DatagridComponent } from '../../datagrid.component';
import { ColumnHiddenState, ColumnResize, ColumnSortOrder } from '../../interfaces/column-state';
import { ColumnDefinition } from '../../shared/column/column-definitions';
import { appfxDatagridPersistSettingsToken } from './appfx-datagrid-persist-settings.token';
import {
  PersistDatagridSettingsService,
  PersistedDatagridColumnState,
  PersistedDatagridSortOrder,
  PersistedDatagridState,
} from './datagrid-persist-settings.interfaces';

declare function setTimeout(handler: (...args: any[]) => void, timeout: number): number;

/**
 * Sets the grid up with page size, column visibility and width from user-defined storage that is provided
 * Reacts to user changes in the Clarity datagrid to notify the injected storage to persist the grid properties
 * So reloading the application in automatically restore these preferences as a convenience
 */
@Directive({
  selector: 'appfx-datagrid[appfxPersistDatagridSettings]',
  standalone: false,
})
export class DatagridPersistSettingsDirective implements OnDestroy, AfterViewInit {
  private subs = new Subscription();
  private datagridKeyChange$ = new Subject<string>();
  private saveColumnsStateTimerId: number;

  private datagridKey: string;

  private storePageSize = true;

  private storeSortOrder = true;

  constructor(
    @Host() private grid: DatagridComponent<unknown>,
    @Optional()
    @Inject(appfxDatagridPersistSettingsToken)
    private persistDatagridSettingsService: PersistDatagridSettingsService
  ) {
    this.initialiseDatagridWithPersistedSettings();
  }

  /**
   * Directive takes unique identifier input to describe the grid
   */
  @Input()
  set appfxPersistDatagridSettings(key: string) {
    this.datagridKey = key;
    this.datagridKeyChange$.next(key);
  }

  /**
   * Flag indicates whether to be persisted the grid page size.
   */
  @Input()
  set persistPageSize(value: boolean) {
    this.storePageSize = value;
  }

  /**
   * Flag indicates whether to be persisted the grid page size.
   */
  @Input()
  set persistSortOrder(value: boolean) {
    this.storeSortOrder = value;
  }

  ngAfterViewInit() {
    if (!this.datagridKey) {
      return;
    }

    // Listen for column resize
    this.subs.add(
      this.grid.columnResize.subscribe((data: ColumnResize) => {
        data.column.width = data.columnSize + 'px';
        this.saveColumnStates();
      })
    );

    // Listen for column order changes
    this.subs.add(
      this.grid.columnOrderChange.subscribe(() => {
        this.saveColumnStates();
      })
    );

    // Listen for column hidden state changes
    this.subs.add(
      this.grid.columnHiddenStateChange.subscribe((data: ColumnHiddenState) => {
        data.column.hidden = data.hidden;
        this.saveColumnStates();
      })
    );

    if (this.storeSortOrder) {
      // Listen for column sort order changes
      this.subs.add(
        this.grid.columnSortOrderChange.subscribe((data: ColumnSortOrder) => {
          this.saveColumnSortOrder(data);
        })
      );
    }

    if (this.storePageSize) {
      // Listen for datagrid refresh event which contains page size info
      this.subs.add(
        this.grid.refreshGridData.subscribe((clrDatagridState: ClrDatagridStateInterface) => {
          const clrPageSize = clrDatagridState?.page?.size || 0;
          if (clrPageSize > 0 && clrPageSize !== this.grid.pageSize) {
            this.grid.pageSize = clrPageSize;
            this.savePageSize(clrPageSize);
          }
        })
      );
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private saveColumnStates() {
    if (this.saveColumnsStateTimerId) {
      clearTimeout(this.saveColumnsStateTimerId);
    }

    this.saveColumnsStateTimerId = setTimeout(() => {
      this.saveColumnsData();
    }, 100);
  }

  private saveColumnsData(): void {
    const persistedData = this.getPersistedData();

    persistedData.columns = this.grid.columns.map((column: ColumnDefinition<any>) =>
      this.createPersistedColumnState(column)
    );

    //Update sort column if it is persisted as it may become hidden
    if (persistedData.sorting) {
      const columnDef = persistedData.columns.find(column => {
        return column.uid === persistedData.sorting?.column.uid;
      });
      if (columnDef) {
        persistedData.sorting.column = columnDef;
      }
    }

    this.setPersistedData(persistedData);
  }

  private saveColumnSortOrder(columnSortOrder: ColumnSortOrder): void {
    const persistedData = this.getPersistedData();
    const column = this.createPersistedColumnState(columnSortOrder.column);
    persistedData.sorting = {
      sortOrder: columnSortOrder?.sortOrder,
      column: column,
    };
    this.setPersistedData(persistedData);
  }

  private savePageSize(pageSize: number) {
    const data = this.getPersistedData();
    data.pageSize = pageSize;
    this.setPersistedData(data);
  }

  private createPersistedColumnState(column: ColumnDefinition<any>): PersistedDatagridColumnState {
    const width = column.width ? parseInt(column.width, 10) : undefined;
    return {
      headerText: column.displayName,
      visible: column.hidden !== true,
      width: width,
      uid: this.getColumnUid(column),
    };
  }

  /**
   * Preserve data in the persistence storage.
   * @param data the data that is going to be persisted.
   */
  private setPersistedData(data: PersistedDatagridState): void {
    if (!this.datagridKey) {
      return;
    }
    if (!this.persistDatagridSettingsService) {
      console.error('Persist datagrid service is not provided.');
      return;
    }
    //save into the userdata, using a key based on the listViewId
    this.persistDatagridSettingsService.setUserData(this.getListViewColumnDefKey(this.datagridKey), data);
  }

  /**
   * Retrieves the data from the persistence storage.
   * @returns a promise which when resolved will contain the ListView columns data.
   */
  private getPersistedData(): PersistedDatagridState {
    if (!this.datagridKey || !this.persistDatagridSettingsService) {
      return {};
    }
    return this.persistDatagridSettingsService.getUserDataSync(this.getListViewColumnDefKey(this.datagridKey)) || {};
  }

  private getListViewColumnDefKey(datagridId: string): string {
    return datagridId + '_AppfxDatagridSettingsDef';
  }

  private initialiseDatagridWithPersistedSettings() {
    //Update datagrid column definitions with the persisted data immediately after
    //the datagrid key is set and the column definitions of the datagrid are set
    this.subs.add(
      combineLatest([this.datagridKeyChange$.asObservable(), this.grid.columnDefsChange.pipe(first())]).subscribe(
        () => {
          this.updateDatagridColumnDefinitions();
        }
      )
    );

    //Update datagrid page size with the persisted page size immediately after
    //the datagrid key is set and the page size of the datagrid is set
    this.subs.add(
      combineLatest([this.datagridKeyChange$.asObservable(), this.grid.pageSizeChange.pipe(first())]).subscribe(() => {
        this.updateDatagridPageSize();
      })
    );
  }

  /**
   * Set initial page size read from the local storage on the datagrid.
   */
  private updateDatagridPageSize() {
    const data = this.getPersistedData();
    const persistedPageSize = data?.pageSize || 0;
    if (persistedPageSize > 0 && this.grid.pageSize !== persistedPageSize) {
      this.grid.pageSize = persistedPageSize;
    }
  }

  /**
   * Set width of datagrid columns, its visible and sort states.
   */
  private updateDatagridColumnDefinitions() {
    const data = this.getPersistedData();
    if (!data.columns && !data.sorting) {
      return;
    }

    const columnsMap = new Map<string, ColumnDefinition<any>>();
    this.grid.columns.forEach((column: ColumnDefinition<any>) => {
      const uid = this.getColumnUid(column);
      this.applySorting(uid, column, data.sorting);
      // Store a copy of the column definitions, as this will allow all the
      // changes to be discarded at once if this is needed.
      columnsMap.set(uid, { ...column });
    });

    //Apply persisted data only if the column size of persisted data is equal
    // to datagrid column size
    if (data.columns && columnsMap.size === data.columns.length) {
      this.applyPersistedColumnSettings(data.columns, columnsMap);
    }
  }

  private applyPersistedColumnSettings(
    columns: PersistedDatagridColumnState[],
    columnsDefinitionsMap: Map<string, ColumnDefinition<any>>
  ) {
    const columnsOrder = <ColumnDefinition<any>[]>[];
    columns.forEach((columnPersistedState: PersistedDatagridColumnState) => {
      const column = columnsDefinitionsMap.get(columnPersistedState.uid);
      if (column) {
        column.width = columnPersistedState.width ? columnPersistedState.width + 'px' : undefined;
        column.hidden = !columnPersistedState.visible;
        columnsOrder.push(column);
        columnsDefinitionsMap.delete(columnPersistedState.uid);
      }
    });
    //Update columns only if persisted columns are the same as
    //the set columns of the datagrid
    if (columnsOrder && columnsOrder.length === this.grid.columns.length && columnsDefinitionsMap.size === 0) {
      this.grid.columns = columnsOrder;
      // Update datagrid visible columns after applying persisted columns settings
      this.grid.visibleColumns = this.grid.columns.filter((column: ColumnDefinition<any>) => !column.hidden);
    }
  }

  /**
   * Set column default sort order read from the local storage on the datagrid
   */
  private applySorting(
    columnUid: string,
    column: ColumnDefinition<any>,
    sorting: PersistedDatagridSortOrder | undefined
  ) {
    if (!sorting?.column.visible) {
      return;
    }
    if (columnUid === sorting?.column?.uid) {
      column.defaultSortOrder = sorting.sortOrder;
    }

    // Clear default column by which the grid is sorted if there is
    // other visible column by which should be sorted the grid
    if (column.defaultSortOrder && columnUid !== sorting?.column?.uid) {
      column.defaultSortOrder = undefined;
    }
  }

  private getColumnUid(column: ColumnDefinition<any>) {
    return column.uid || column.field || column.displayName;
  }
}
