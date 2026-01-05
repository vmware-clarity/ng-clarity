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
  GridHelper,
  MockDatagridActionBarComponent,
  MockDatagridCellContainerComponent,
  MockDatagridColumnToggleComponent,
  MockIsRowSelectablePipe,
  ZoomLevelServiceMock,
} from '@clr/addons/testing';

import { DatagridColumnsOrderModule } from '../addons/column-ordering/datagrid-columns-order.module';
import { ExportProviderService } from '../addons/export/export-provider.service';
import { DatagridComponent } from '../datagrid.component';
import { AppfxDatagridModule } from '../datagrid.module';
import { DatagridPreserveSelectionDirective } from './datagrid-preserve-selection.directive';
import { DatagridStrings } from '../i18n/datagrid-strings.service';
import { SelectionType } from '../interfaces/selection-type';
import { ColumnDefinition } from '../shared/column/column-definitions';

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

@Component({
  selector: 'appfx-datagrid-host-component-server-side',
  imports: [AppfxDatagridModule, DatagridColumnsOrderModule, DragDropModule, FormsModule, OverlayModule],
  template: `
    <appfx-datagrid
      appfxPreserveSelection
      [preserveExistingSelection]="preserveSelection"
      [trackByGridItemProperty]="'name'"
      [serverDrivenDatagrid]="serverDrivenDatagrid"
      [selectionType]="selectionType"
      [gridItems]="data"
      [pageSize]="2"
      [selectedItems]="selectedItems"
      [totalItems]="allData.length"
      [columns]="columnsDefs"
      (refreshGridData)="refreshData($event)"
    ></appfx-datagrid>
  `,
  standalone: true,
})
class DatagridHostForServerSideGridComponent {
  @ViewChild(DatagridComponent, { static: true }) datagridComponent: DatagridComponent<unknown>;

  @ViewChild(DatagridPreserveSelectionDirective, { static: true }) directive: DatagridPreserveSelectionDirective;

  data: any[] = [];
  preserveSelection = true;
  allData: any[] = allGridData;
  selectedItems: any[] = [];
  serverDrivenDatagrid = true;
  columnsDefs: ColumnDefinition<any>[] = columns;
  selectionType = SelectionType.Multi;
  currentState: any;

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

describe('datagrid-preserve-selection-directive.server-side', () => {
  beforeEach(function (this: any) {
    this.moveToTheNextPageAndSelectRows = (selectRows: number[]) => {
      this.moveToNewPageAndSelectRow(selectRows);
    };

    this.moveToThePreviousPageAndSelectRows = (selectRows: number[]) => {
      this.moveToNewPageAndSelectRow(selectRows, true);
    };
    this.moveToNewPageAndSelectRow = (selectRows: number[], previousPage?: boolean) => {
      const gridHelper = new GridHelper(this.fixture.debugElement);
      if (previousPage) {
        gridHelper.getFooter().clickPreviousPaginationButton();
      } else {
        gridHelper.getFooter().clickNextPaginationButton();
      }
      tick();
      this.fixture.detectChanges();
      tick();
      this.fixture.detectChanges();

      this.selectRows(selectRows);
    };

    this.selectRows = (selectRows: number[]) => {
      const gridHelper = new GridHelper(this.fixture.debugElement);
      selectRows.forEach((selectedRowIndex: number) => {
        gridHelper.getRows()[selectedRowIndex].click();
        tick();
        this.fixture.detectChanges();
      });
    };

    this.verifySelectedRows = (selectedRows: number[]) => {
      const gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getSelectedRows().length).toBe(selectedRows.length);
      selectedRows.forEach((selectedRowIndex: number) => {
        expect(gridHelper.getRows()[selectedRowIndex].isSelected()).toBeTruthy();
      });
    };
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        NoopAnimationsModule,
        OverlayModule,
        DatagridColumnsOrderModule,
        DragDropModule,
        DatagridHostForServerSideGridComponent,
      ],
      declarations: [
        MockDatagridColumnToggleComponent,
        MockDatagridCellContainerComponent,
        MockDatagridActionBarComponent,
        MockIsRowSelectablePipe,
      ],
      providers: [
        {
          provide: ZoomLevelService,
          useClass: ZoomLevelServiceMock,
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

    this.fixture = TestBed.createComponent(DatagridHostForServerSideGridComponent);
    this.appfxDatagridHostComponent = this.fixture.componentInstance;

    this.appfxDatagridHostComponent.datagridComponent.ngOnInit();
    this.fixture.detectChanges(false);

    this.fixture.detectChanges();
    this.appfxDatagridHostComponent.datagridComponent.selectedItems = []; // reset
    this.fixture.detectChanges(false);
  });

  it(
    'the directive preserve selection for all items ' +
      'which are already selected and found in the new grid items array ' +
      'the old selected items which are not found in the new items array are preserved as selected too',
    function (this: any) {
      const gridData = this.appfxDatagridHostComponent.allData;
      this.appfxDatagridHostComponent.selectedItems = [gridData[0], gridData[1], gridData[3]];
      this.fixture.detectChanges(false);
      expect(this.appfxDatagridHostComponent.datagridComponent.selectedItems.length).toEqual(3);
      const newData = [
        {
          status: 'unknown',
          name: 'vm0',
          powerState: PowerState.off,
          host: '10.23.45.68',
        },
        {
          status: 'green',
          name: 'vm5',
          powerState: PowerState.on,
          host: '10.23.45.169',
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
      ];
      this.appfxDatagridHostComponent.data = this.newData;

      this.fixture.detectChanges(false);
      expect(this.appfxDatagridHostComponent.datagridComponent.selectedItems.length).toEqual(3);
      expect(this.appfxDatagridHostComponent.datagridComponent.selectedItems[0]).toEqual(newData[0]);
      expect(this.appfxDatagridHostComponent.datagridComponent.selectedItems[1]).toEqual(gridData[1]);
      expect(this.appfxDatagridHostComponent.datagridComponent.selectedItems[2]).toEqual(newData[3]);
    }
  );

  describe('when the grid is with multi-selection', () => {
    it('selection is preserve when move between pages', fakeAsync(function (this: any) {
      this.selectRows([0, 1]);
      this.verifySelectedRows([0, 1]);
      //Move to second page
      this.moveToTheNextPageAndSelectRows([0]);
      this.verifySelectedRows([0]);
      //Move to third page
      this.moveToTheNextPageAndSelectRows([1]);
      this.verifySelectedRows([1]);
      //Move to forth page
      this.moveToTheNextPageAndSelectRows([0, 1]);
      this.verifySelectedRows([0, 1]);
      //Move to third page
      this.moveToThePreviousPageAndSelectRows([]);
      this.verifySelectedRows([1]);
      //Move to forth page
      this.moveToTheNextPageAndSelectRows([]);
      this.verifySelectedRows([0, 1]);
      //Move to third page
      this.moveToThePreviousPageAndSelectRows([]);
      this.verifySelectedRows([1]);
      //Move to second page
      this.moveToThePreviousPageAndSelectRows([]);
      this.verifySelectedRows([0]);
      //Move to first page
      this.moveToThePreviousPageAndSelectRows([]);
      tick();
      this.verifySelectedRows([0, 1]);
    }));

    it('selection is preserve when refresh data', fakeAsync(function (this: any) {
      this.selectRows([0, 1]);
      this.verifySelectedRows([0, 1]);
      this.moveToTheNextPageAndSelectRows([0]);
      this.verifySelectedRows([0]);
      this.moveToThePreviousPageAndSelectRows([]);
      this.verifySelectedRows([0, 1]);
      this.appfxDatagridHostComponent.data = [
        {
          status: 'unknown',
          name: 'vm0',
          powerState: PowerState.off,
          host: '10.23.45.99',
        },
        {
          status: 'green',
          name: 'vm1',
          powerState: PowerState.on,
          host: '10.23.45.100',
        },
      ];
      this.fixture.detectChanges();
      tick();
      this.fixture.detectChanges();
      this.verifySelectedRows([0, 1]);
      this.moveToTheNextPageAndSelectRows([]);
      tick();
      this.verifySelectedRows([0]);
    }));
  });

  describe('when the grid is with single selection', () => {
    beforeEach(fakeAsync(function (this: any) {
      this.appfxDatagridHostComponent.datagridComponent.selectionType = SelectionType.Single;
      this.appfxDatagridHostComponent.datagridComponent.onModelChange();
      this.fixture.detectChanges();
      tick();
    }));

    it('selection is preserve when move between pages', fakeAsync(function (this: any) {
      const gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getRows()[1].isRowSingleSelectable()).toBeTruthy();
      this.selectRows([0]);
      this.verifySelectedRows([0]);
      //Move to second page
      this.moveToTheNextPageAndSelectRows([]);
      this.verifySelectedRows([]);
      // Move to first page
      this.moveToThePreviousPageAndSelectRows([]);
      this.verifySelectedRows([0]);
      // Move to second page
      this.moveToTheNextPageAndSelectRows([1]);
      this.verifySelectedRows([1]);

      // Move to third page
      this.moveToTheNextPageAndSelectRows([]);
      this.verifySelectedRows([]);
      // Move to four page
      this.moveToTheNextPageAndSelectRows([]);
      this.verifySelectedRows([]);
      // Move to third page
      this.moveToThePreviousPageAndSelectRows([]);
      // Move to second page
      this.moveToThePreviousPageAndSelectRows([]);
      this.verifySelectedRows([1]);
      // Move to first page
      this.moveToThePreviousPageAndSelectRows([]);
      // Move to second page
      this.moveToTheNextPageAndSelectRows([]);
      this.verifySelectedRows([1]);
    }));

    it('selection is preserve when refresh data', fakeAsync(function (this: any) {
      this.selectRows([1]);
      this.verifySelectedRows([1]);
      this.moveToTheNextPageAndSelectRows([]);
      this.verifySelectedRows([]);

      this.moveToThePreviousPageAndSelectRows([]);
      this.verifySelectedRows([1]);
      this.appfxDatagridHostComponent.data = [
        {
          status: 'unknown',
          name: 'vm0',
          powerState: PowerState.on,
          host: '10.23.45.99',
        },
        {
          status: 'green',
          name: 'vm1',
          powerState: PowerState.on,
          host: '10.23.45.100',
        },
      ];

      this.fixture.detectChanges();
      tick();

      this.verifySelectedRows([1]);
    }));
  });

  it("does not preserve selection when 'preserveSelection' is set to false", fakeAsync(function (this: any) {
    this.fixture = TestBed.createComponent(DatagridHostForServerSideGridComponent);
    this.appfxDatagridHostComponent = this.fixture.componentInstance;
    this.appfxDatagridHostComponent.preserveSelection = false;

    this.appfxDatagridHostComponent.datagridComponent.ngOnInit();
    this.fixture.detectChanges(false);

    this.fixture.detectChanges();
    tick();
    this.appfxDatagridHostComponent.datagridComponent.selectedItems = [];
    this.fixture.detectChanges(false);

    this.fixture.detectChanges(false);
    spyOn(this.appfxDatagridHostComponent.directive, 'updateSelectedItems');
    const gridData = this.appfxDatagridHostComponent.data;
    this.fixture.detectChanges(false);
    expect(this.appfxDatagridHostComponent.directive.updateSelectedItems).not.toHaveBeenCalled();
    this.appfxDatagridHostComponent.data = [...gridData];
    this.appfxDatagridHostComponent.selectedItems = [gridData[0]];
    this.fixture.detectChanges(false);
    tick();
    expect(this.appfxDatagridHostComponent.directive.updateSelectedItems).not.toHaveBeenCalled();
  }));

  afterEach(function (this: any) {
    this.fixture.destroy();
    this.appfxDatagridHostComponent.columnsDefs = null;
    this.appfxDatagridHostComponent.data = null;
    this.appfxDatagridHostComponent.selectedItems = null;
    this.appfxDatagridHostComponent = null;
    this.directive = null;
  });
});
