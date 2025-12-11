/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkConnectedOverlay, CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { Component, ViewChild } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ZoomLevelService } from '@clr/addons/a11y';
import {
  MockDatagridCellContainerComponent,
  MockDatagridColumnToggleComponent,
  MockIsRowSelectablePipe,
  ZoomLevelServiceMock,
} from '@clr/addons/testing';
import { ClrDatagridSortOrder } from '@clr/angular';

import { appfxDatagridPersistSettingsToken } from './appfx-datagrid-persist-settings.token';
import { DatagridPersistSettingsDirective } from './datagrid-persist-settings.directive';
import { PersistDatagridSettingsService, PersistedDatagridState } from './datagrid-persist-settings.interfaces';
import { DatagridComponent } from '../../datagrid.component';
import { AppfxDatagridModule } from '../../datagrid.module';
import { DatagridStrings } from '../../i18n/datagrid-strings.service';
import { ColumnDefinition } from '../../shared/column/column-definitions';
import { ExportProviderService } from '../export/export-provider.service';

import createSpyObj = jasmine.createSpyObj;
import Spy = jasmine.Spy;

const columnDefsMock = [
  {
    displayName: 'Name',
    field: 'NAME',
    defaultSortOrder: -1,
    uid: 'name',
  },
  {
    displayName: 'State',
    field: 'powerState',
  },
  {
    displayName: 'Status',
    field: undefined,
  },
] as ColumnDefinition<any>[];

const persistedDatagridSettings = {
  columns: [
    {
      headerText: 'Name',
      visible: false,
      width: 337,
      uid: 'name',
    },
    {
      headerText: 'State',
      visible: true,
      width: 113,
      uid: 'powerState',
    },
    {
      headerText: 'Status',
      visible: true,
      width: 120,
      uid: 'Status',
    },
  ],
  sorting: {
    sortOrder: 1,
    column: { headerText: 'Status', visible: true, width: 120, uid: 'Status' },
  },
  pageSize: 15,
};

describe('DatagridPersistSettingsDirective', () => {
  let localStorageService: PersistDatagridSettingsService;
  let columns: ColumnDefinition<any>[];

  beforeEach(function (this: any) {
    TestBed.configureTestingModule({
      imports: [FormsModule, NoopAnimationsModule, DragDropModule, OverlayModule, DatagridHostComponent],
      declarations: [MockDatagridColumnToggleComponent, MockDatagridCellContainerComponent, MockIsRowSelectablePipe],
      providers: [
        {
          provide: ZoomLevelService,
          useClass: ZoomLevelServiceMock,
        },
        {
          provide: appfxDatagridPersistSettingsToken,
          useValue: createSpyObj(['getUserDataSync', 'setUserData']),
        },
        { provide: DatagridStrings, useClass: DatagridStrings },
        CdkOverlayOrigin,
        CdkConnectedOverlay,
      ],
    }).overrideProvider(ExportProviderService, {
      useValue: {
        exportUIOnlyData: jasmine.createSpy('exportUIOnlyData'),
      },
    });
    columns = [];
    columnDefsMock.forEach(val => columns.push(Object.assign({}, val)));
    this.fixture = TestBed.createComponent(DatagridHostComponent);
    localStorageService = TestBed.inject(appfxDatagridPersistSettingsToken);
    this.datagridHostComponent = this.fixture.componentInstance;
  });

  describe('calls getUserDataSync method of datagrid persisted settings service', () => {
    it('when column definitions are set', function (this: any) {
      (localStorageService.getUserDataSync as Spy).and.returnValue(null);
      this.fixture.detectChanges(false);
      expect(localStorageService.getUserDataSync).not.toHaveBeenCalled();
      this.datagridHostComponent.columnDefs = columns;
      this.fixture.detectChanges(false);
      expect(localStorageService.getUserDataSync).toHaveBeenCalled();
    });

    it('when column page size are set', function (this: any) {
      (localStorageService.getUserDataSync as Spy).and.returnValue(null);
      this.fixture.detectChanges(false);
      expect(localStorageService.getUserDataSync).not.toHaveBeenCalled();
      this.datagridHostComponent.pageSize = 4;
      this.fixture.detectChanges(false);
      expect(localStorageService.getUserDataSync).toHaveBeenCalled();
    });
  });

  it('apply persisted datagrid settings return from datagrid persisted settings service to the datagrid', function (this: any) {
    (localStorageService.getUserDataSync as Spy).and.returnValue(persistedDatagridSettings);
    this.fixture.detectChanges(false);
    expect(localStorageService.getUserDataSync).not.toHaveBeenCalled();
    this.datagridHostComponent.columnDefs = columns;
    this.datagridHostComponent.pageSize = 10;
    this.fixture.detectChanges(false);
    expect(localStorageService.getUserDataSync).toHaveBeenCalled();
    expect(this.datagridHostComponent.appfxDatagridComponent.pageSize).toEqual(15);
    expect(this.datagridHostComponent.appfxDatagridComponent.columns[0].hidden).toEqual(true);
    expect(this.datagridHostComponent.appfxDatagridComponent.columns[0].width).toEqual('337px');
    expect(this.datagridHostComponent.appfxDatagridComponent.columns[0].defaultSortOrder).toBeUndefined();
    expect(this.datagridHostComponent.appfxDatagridComponent.columns[1].hidden).toEqual(false);
    expect(this.datagridHostComponent.appfxDatagridComponent.columns[1].width).toEqual('113px');
    expect(this.datagridHostComponent.appfxDatagridComponent.columns[2].hidden).toEqual(false);
    expect(this.datagridHostComponent.appfxDatagridComponent.columns[2].width).toEqual('120px');
    expect(this.datagridHostComponent.appfxDatagridComponent.columns[2].defaultSortOrder).toEqual(1);
  });

  describe('calls setUserData method of datagrid persisted settings service', () => {
    beforeEach(function (this: any) {
      (localStorageService.getUserDataSync as Spy).and.returnValue(null);
      this.datagridHostComponent.columnDefs = columns;
      this.datagridHostComponent.pageSize = 10;
      this.fixture.detectChanges(false);
    });

    it('when page size is changes ', function (this: any) {
      expect(this.datagridHostComponent.appfxDatagridComponent.pageSize).toEqual(10);
      let persistedData: PersistedDatagridState = {};
      (localStorageService.setUserData as Spy).and.callFake((key: string, data: PersistedDatagridState) => {
        persistedData = data;
      });
      const datagridState = {
        page: {
          from: 1,
          to: 10,
          size: 20,
        },
      };
      this.datagridHostComponent.appfxDatagridComponent.refreshGridData.emit(datagridState);

      expect(persistedData).toBeTruthy();
      expect(persistedData.pageSize).toEqual(20);
    });

    it('when column sort order is changes ', function (this: any) {
      expect(this.datagridHostComponent.appfxDatagridComponent.pageSize).toEqual(10);
      let persistedData: PersistedDatagridState = {};
      (localStorageService.setUserData as Spy).and.callFake((key: string, data: PersistedDatagridState) => {
        persistedData = data;
      });
      this.datagridHostComponent.appfxDatagridComponent.columnSortOrderChange.emit({
        sortOrder: ClrDatagridSortOrder.DESC,
        column: columns[2],
      });
      expect(persistedData.sorting).toBeTruthy();
      expect(persistedData.sorting?.sortOrder).toEqual(ClrDatagridSortOrder.DESC);
      expect(persistedData.sorting?.column.uid).toEqual(columns[2].displayName);
    });

    it('when column visible state is changes ', fakeAsync(function (this: any) {
      let persistedData: PersistedDatagridState = {};
      (localStorageService.setUserData as Spy).and.callFake((key: string, data: PersistedDatagridState) => {
        persistedData = data;
      });
      this.datagridHostComponent.appfxDatagridComponent.columnHiddenStateChange.emit({
        hidden: true,
        column: columns[1],
      });
      tick(100);
      expect(persistedData.columns).toBeTruthy();
      expect(persistedData.columns?.length).toEqual(3);
      expect(persistedData.columns[0].visible).toEqual(true);
      expect(persistedData.columns[0].uid).toEqual(columns[0].uid as string);
      expect(persistedData.columns[1].visible).toEqual(false);
      expect(persistedData.columns[1].uid).toEqual(columns[1].field);
      expect(persistedData.columns[2].visible).toEqual(true);
      expect(persistedData.columns[2].uid).toEqual(columns[2].displayName);
    }));

    it('when column is resized state is changes ', fakeAsync(function (this: any) {
      let persistedData: PersistedDatagridState = {};
      (localStorageService.setUserData as Spy).and.callFake((key: string, data: PersistedDatagridState) => {
        persistedData = data;
      });

      this.datagridHostComponent.appfxDatagridComponent.columnResize.emit({
        columnSize: 101,
        column: columns[0],
      });
      tick(100);
      expect(persistedData.columns).toBeTruthy();
      expect(persistedData.columns?.length).toEqual(3);
      expect(persistedData.columns[0].visible).toEqual(true);
      expect(persistedData.columns[0].uid).toEqual(columns[0].uid as string);
      expect(persistedData.columns[0].width).toEqual(101);
    }));

    it('when column order is changes ', fakeAsync(function (this: any) {
      let persistedData: PersistedDatagridState = {};
      (localStorageService.setUserData as Spy).and.callFake((key: string, data: PersistedDatagridState) => {
        persistedData = data;
      });

      this.datagridHostComponent.appfxDatagridComponent.columnOrderChange.emit({
        previousIndex: 1,
        currentIndex: 2,
        column: columns,
      });
      tick(100);
      expect(persistedData.columns).toBeTruthy();
      expect(persistedData.columns?.length).toEqual(3);
      expect(persistedData.columns[0].visible).toEqual(true);
      expect(persistedData.columns[0].uid).toEqual(columns[0].uid as string);
    }));
  });

  describe('does not calls setUserData method of datagrid persisted settings service', () => {
    it('when page size is changes and persistPageSize input of the directive is false ', function (this: any) {
      (localStorageService.getUserDataSync as Spy).and.returnValue(null);
      this.datagridHostComponent.columnDefs = columns;
      this.datagridHostComponent.pageSize = 10;
      this.datagridHostComponent.persistPageSize = false;
      this.fixture.detectChanges(false);
      const datagridState = {
        page: {
          from: 1,
          to: 10,
          size: 20,
        },
      };
      this.datagridHostComponent.appfxDatagridComponent.refreshGridData.emit(datagridState);

      expect(localStorageService.setUserData).not.toHaveBeenCalled();
    });

    it('when column sort order is changes and persistSortOrder input of the directive is false', function (this: any) {
      (localStorageService.getUserDataSync as Spy).and.returnValue(null);
      this.datagridHostComponent.columnDefs = columns;
      this.datagridHostComponent.pageSize = 10;
      this.datagridHostComponent.persistSortOrder = false;
      this.datagridHostComponent.appfxDatagridComponent.columnSortOrderChange.emit({
        sortOrder: ClrDatagridSortOrder.DESC,
        column: columns[2],
      });
      expect(localStorageService.setUserData).not.toHaveBeenCalled();
    });
  });

  describe('does not apply persisted datagrid columns settings', () => {
    it('when the persisted columns are more than datagrid columns', function (this: any) {
      (localStorageService.getUserDataSync as Spy).and.returnValue(persistedDatagridSettings);
      this.fixture.detectChanges(false);
      expect(localStorageService.getUserDataSync).not.toHaveBeenCalled();
      const gridColumns = columns.slice(1);
      this.datagridHostComponent.columnDefs = gridColumns;
      this.datagridHostComponent.pageSize = 10;
      this.fixture.detectChanges(false);
      expect(localStorageService.getUserDataSync).toHaveBeenCalled();
      expect(this.datagridHostComponent.appfxDatagridComponent.columns).toEqual(gridColumns);
    });

    it('when the persisted columns are less than datagrid columns', function (this: any) {
      (localStorageService.getUserDataSync as Spy).and.returnValue(persistedDatagridSettings);
      this.fixture.detectChanges(false);
      expect(localStorageService.getUserDataSync).not.toHaveBeenCalled();
      const gridColumns = [
        ...columns,
        {
          headerText: 'Version',
          visible: false,
          uid: 'version',
        },
      ];
      this.datagridHostComponent.columnDefs = gridColumns;
      this.datagridHostComponent.pageSize = 10;
      this.fixture.detectChanges(false);
      expect(localStorageService.getUserDataSync).toHaveBeenCalled();
      expect(this.datagridHostComponent.appfxDatagridComponent.columns).toEqual(gridColumns);
    });

    it('when the column is not persisted', function (this: any) {
      (localStorageService.getUserDataSync as Spy).and.returnValue(persistedDatagridSettings);
      this.fixture.detectChanges(false);
      expect(localStorageService.getUserDataSync).not.toHaveBeenCalled();
      const gridColumns = [...columns];
      gridColumns[0].uid = 'name1';
      this.datagridHostComponent.columnDefs = gridColumns;
      this.datagridHostComponent.pageSize = 10;
      this.fixture.detectChanges(false);
      expect(localStorageService.getUserDataSync).toHaveBeenCalled();
      expect(this.datagridHostComponent.appfxDatagridComponent.columns).toEqual(gridColumns);
    });
  });

  afterEach(function (this: any) {
    this.fixture.destroy();
    this.datagridHostComponent.columnsDefs = null;
    this.datagridHostComponent.data = null;
    this.datagridHostComponent = null;
    this.directive = null;
  });
});

@Component({
  selector: 'appfx-datagrid-host-component',
  imports: [AppfxDatagridModule, DragDropModule, FormsModule, OverlayModule],
  template: `
    <appfx-datagrid
      [gridItems]="data"
      [columns]="columnDefs"
      [pageSize]="pageSize"
      [appfxPersistDatagridSettings]="'test'"
      [persistPageSize]="persistPageSize"
      [persistSortOrder]="persistSortOrder"
    ></appfx-datagrid>
  `,
  standalone: true,
})
class DatagridHostComponent {
  @ViewChild(DatagridComponent, { static: true }) appfxDatagridComponent: DatagridComponent<unknown>;

  @ViewChild(DatagridPersistSettingsDirective, { static: true }) directive: DatagridPersistSettingsDirective;

  pageSize: number;
  data: any[] = [
    {
      status: 'unknown',
      name: 'vm0',
      powerState: 'Powered Off',
      host: '10.23.45.68',
    },
  ];
  columnDefs: ColumnDefinition<any>[];
  persistPageSize = true;
  persistSortOrder = true;
}
