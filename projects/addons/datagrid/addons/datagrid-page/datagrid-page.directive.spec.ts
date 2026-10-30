/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  MockDatagridActionBarComponent,
  MockDatagridCellContainerComponent,
  MockDatagridColumnToggleComponent,
  MockIsRowSelectablePipe,
} from '@clr/addons/testing';
import { SelectionType } from '@clr/angular/data/datagrid';

import { DatagridPageDirective } from './datagrid-page.directive';
import { DatagridComponent } from '../../datagrid.component';
import { AppfxDatagridModule } from '../../datagrid.module';
import { DatagridStrings } from '../../i18n/datagrid-strings.service';
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
  let testContext: any;
  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
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
        exportUIOnlyData: vi.fn(),
      },
    });
  });

  describe('on client side grid', () => {
    beforeEach(() => {
      testContext.fixture = TestBed.createComponent(DatagridForClientSideGridHostComponent);
      testContext.appfxDatagridHostComponent = testContext.fixture.componentInstance;
    });

    it('set initial page', fakeAsync(() => {
      testContext.fixture.detectChanges(false);
      tick();
      expect(testContext.appfxDatagridHostComponent.appfxDatagridComponent.clrDatagridPagination.currentPage).toEqual(
        testContext.appfxDatagridHostComponent.currentPageIndex
      );
    }));
    it('change grid page', fakeAsync(() => {
      testContext.appfxDatagridHostComponent.currentPageIndex = 1;
      testContext.fixture.detectChanges(false);
      tick();
      expect(testContext.appfxDatagridHostComponent.appfxDatagridComponent.clrDatagridPagination.currentPage).toEqual(
        testContext.appfxDatagridHostComponent.currentPageIndex
      );
      testContext.appfxDatagridHostComponent.currentPageIndex = 3;
      testContext.fixture.detectChanges(false);
      tick();
      expect(testContext.appfxDatagridHostComponent.appfxDatagridComponent.clrDatagridPagination.currentPage).toEqual(
        testContext.appfxDatagridHostComponent.currentPageIndex
      );
    }));
    it('emit grid page when is changed', fakeAsync(() => {
      testContext.fixture.detectChanges(false);
      tick();
      expect(testContext.appfxDatagridHostComponent.newPageIndex).toEqual(
        testContext.appfxDatagridHostComponent.currentPageIndex
      );
      testContext.appfxDatagridHostComponent.currentPageIndex = 3;
      testContext.fixture.detectChanges(false);
      tick();
      expect(testContext.appfxDatagridHostComponent.newPageIndex).toEqual(
        testContext.appfxDatagridHostComponent.currentPageIndex
      );
    }));
  });

  describe('on server side grid', () => {
    beforeEach(() => {
      testContext.fixture = TestBed.createComponent(DatagridForServerSideGridHostComponent);
      testContext.appfxDatagridHostComponent = testContext.fixture.componentInstance;

      testContext.appfxDatagridHostComponent.appfxDatagridComponent.ngOnInit();
      testContext.fixture.detectChanges(false);

      testContext.fixture.detectChanges();
      testContext.appfxDatagridHostComponent.appfxDatagridComponent.selectedItems = []; // reset
      testContext.fixture.detectChanges(false);
    });

    it('set initial page', () => {
      expect(testContext.appfxDatagridHostComponent.appfxDatagridComponent.clrDatagridPagination.currentPage).toEqual(
        testContext.appfxDatagridHostComponent.currentPageIndex
      );
    });
    it('change grid page', () => {
      testContext.appfxDatagridHostComponent.currentPageIndex = 1;
      testContext.fixture.detectChanges(false);
      expect(testContext.appfxDatagridHostComponent.appfxDatagridComponent.clrDatagridPagination.currentPage).toEqual(
        testContext.appfxDatagridHostComponent.currentPageIndex
      );
      testContext.appfxDatagridHostComponent.currentPageIndex = 3;
      testContext.fixture.detectChanges(false);
      expect(testContext.appfxDatagridHostComponent.appfxDatagridComponent.clrDatagridPagination.currentPage).toEqual(
        testContext.appfxDatagridHostComponent.currentPageIndex
      );
    });

    it('emit grid page when is changed', () => {
      expect(testContext.appfxDatagridHostComponent.newPageIndex).toEqual(
        testContext.appfxDatagridHostComponent.currentPageIndex
      );
      testContext.appfxDatagridHostComponent.currentPageIndex = 3;
      testContext.fixture.detectChanges(false);
      expect(testContext.appfxDatagridHostComponent.newPageIndex).toEqual(
        testContext.appfxDatagridHostComponent.currentPageIndex
      );
    });
  });

  afterEach(() => {
    testContext.fixture.destroy();
    testContext.appfxDatagridHostComponent.columnsDefs = null;
    testContext.appfxDatagridHostComponent.data = null;
    testContext.appfxDatagridHostComponent = null;
    testContext.directive = null;
  });
});

@Component({
  selector: 'appfx-datagrid-client-side-host-component',
  imports: [AppfxDatagridModule, DatagridColumnsOrderModule, DragDropModule, FormsModule, OverlayModule],
  changeDetection: ChangeDetectionStrategy.Eager,
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
