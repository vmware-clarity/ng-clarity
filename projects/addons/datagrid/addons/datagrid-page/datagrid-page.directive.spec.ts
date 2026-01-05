/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { Component, ViewChild } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MockDatagridActionBarComponent,
  MockDatagridCellContainerComponent,
  MockDatagridColumnToggleComponent,
  MockIsRowSelectablePipe,
} from '@clr/addons/testing';

import { DatagridPageDirective } from './datagrid-page.directive';
import { DatagridComponent } from '../../datagrid.component';
import { AppfxDatagridModule } from '../../datagrid.module';
import { DatagridStrings } from '../../i18n/datagrid-strings.service';
import { SelectionType } from '../../interfaces/selection-type';
import { ColumnDefinition } from '../../shared/column/column-definitions';
import { DatagridColumnsOrderModule } from '../column-ordering/datagrid-columns-order.module';
import { ExportProviderService } from '../export/export-provider.service';

enum PowerState {
  off = 'Powered Off',
  on = 'Powered On',
}

const allGridData = [
  {
    status: 'unknown',
    name: 'vm0',
    powerState: PowerState.off,
    host: '10.23.45.68',
  },
  {
    status: 'green',
    name: 'vm1',
    powerState: PowerState.on,
    host: '10.23.45.69',
  },
  {
    status: 'red',
    name: 'vm3',
    powerState: PowerState.off,
    host: '10.23.45.70',
  },
  {
    status: 'green',
    name: 'vm2',
    powerState: PowerState.on,
    host: '10.23.45.72',
  },
  {
    status: 'red',
    name: 'vm4',
    powerState: PowerState.off,
    host: '10.23.45.88',
  },
  {
    status: 'unknown',
    name: 'vm5',
    powerState: PowerState.off,
    host: '10.23.45.89',
  },
  {
    status: 'green',
    name: 'vm6',
    powerState: PowerState.off,
    host: '10.23.45.74',
  },
  {
    status: 'red',
    name: 'vm7',
    powerState: PowerState.off,
    host: '10.23.45.73',
  },
  {
    status: 'green',
    name: 'vm8',
    powerState: PowerState.off,
    host: '10.23.45.74',
  },
];

const columns = [
  {
    displayName: 'Name',
    field: 'name',
  },
  {
    displayName: 'State',
    field: 'powerState',
  },
  {
    displayName: 'Status',
    field: 'status',
  },
];

describe('datagridPage directive', () => {
  beforeEach(function (this: any) {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        NoopAnimationsModule,
        DatagridColumnsOrderModule,
        DragDropModule,
        OverlayModule,
        DatagridForClientSideGridHostComponent,
        DatagridForServerSideGridHostComponent,
      ],
      declarations: [
        MockDatagridColumnToggleComponent,
        MockDatagridCellContainerComponent,
        MockDatagridActionBarComponent,
        MockIsRowSelectablePipe,
      ],
      providers: [{ provide: DatagridStrings, useClass: DatagridStrings }],
    }).overrideProvider(ExportProviderService, {
      useValue: {
        exportUIOnlyData: jasmine.createSpy('exportUIOnlyData'),
      },
    });
  });

  describe('on client side grid', () => {
    beforeEach(function (this: any) {
      this.fixture = TestBed.createComponent(DatagridForClientSideGridHostComponent);
      this.appfxDatagridHostComponent = this.fixture.componentInstance;
    });

    it('set initial page', fakeAsync(function (this: any) {
      this.fixture.detectChanges(false);
      tick();
      expect(this.appfxDatagridHostComponent.appfxDatagridComponent.clrDatagridPagination.currentPage).toEqual(
        this.appfxDatagridHostComponent.currentPageIndex
      );
    }));
    it('change grid page', fakeAsync(function (this: any) {
      this.appfxDatagridHostComponent.currentPageIndex = 1;
      this.fixture.detectChanges(false);
      tick();
      expect(this.appfxDatagridHostComponent.appfxDatagridComponent.clrDatagridPagination.currentPage).toEqual(
        this.appfxDatagridHostComponent.currentPageIndex
      );
      this.appfxDatagridHostComponent.currentPageIndex = 3;
      this.fixture.detectChanges(false);
      tick();
      expect(this.appfxDatagridHostComponent.appfxDatagridComponent.clrDatagridPagination.currentPage).toEqual(
        this.appfxDatagridHostComponent.currentPageIndex
      );
    }));
    it('emit grid page when is changed', fakeAsync(function (this: any) {
      this.fixture.detectChanges(false);
      tick();
      expect(this.appfxDatagridHostComponent.newPageIndex).toEqual(this.appfxDatagridHostComponent.currentPageIndex);
      this.appfxDatagridHostComponent.currentPageIndex = 3;
      this.fixture.detectChanges(false);
      tick();
      expect(this.appfxDatagridHostComponent.newPageIndex).toEqual(this.appfxDatagridHostComponent.currentPageIndex);
    }));
  });

  describe('on server side grid', () => {
    beforeEach(function (this: any) {
      this.fixture = TestBed.createComponent(DatagridForServerSideGridHostComponent);
      this.appfxDatagridHostComponent = this.fixture.componentInstance;

      this.appfxDatagridHostComponent.appfxDatagridComponent.ngOnInit();
      this.fixture.detectChanges(false);

      this.fixture.detectChanges();
      this.appfxDatagridHostComponent.appfxDatagridComponent.selectedItems = []; // reset
      this.fixture.detectChanges(false);
    });

    it('set initial page', function (this: any) {
      expect(this.appfxDatagridHostComponent.appfxDatagridComponent.clrDatagridPagination.currentPage).toEqual(
        this.appfxDatagridHostComponent.currentPageIndex
      );
    });
    it('change grid page', function (this: any) {
      this.appfxDatagridHostComponent.currentPageIndex = 1;
      this.fixture.detectChanges(false);
      expect(this.appfxDatagridHostComponent.appfxDatagridComponent.clrDatagridPagination.currentPage).toEqual(
        this.appfxDatagridHostComponent.currentPageIndex
      );
      this.appfxDatagridHostComponent.currentPageIndex = 3;
      this.fixture.detectChanges(false);
      expect(this.appfxDatagridHostComponent.appfxDatagridComponent.clrDatagridPagination.currentPage).toEqual(
        this.appfxDatagridHostComponent.currentPageIndex
      );
    });

    it('emit grid page when is changed', function (this: any) {
      expect(this.appfxDatagridHostComponent.newPageIndex).toEqual(this.appfxDatagridHostComponent.currentPageIndex);
      this.appfxDatagridHostComponent.currentPageIndex = 3;
      this.fixture.detectChanges(false);
      expect(this.appfxDatagridHostComponent.newPageIndex).toEqual(this.appfxDatagridHostComponent.currentPageIndex);
    });
  });

  afterEach(function (this: any) {
    this.fixture.destroy();
    this.appfxDatagridHostComponent.columnsDefs = null;
    this.appfxDatagridHostComponent.data = null;
    this.appfxDatagridHostComponent = null;
    this.directive = null;
  });
});

@Component({
  selector: 'appfx-datagrid-client-side-host-component',
  imports: [AppfxDatagridModule, DatagridColumnsOrderModule, DragDropModule, FormsModule, OverlayModule],
  template: `
    <appfx-datagrid
      [datagridPage]="currentPageIndex"
      (datagridPageChange)="gridPageChange($event)"
      [selectionType]="selectionType"
      [gridItems]="data"
      [pageSize]="pageSize"
      [totalItems]="data.length"
      [columns]="columnsDefs"
    ></appfx-datagrid>
  `,
  standalone: true,
})
class DatagridForClientSideGridHostComponent {
  @ViewChild(DatagridComponent, { static: true }) appfxDatagridComponent: DatagridComponent<unknown>;

  currentPageIndex = 3;
  newPageIndex = 0;

  pageSize = 4;
  data: any[] = allGridData.slice(0, 4);
  columnsDefs: ColumnDefinition<any>[] = columns;
  selectionType = SelectionType.None;

  gridPageChange(page: number) {
    this.newPageIndex = page;
  }
}

@Component({
  selector: 'appfx-datagrid-server-side-host-component',
  imports: [AppfxDatagridModule, DatagridColumnsOrderModule, DragDropModule, FormsModule, OverlayModule],
  template: `
    <appfx-datagrid
      [datagridPage]="currentPageIndex"
      (datagridPageChange)="gridPageChange($event)"
      [serverDrivenDatagrid]="serverDrivenDatagrid"
      [selectionType]="selectionType"
      [gridItems]="data"
      [pageSize]="2"
      [totalItems]="allData.length"
      [columns]="columnsDefs"
      (refreshGridData)="refreshData($event)"
    ></appfx-datagrid>
  `,
  standalone: true,
})
class DatagridForServerSideGridHostComponent {
  @ViewChild(DatagridComponent, { static: true }) appfxDatagridComponent: DatagridComponent<unknown>;

  @ViewChild(DatagridPageDirective, { static: true }) newPageIndex = 0;

  currentPageIndex = 5;
  data: any[] = [];
  allData: any[] = allGridData;
  serverDrivenDatagrid = true;
  columnsDefs: ColumnDefinition<any>[] = columns;
  selectionType = SelectionType.None;
  currentState: any;

  gridPageChange(page: number) {
    this.newPageIndex = page;
  }

  refreshData(state: any) {
    this.currentState = state;
    if (this.currentState && this.currentState.page) {
      // Create new objects so to be sure tha the track by function is used and grid row items are
      // not compared by instance
      const newObjects = this.allData.map((item: any) => {
        return { ...item };
      });
      this.data = newObjects.slice(this.currentState.page.from, this.currentState.page.from + 2);
    }
  }
}
