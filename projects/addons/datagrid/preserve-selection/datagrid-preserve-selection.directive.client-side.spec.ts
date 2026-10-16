/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
import { SelectionType } from '@clr/angular/data/datagrid';

import { DatagridColumnsOrderModule } from '../addons/column-ordering/datagrid-columns-order.module';
import { ExportProviderService } from '../addons/export/export-provider.service';
import { DatagridComponent } from '../datagrid.component';
import { AppfxDatagridModule } from '../datagrid.module';
import { DatagridPreserveSelectionDirective } from './datagrid-preserve-selection.directive';
import { DatagridStrings } from '../i18n/datagrid-strings.service';
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
  selector: 'appfx-datagrid-client-side-host-component',
  imports: [AppfxDatagridModule, DatagridColumnsOrderModule, DragDropModule, FormsModule, OverlayModule],
  template: `
    <appfx-datagrid
      appfxPreserveSelection
      [preserveExistingSelection]="preserveSelection"
      [trackByFunction]="trackByFunction"
      [selectionType]="selectionType"
      [gridItems]="data"
      [pageSize]="pageSize"
      [selectedItems]="selectedItems"
      [totalItems]="data.length"
      [columns]="columnsDefs"
    ></appfx-datagrid>
  `,
  standalone: true,
})
class DatagridForClientSideGridHostComponent {
  @ViewChild(DatagridComponent, { static: true }) datagridComponent: DatagridComponent<unknown>;

  @ViewChild(DatagridPreserveSelectionDirective, { static: true }) directive: DatagridPreserveSelectionDirective;

  preserveSelection = true;
  pageSize = 4;
  data: any[] = allGridData.slice(0, 4);
  selectedItems: any[] = [];
  columnsDefs: ColumnDefinition<any>[] = columns;
  selectionType = SelectionType.Multi;

  trackByFunction = (index: number, item: any) => item.name;
}

describe('datagrid-preserve-selection-directive.client-side', () => {
  let testContext: any;
  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    testContext.moveToTheNextPageAndSelectRows = (selectRows: number[]) => {
      testContext.moveToNewPageAndSelectRow(selectRows);
    };

    testContext.moveToThePreviousPageAndSelectRows = (selectRows: number[]) => {
      testContext.moveToNewPageAndSelectRow(selectRows, true);
    };
    testContext.moveToNewPageAndSelectRow = (selectRows: number[], previousPage?: boolean) => {
      const gridHelper = new GridHelper(testContext.fixture.debugElement);
      if (previousPage) {
        gridHelper.getFooter().clickPreviousPaginationButton();
      } else {
        gridHelper.getFooter().clickNextPaginationButton();
      }
      tick();
      testContext.fixture.detectChanges();
      tick();
      testContext.fixture.detectChanges();

      testContext.selectRows(selectRows);
    };

    testContext.selectRows = (selectRows: number[]) => {
      const gridHelper = new GridHelper(testContext.fixture.debugElement);
      selectRows.forEach((selectedRowIndex: number) => {
        gridHelper.getRows()[selectedRowIndex].click();
        tick();
        testContext.fixture.detectChanges();
      });
    };

    testContext.verifySelectedRows = (selectedRows: number[]) => {
      const gridHelper = new GridHelper(testContext.fixture.debugElement);
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
        DatagridForClientSideGridHostComponent,
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

    testContext.fixture = TestBed.createComponent(DatagridForClientSideGridHostComponent);
    testContext.appfxDatagridHostComponent = testContext.fixture.componentInstance;
  });

  it('is called when datagrid items changed is emitted and there are already selected items in the grid', () => {
    testContext.fixture.detectChanges(false);
    spyOn(testContext.appfxDatagridHostComponent.directive, 'updateSelectedItems');
    const gridData = testContext.appfxDatagridHostComponent.data;
    testContext.fixture.detectChanges(false);
    expect(testContext.appfxDatagridHostComponent.directive.updateSelectedItems).not.toHaveBeenCalled();
    testContext.appfxDatagridHostComponent.data = [...gridData];
    testContext.appfxDatagridHostComponent.selectedItems = [gridData[0]];
    testContext.fixture.detectChanges(false);
    expect(testContext.appfxDatagridHostComponent.directive.updateSelectedItems).toHaveBeenCalledWith(gridData);
    expect(testContext.appfxDatagridHostComponent.datagridComponent.selectedItems[0]).toEqual(gridData[0]);
  });

  it('preserve selection for all items when uses track by function', () => {
    testContext.appfxDatagridHostComponent.trackByFunction = (index: number, value: any) => {
      return `${value['status']};${value['host']}`;
    };
    const gridData = testContext.appfxDatagridHostComponent.data;

    testContext.appfxDatagridHostComponent.selectedItems = [gridData[0], gridData[1], gridData[3]];
    testContext.fixture.detectChanges(false);
    expect(testContext.appfxDatagridHostComponent.datagridComponent.selectedItems.length).toEqual(3);
    testContext.newData = [
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
        host: '10.23.45.60',
      },
      {
        status: 'red',
        name: 'vm3',
        powerState: PowerState.off,
        host: '10.23.45.70',
      },
      {
        status: 'green',
        name: 'vm6',
        powerState: PowerState.on,
        host: '10.23.45.72',
      },
    ];
    testContext.appfxDatagridHostComponent.data = testContext.newData;

    testContext.fixture.detectChanges(false);

    expect(testContext.appfxDatagridHostComponent.datagridComponent.selectedItems.length).toEqual(2);
    expect(testContext.appfxDatagridHostComponent.datagridComponent.selectedItems[0]).toEqual(testContext.newData[0]);
    expect(testContext.appfxDatagridHostComponent.datagridComponent.selectedItems[1]).toEqual(testContext.newData[3]);
  });

  it(
    'the directive preserve selection for all items ' +
      'which are already selected and found in the new grid items array ' +
      'the old selected items which are not found in the new items array are remove from selection',
    () => {
      const gridData = testContext.appfxDatagridHostComponent.data;
      testContext.appfxDatagridHostComponent.selectedItems = [gridData[0], gridData[1], gridData[3]];
      testContext.fixture.detectChanges(false);
      expect(testContext.appfxDatagridHostComponent.datagridComponent.selectedItems.length).toEqual(3);
      testContext.newData = [
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
      ];
      testContext.appfxDatagridHostComponent.data = testContext.newData;

      testContext.fixture.detectChanges(false);

      expect(testContext.appfxDatagridHostComponent.datagridComponent.selectedItems.length).toEqual(2);
      expect(testContext.appfxDatagridHostComponent.datagridComponent.selectedItems[0]).toEqual(testContext.newData[0]);
      expect(testContext.appfxDatagridHostComponent.datagridComponent.selectedItems[1]).toEqual(testContext.newData[3]);
    }
  );

  describe('when the grid is with multi-selection', () => {
    beforeEach(fakeAsync(() => {
      testContext.appfxDatagridHostComponent.pageSize = 2;
      testContext.appfxDatagridHostComponent.data = allGridData;
      testContext.fixture.detectChanges(false);
      tick();
    }));
    it('selection is preserved when move between pages', fakeAsync(() => {
      testContext.selectRows([0, 1]);
      testContext.verifySelectedRows([0, 1]);

      testContext.moveToTheNextPageAndSelectRows([0]);
      testContext.verifySelectedRows([0]);

      testContext.moveToTheNextPageAndSelectRows([1]);
      testContext.verifySelectedRows([1]);

      testContext.moveToTheNextPageAndSelectRows([0, 1]);
      testContext.verifySelectedRows([0, 1]);

      testContext.moveToThePreviousPageAndSelectRows([]);
      testContext.verifySelectedRows([1]);

      testContext.moveToTheNextPageAndSelectRows([]);
      testContext.verifySelectedRows([0, 1]);

      testContext.moveToThePreviousPageAndSelectRows([]);
      testContext.verifySelectedRows([1]);

      testContext.moveToThePreviousPageAndSelectRows([]);
      testContext.verifySelectedRows([0]);

      testContext.moveToThePreviousPageAndSelectRows([]);
      testContext.verifySelectedRows([0, 1]);
    }));

    it('selection is preserved when refresh data', fakeAsync(() => {
      testContext.selectRows([0, 1]);
      testContext.verifySelectedRows([0, 1]);
      testContext.moveToTheNextPageAndSelectRows([0]);
      testContext.verifySelectedRows([0]);
      testContext.moveToThePreviousPageAndSelectRows([]);
      testContext.verifySelectedRows([0, 1]);
      //Simulate data refresh by create new instances of data
      testContext.appfxDatagridHostComponent.data = allGridData.map((item: any) => {
        return { ...item };
      });
      testContext.fixture.detectChanges();
      tick();
      testContext.fixture.detectChanges();
      testContext.verifySelectedRows([0, 1]);
      testContext.moveToTheNextPageAndSelectRows([]);
      testContext.verifySelectedRows([0]);
    }));

    it('calls onSelectedItemsChange() method of datagrid when grid items are updated', fakeAsync(() => {
      testContext.selectRows([0, 1]);
      testContext.verifySelectedRows([0, 1]);
      spyOn(testContext.appfxDatagridHostComponent.datagridComponent, 'onSelectedItemsChange');
      //Simulate data refresh by create new instances of data
      testContext.appfxDatagridHostComponent.data = allGridData.map((item: any) => {
        return { ...item };
      });
      testContext.fixture.detectChanges();
      tick();
      expect(testContext.appfxDatagridHostComponent.datagridComponent.onSelectedItemsChange).toHaveBeenCalled();
    }));
  });

  describe('when the grid is with single selection', () => {
    beforeEach(fakeAsync(() => {
      testContext.appfxDatagridHostComponent.pageSize = 2;
      testContext.appfxDatagridHostComponent.data = allGridData;
      testContext.appfxDatagridHostComponent.selectionType = SelectionType.Single;
      testContext.fixture.detectChanges();
      tick();
    }));

    it('selection is preserved when move between pages', fakeAsync(() => {
      const gridHelper = new GridHelper(testContext.fixture.debugElement);
      expect(gridHelper.getRows()[1].isRowSingleSelectable()).toBeTruthy();
      testContext.selectRows([0]);
      testContext.verifySelectedRows([0]);
      //Move to second page
      testContext.moveToTheNextPageAndSelectRows([]);
      testContext.verifySelectedRows([]);
      // Move to first page
      testContext.moveToThePreviousPageAndSelectRows([]);
      testContext.verifySelectedRows([0]);
      // Move to second page
      testContext.moveToTheNextPageAndSelectRows([1]);
      testContext.verifySelectedRows([1]);

      // Move to third page
      testContext.moveToTheNextPageAndSelectRows([]);
      testContext.verifySelectedRows([]);
      // Move to four page
      testContext.moveToTheNextPageAndSelectRows([]);
      testContext.verifySelectedRows([]);
      // Move to third page
      testContext.moveToThePreviousPageAndSelectRows([]);
      // Move to second page
      testContext.moveToThePreviousPageAndSelectRows([]);
      testContext.verifySelectedRows([1]);
      // Move to first page
      testContext.moveToThePreviousPageAndSelectRows([]);
      // Move to second page
      testContext.moveToTheNextPageAndSelectRows([]);
      testContext.verifySelectedRows([1]);
    }));

    it('selection is preserve when refreshing data', fakeAsync(() => {
      testContext.selectRows([1]);
      testContext.verifySelectedRows([1]);
      testContext.moveToTheNextPageAndSelectRows([]);
      testContext.verifySelectedRows([]);

      testContext.moveToThePreviousPageAndSelectRows([]);
      testContext.verifySelectedRows([1]);
      //Simulate data refresh by create new instances of data
      testContext.appfxDatagridHostComponent.data = allGridData.map((item: any) => {
        return { ...item };
      });
      testContext.fixture.detectChanges();
      tick();
      testContext.fixture.detectChanges();
      testContext.verifySelectedRows([1]);
    }));
  });

  it("does not preserve selection when 'preserveExistingSelection' is set to falsy", fakeAsync(() => {
    testContext.appfxDatagridHostComponent.preserveSelection = false;
    testContext.appfxDatagridHostComponent.pageSize = 2;
    testContext.appfxDatagridHostComponent.data = allGridData;
    testContext.fixture.detectChanges(false);
    tick();

    testContext.fixture.detectChanges(false);
    spyOn(testContext.appfxDatagridHostComponent.directive, 'updateSelectedItems');
    const gridData = testContext.appfxDatagridHostComponent.data;
    testContext.fixture.detectChanges(false);
    tick();
    expect(testContext.appfxDatagridHostComponent.directive.updateSelectedItems).not.toHaveBeenCalled();
    testContext.appfxDatagridHostComponent.data = [...gridData];
    testContext.appfxDatagridHostComponent.selectedItems = [gridData[0]];
    testContext.fixture.detectChanges(false);
    expect(testContext.appfxDatagridHostComponent.directive.updateSelectedItems).not.toHaveBeenCalled();
  }));

  afterEach(() => {
    testContext.fixture.destroy();
    testContext.appfxDatagridHostComponent.columnsDefs = null;
    testContext.appfxDatagridHostComponent.data = null;
    testContext.appfxDatagridHostComponent.selectedItems = null;
    testContext.appfxDatagridHostComponent = null;
    testContext.directive = null;
  });
});
