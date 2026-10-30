/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkConnectedOverlay, CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
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
  selector: 'appfx-datagrid-host-component-server-side',
  imports: [AppfxDatagridModule, DatagridColumnsOrderModule, DragDropModule, FormsModule, OverlayModule],
  template: `
    <appfx-datagrid
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
        exportUIOnlyData: vi.fn(),
      },
    });

    testContext.fixture = TestBed.createComponent(DatagridHostForServerSideGridComponent);
    testContext.appfxDatagridHostComponent = testContext.fixture.componentInstance;

    testContext.appfxDatagridHostComponent.datagridComponent.ngOnInit();
    testContext.fixture.detectChanges(false);

    testContext.fixture.detectChanges();
    testContext.appfxDatagridHostComponent.datagridComponent.selectedItems = []; // reset
    testContext.fixture.detectChanges(false);
  });

  it(
    'the directive preserve selection for all items ' +
      'which are already selected and found in the new grid items array ' +
      'the old selected items which are not found in the new items array are preserved as selected too',
    () => {
      const gridData = testContext.appfxDatagridHostComponent.allData;
      testContext.appfxDatagridHostComponent.selectedItems = [gridData[0], gridData[1], gridData[3]];
      testContext.fixture.detectChanges(false);
      expect(testContext.appfxDatagridHostComponent.datagridComponent.selectedItems.length).toEqual(3);
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
      testContext.appfxDatagridHostComponent.data = testContext.newData;

      testContext.fixture.detectChanges(false);
      expect(testContext.appfxDatagridHostComponent.datagridComponent.selectedItems.length).toEqual(3);
      expect(testContext.appfxDatagridHostComponent.datagridComponent.selectedItems[0]).toEqual(newData[0]);
      expect(testContext.appfxDatagridHostComponent.datagridComponent.selectedItems[1]).toEqual(gridData[1]);
      expect(testContext.appfxDatagridHostComponent.datagridComponent.selectedItems[2]).toEqual(newData[3]);
    }
  );

  describe('when the grid is with multi-selection', () => {
    it('selection is preserve when move between pages', fakeAsync(() => {
      testContext.selectRows([0, 1]);
      testContext.verifySelectedRows([0, 1]);
      //Move to second page
      testContext.moveToTheNextPageAndSelectRows([0]);
      testContext.verifySelectedRows([0]);
      //Move to third page
      testContext.moveToTheNextPageAndSelectRows([1]);
      testContext.verifySelectedRows([1]);
      //Move to forth page
      testContext.moveToTheNextPageAndSelectRows([0, 1]);
      testContext.verifySelectedRows([0, 1]);
      //Move to third page
      testContext.moveToThePreviousPageAndSelectRows([]);
      testContext.verifySelectedRows([1]);
      //Move to forth page
      testContext.moveToTheNextPageAndSelectRows([]);
      testContext.verifySelectedRows([0, 1]);
      //Move to third page
      testContext.moveToThePreviousPageAndSelectRows([]);
      testContext.verifySelectedRows([1]);
      //Move to second page
      testContext.moveToThePreviousPageAndSelectRows([]);
      testContext.verifySelectedRows([0]);
      //Move to first page
      testContext.moveToThePreviousPageAndSelectRows([]);
      tick();
      testContext.verifySelectedRows([0, 1]);
    }));

    it('selection is preserve when refresh data', fakeAsync(() => {
      testContext.selectRows([0, 1]);
      testContext.verifySelectedRows([0, 1]);
      testContext.moveToTheNextPageAndSelectRows([0]);
      testContext.verifySelectedRows([0]);
      testContext.moveToThePreviousPageAndSelectRows([]);
      testContext.verifySelectedRows([0, 1]);
      testContext.appfxDatagridHostComponent.data = [
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
      testContext.fixture.detectChanges();
      tick();
      testContext.fixture.detectChanges();
      testContext.verifySelectedRows([0, 1]);
      testContext.moveToTheNextPageAndSelectRows([]);
      tick();
      testContext.verifySelectedRows([0]);
    }));
  });

  describe('when the grid is with single selection', () => {
    beforeEach(fakeAsync(() => {
      testContext.appfxDatagridHostComponent.datagridComponent.selectionType = SelectionType.Single;
      testContext.appfxDatagridHostComponent.datagridComponent.onModelChange();
      testContext.fixture.detectChanges();
      tick();
    }));

    it('selection is preserve when move between pages', fakeAsync(() => {
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

    it('selection is preserve when refresh data', fakeAsync(() => {
      testContext.selectRows([1]);
      testContext.verifySelectedRows([1]);
      testContext.moveToTheNextPageAndSelectRows([]);
      testContext.verifySelectedRows([]);

      testContext.moveToThePreviousPageAndSelectRows([]);
      testContext.verifySelectedRows([1]);
      testContext.appfxDatagridHostComponent.data = [
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

      testContext.fixture.detectChanges();
      tick();

      testContext.verifySelectedRows([1]);
    }));
  });

  afterEach(() => {
    testContext.fixture.destroy();
    testContext.appfxDatagridHostComponent.columnsDefs = null;
    testContext.appfxDatagridHostComponent.data = null;
    testContext.appfxDatagridHostComponent.selectedItems = null;
    testContext.appfxDatagridHostComponent = null;
    testContext.directive = null;
  });
});
