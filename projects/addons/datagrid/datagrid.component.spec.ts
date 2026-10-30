/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { A11yModule as CdkA11yModule } from '@angular/cdk/a11y';
import { CdkDrag, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DebugElement,
  NgModule,
  signal,
  SimpleChange,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ZoomLevelService } from '@clr/addons/a11y';
import { DatagridFiltersStrings, FilterMode, PropertyFilter } from '@clr/addons/datagrid-filters';
import { DragAndDropGroupService } from '@clr/addons/drag-and-drop';
import {
  FilterInputTestHelper,
  GridHelper,
  GridRowTestHelper,
  MockDatagridActionBarComponent,
  MockDatagridCellContainerComponent,
  MockDatagridPreserveSelectionDirective,
  MockIsRowSelectablePipe,
  ZoomLevelServiceMock,
} from '@clr/addons/testing';
import {
  ClrDatagridColumn,
  ClrDatagridColumnActions,
  ClrDatagridComparatorInterface,
  ClrDatagridFilterInterface,
  ClrDatagridSortOrder,
  ClrDatagridStateInterface,
  ClrDatagridStringFilterInterface,
  ClrDatagridVirtualScrollRangeInterface,
  SelectionType,
} from '@clr/angular/data/datagrid';
import { ClrCheckboxModule, ClrInputModule, ClrSelectModule } from '@clr/angular/forms';
import { ClrIcon } from '@clr/angular/icon';
import { renderFixture } from '@clr/angular/utils/testing';
import { Observable, Subject } from 'rxjs';

import { useTestTimers } from '../../test-timers';
import { DatagridColumnsOrderModule } from './addons/column-ordering/datagrid-columns-order.module';
import { DatagridColumnToggleComponent } from './addons/column-toggle/datagrid-column-toggle.component';
import { ExportProviderService } from './addons/export/export-provider.service';
import { ExportType } from './addons/export/export-type';
import { ClientSideExportConfig, ExportStatus } from './addons/export/export.interface';
import { DatagridComponent } from './datagrid.component';
import { AppfxDatagridModule } from './datagrid.module';
import { DatagridStrings } from './i18n/datagrid-strings.service';
import { ColumnSortOrder } from './interfaces/column-state';
import { ActionDefinition } from './shared/action/action-definition';
import { ActionClickEvent } from './shared/action/actions-event-types';
import { ColumnDefinition, ColumnRenderer } from './shared/column/column-definitions';

interface DatagridSpecContext {
  columnsDefs: ColumnDefinition<any>[];
  data: any[];
  actions: any[];
  dgStrings: DatagridStrings;
  fixture: ComponentFixture<DatagridHostComponent>;
  component: DatagridHostComponent;
}

describe('DatagridComponent', () => {
  let testContext: DatagridSpecContext;
  beforeEach(() => {
    testContext = {} as DatagridSpecContext;
  });

  beforeEach(() => {
    const untypedContext: any = testContext;

    TestBed.configureTestingModule({
      imports: [
        ClrCheckboxModule,
        ClrInputModule,
        ClrSelectModule,
        FormsModule,
        CdkA11yModule,
        TestModule,
        OverlayModule,
        DragDropModule,
        DatagridColumnsOrderModule,
        DatagridHostComponent,
      ],
      declarations: [
        MockDatagridCellContainerComponent,
        MockDatagridPreserveSelectionDirective,
        MockDatagridActionBarComponent,
        MockIsRowSelectablePipe,
      ],
      providers: [
        {
          provide: ZoomLevelService,
          useClass: ZoomLevelServiceMock,
        },
        {
          provide: DatagridFiltersStrings,
          useClass: DatagridFiltersStrings,
        },
        { provide: DatagridStrings, useClass: DatagridStrings },
        {
          provide: DragAndDropGroupService,
          useValue: {
            getGroupItems: () => [],
          },
        },
      ],
    });

    untypedContext.columnsDefs = [
      {
        displayName: 'Name',
        field: 'name',
        width: 10 + 'px',
      },
      {
        displayName: 'State',
        field: 'powerState',
        width: 100 + 'px',
      },
      {
        displayName: 'Status',
        field: 'status',
        sortComparator: new StatusComparator(),
        width: 100 + 'px', // last column ignored by Clarity undocumented rules pertaining to strict widths
      },
    ] as Array<ColumnDefinition<any>>;

    untypedContext.data = [
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
    ];

    untypedContext.actions = [
      {
        id: 'cloneId',
        label: 'Clone',
        tooltip: 'Clone tooltip',
        enabled: true,
      },
      {
        id: 'deleteId',
        label: 'Delete',
        tooltip: 'Delete tooltip',
        enabled: true,
      },
      {
        id: 'migrateId',
        label: 'Migrate',
        tooltip: 'Migrate tooltip',
        enabled: true,
      },
    ];

    untypedContext.fixture = TestBed.createComponent(DatagridHostComponent);
    untypedContext.component = untypedContext.fixture.componentInstance;
    untypedContext.dgStrings = TestBed.inject(DatagridStrings);
  });

  afterEach(() => {
    const untypedContext: any = testContext;

    untypedContext.actions = null;
    untypedContext.columnsDefs = null;
    untypedContext.data = null;
    untypedContext.component.columnsDefs = null;
    untypedContext.component.data = null;
    untypedContext.component = null;
    untypedContext.fixture.destroy();
  });

  it('has the right columns', () => {
    const untypedContext: any = testContext;

    untypedContext.component.columnsDefs = untypedContext.columnsDefs;
    renderFixture(untypedContext.fixture);
    const gridHelper = new GridHelper(untypedContext.fixture.debugElement);

    const headers = gridHelper.getHeaders();
    headers.forEach((columnName: string, index: number) => {
      expect(columnName).toEqual(untypedContext.columnsDefs[index].displayName);
    });

    const rows = gridHelper.getRows();
    expect(rows.length).toEqual(0);
  });

  it('emits change event when column definitions are set', () => {
    const untypedContext: any = testContext;

    vi.spyOn(untypedContext.component, 'onColumnDefsChange').mockImplementation(() => undefined);
    untypedContext.component.columnsDefs = untypedContext.columnsDefs;
    renderFixture(untypedContext.fixture);
    expect(untypedContext.component.onColumnDefsChange).toHaveBeenCalledWith(untypedContext.columnsDefs);
  });

  it('emits change event when page size is set', () => {
    const untypedContext: any = testContext;

    const pageSize = 10;
    vi.spyOn(untypedContext.component, 'onPageSizeChange').mockImplementation(() => undefined);
    untypedContext.component.appfxDatagridComponent.pageSize = pageSize;
    renderFixture(untypedContext.fixture);
    expect(untypedContext.component.onPageSizeChange).toHaveBeenCalledWith(pageSize);
  });

  it('has the right rows', () => {
    const untypedContext: any = testContext;

    untypedContext.component.selectionType = SelectionType.None;
    untypedContext.component.columnsDefs = untypedContext.columnsDefs;
    untypedContext.component.data = untypedContext.data;
    renderFixture(untypedContext.fixture); // data received, update view

    const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
    const rows = gridHelper.getRows();

    expect(rows.length).toEqual(untypedContext.data.length);

    rows.forEach((row: GridRowTestHelper, rowIndex: number) => {
      const expectedRow = untypedContext.data[rowIndex];
      for (const columnDef of untypedContext.columnsDefs) {
        expect(row.getCell(columnDef.displayName).getCellWrapperElement()?.textContent?.trim()).toEqual(
          expectedRow[columnDef.field]
        );
      }
    });
  });

  it('updates the grid cells in the grid rows when the grid data are changed and trackByProperty is specified', () => {
    const untypedContext: any = testContext;

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
        columnRenderer: StatusRendererComponent,
      },
    ];

    // monitor a change field example: nested property 'identity' > 'value'
    const trackByPropertyPath = ['identity', 'value'];
    const propSeparator = '.';
    untypedContext.component.trackByProperty = trackByPropertyPath.join(propSeparator);
    untypedContext.component.selectionType = SelectionType.None;
    untypedContext.component.columnsDefs = columns;
    untypedContext.component.data = untypedContext.data;

    renderFixture(untypedContext.fixture); // data received, update view

    // for example, "identity" is part of data, but not required to be displayed in grid
    const newData = [
      {
        identity: { value: '1234', type: 'VirtualMachine', server: 'remoteABC' },
        status: 'yellow',
        name: 'vm0',
        powerState: PowerState.off,
        host: '10.23.45.168',
      },
      {
        identity: { value: '5678', type: 'VirtualMachine', server: 'remoteABC' },
        status: 'green',
        name: 'vm1',
        powerState: PowerState.on,
        host: '10.23.45.169',
      },
      {
        identity: { value: '2020', type: 'VirtualMachine', server: 'remoteDEF' },
        status: 'red',
        name: 'vm3',
        powerState: PowerState.off,
        host: '10.23.45.170',
      },
      {
        identity: { value: '89052', type: 'VirtualMachine', server: 'remoteXYZ' },
        status: 'green',
        name: 'vm2',
        powerState: PowerState.on,
        host: '10.23.45.172',
      },
    ];

    untypedContext.component.data = newData;
    renderFixture(untypedContext.fixture);

    const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
    const rows = gridHelper.getRows();

    expect(rows.length).toEqual(untypedContext.data.length);

    rows.forEach((row: GridRowTestHelper, rowIndex: number) => {
      const expectedRow = newData[rowIndex] as any;
      for (const columnDef of untypedContext.columnsDefs) {
        let expectedValue;
        if (columnDef.displayName === 'Status') {
          const status = expectedRow[columnDef.field];
          if (status === 'green') {
            expectedValue = 'Normal';
          } else if (status === 'yellow') {
            expectedValue = 'Warning';
          } else if (status === 'red') {
            expectedValue = 'Error';
          } else {
            expectedValue = 'Unknown';
          }
        } else {
          expectedValue = expectedRow[columnDef.field];
        }
        expect(row.getCell(columnDef.displayName).getCellWrapperElement().textContent?.trim().trim()).toEqual(
          expectedValue
        );
      }
    });
  });

  it('has correct placeholder text with default value', () => {
    testContext.component.selectionType = SelectionType.None;
    testContext.component.columnsDefs = testContext.columnsDefs;
    renderFixture(testContext.fixture); // data received, update view

    const gridHelper = new GridHelper(testContext.fixture.debugElement);
    const rows = gridHelper.getRows();

    expect(rows.length).toEqual(0);
    expect(gridHelper.getPlaceholder().getElement()).toBeTruthy();
    expect(gridHelper.getPlaceholder().getText()).toContain(testContext.dgStrings.noItemsFound);
  });

  it('has correct placeholder text with custom value', () => {
    testContext.component.selectionType = SelectionType.None;
    testContext.component.columnsDefs = testContext.columnsDefs;
    const customPlaceholderText = 'Custom no items found text';
    testContext.component.datagridLabels = {
      noItemsFound: customPlaceholderText,
    };
    renderFixture(testContext.fixture); // data received, update view
    const gridHelper = new GridHelper(testContext.fixture.debugElement);
    const rows = gridHelper.getRows();
    expect(rows.length).toEqual(0);
    expect(gridHelper.getPlaceholder().getElement()).toBeTruthy();
    expect(gridHelper.getPlaceholder().getText()).toContain(customPlaceholderText);
  });

  it('should project custom placeholder content when provided', () => {
    testContext.component.columnsDefs = testContext.columnsDefs;
    // Set empty data to show placeholder
    testContext.component.data = [];
    renderFixture(testContext.fixture);

    const gridHelper = new GridHelper(testContext.fixture.debugElement);
    const placeholderElement = gridHelper.getPlaceholder().getElement();

    expect(placeholderElement).toBeTruthy();

    // Check if custom placeholder content is projected
    const customPlaceholderContent = placeholderElement.querySelector('.custom-placeholder-content');
    expect(customPlaceholderContent).toBeTruthy();
    expect(customPlaceholderContent?.textContent?.trim()).toContain('Custom placeholder content');

    // Check if the button is also projected
    const customButton = customPlaceholderContent?.querySelector('button');
    expect(customButton).toBeTruthy();
    expect(customButton?.textContent?.trim()).toEqual('Add New Item');
    expect(customButton?.classList.contains('btn')).toBeTruthy();
    expect(customButton?.classList.contains('btn-primary')).toBeTruthy();
  });

  it('has the right row details', () => {
    const untypedContext: any = testContext;

    const allGridData = [...untypedContext.data];
    allGridData.push({
      status: 'Error',
      name: 'vm5',
      powerState: PowerState.off,
      rowDetailRenderer: RowDetailRendererComponent,
    });
    renderFixture(untypedContext.fixture);
    untypedContext.component.selectionType = SelectionType.None;
    untypedContext.component.columnsDefs = untypedContext.columnsDefs;
    untypedContext.component.data = allGridData;
    untypedContext.component.appfxDatagridComponent.rowDetailContent = undefined;
    renderFixture(untypedContext.fixture);

    const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
    const rows = gridHelper.getRows();
    expect(rows.length).toEqual(allGridData.length);

    rows.forEach((row: GridRowTestHelper, rowIndex: number) => {
      const expectedRow = allGridData[rowIndex];
      for (const columnDef of untypedContext.columnsDefs) {
        expect(row.getCell(columnDef.displayName).getCellWrapperElement().textContent?.trim()).toEqual(
          expectedRow[columnDef.field]
        );
      }
      expect(row.isRowExpandable()).toEqual(!!expectedRow.rowDetailRenderer);
    });
  });

  it('updates data in an empty datagrid', () => {
    const untypedContext: any = testContext;

    untypedContext.component.selectionType = SelectionType.None;
    untypedContext.component.columnsDefs = untypedContext.columnsDefs;
    renderFixture(untypedContext.fixture);
    const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
    expect(gridHelper.getRows().length).toEqual(0);
    untypedContext.component.data = untypedContext.data;
    renderFixture(untypedContext.fixture);
    expect(gridHelper.getRows().length).toEqual(4);
  });

  it('updates data in a datagrid with virtual scrolling', () => {
    const untypedContext: any = testContext;

    vi.spyOn(untypedContext.component, 'refreshVirtualGridData').mockImplementation(() => undefined);
    untypedContext.component.selectionType = SelectionType.None;
    untypedContext.component.columnsDefs = untypedContext.columnsDefs;
    untypedContext.component.virtualScrolling = true;
    untypedContext.component.trackByProperty = 'name';
    renderFixture(untypedContext.fixture);
    untypedContext.component.appfxDatagridComponent.renderedRangeChange({ start: 0, end: 10 });
    untypedContext.component.dataRange = { total: 5, skip: 0, data: untypedContext.data };
    renderFixture(untypedContext.fixture);
    expect(untypedContext.component.refreshVirtualGridData).toHaveBeenCalledWith({
      page: { from: 0, size: 10 },
    });
    expect(untypedContext.component.virtualScrolling).toEqual(true);
    expect(untypedContext.component.appfxDatagridComponent.dataRange).toEqual({
      total: 5,
      skip: 0,
      data: untypedContext.data,
    });
  });

  it('should render rows when serverDrivenDatagrid is true and virtualScrolling is false', () => {
    const untypedContext: any = testContext;

    untypedContext.component.selectionType = SelectionType.None;
    untypedContext.component.columnsDefs = untypedContext.columnsDefs;
    untypedContext.component.data = untypedContext.data;
    untypedContext.component.serverDrivenDatagrid = true;
    untypedContext.component.virtualScrolling = false;
    renderFixture(untypedContext.fixture);

    const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
    const rows = gridHelper.getRows();

    expect(rows.length).toEqual(untypedContext.data.length);

    rows.forEach((row: GridRowTestHelper, rowIndex: number) => {
      const expectedRow = untypedContext.data[rowIndex];
      for (const columnDef of untypedContext.columnsDefs) {
        expect(row.getCell(columnDef.displayName).getCellWrapperElement().textContent?.trim()).toEqual(
          expectedRow[columnDef.field]
        );
      }
    });
  });

  it('can render cell data with the help of column renderer', () => {
    const untypedContext: any = testContext;

    const testColumnsDefs: Array<ColumnDefinition<any>> = [
      {
        displayName: 'Name',
        field: 'name',
        stringFilter: new NameFilter(),
      },
      {
        displayName: 'State',
        field: 'powerState',
      },
      {
        displayName: 'Host',
        field: 'host',
        hidden: true,
      },
      {
        displayName: 'Status',
        field: 'status',
        columnRenderer: StatusRendererComponent,
        filter: PowerStateFilterComponent,
      },
    ];
    const states: string[] = ['Unknown', 'Normal', 'Error', 'Normal'];

    const sortByColumnField = 'status';
    const subjectColumnDefinition = testColumnsDefs.find(
      (col: ColumnDefinition<any>) => col.field === sortByColumnField
    );

    untypedContext.component.columnsDefs = testColumnsDefs;
    untypedContext.component.data = untypedContext.data;
    renderFixture(untypedContext.fixture);

    const subjectColumnIndex = untypedContext.component.appfxDatagridComponent.visibleColumns.findIndex(
      (col: ColumnDefinition<any>) => col === subjectColumnDefinition
    );
    const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
    const rows = gridHelper.getRows();

    expect(rows.length).toEqual(untypedContext.data.length);

    rows.forEach((row: GridRowTestHelper, rowIndex: number) => {
      const statusValue = row
        .getCellAt(subjectColumnIndex)
        .getCellWrapperElement('test-status-renderer span')
        .textContent?.trim()
        .trim();
      expect(statusValue).toEqual(states[rowIndex]);
    });
  });

  describe('uid', () => {
    interface UidSpecContext extends DatagridSpecContext {
      uid: string;
    }

    beforeEach(() => {
      const typedContext = testContext as unknown as UidSpecContext;

      typedContext.uid = (typedContext.component.appfxDatagridComponent as any).uid;
    });

    it('is used by buildRowDetailContentId', () => {
      const typedContext = testContext as unknown as UidSpecContext;

      expect(typedContext.component.appfxDatagridComponent.buildRowDetailContentId(123)).toContain(typedContext.uid);
    });
  });

  describe('column', () => {
    describe('sort', () => {
      describe('WHEN sortComparator is passed to one of the columns', () => {
        beforeEach(() => {
          const untypedContext: any = testContext;

          untypedContext.component.selectionType = SelectionType.Multi;
          untypedContext.component.columnsDefs = untypedContext.columnsDefs;
          untypedContext.component.data = untypedContext.data;

          renderFixture(untypedContext.fixture);
        });

        it('that column is sortable and others columns are not sortable', () => {
          const untypedContext: any = testContext;

          const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
          expect(gridHelper.isColumnSortable(untypedContext.columnsDefs[0].displayName)).toBeFalsy();
          expect(gridHelper.isColumnSortable(untypedContext.columnsDefs[1].displayName)).toBeFalsy();
          expect(gridHelper.isColumnSortable(untypedContext.columnsDefs[2].displayName)).toBeTruthy();
        });

        it('can sort by column using the defined sortComparator', () => {
          const untypedContext: any = testContext;

          const states: string[] = ['unknown', 'green', 'green', 'red']; // missing data value placed upfront for ascending
          const sortByColumnField = 'status';
          const subjectColumnDefinition = untypedContext.columnsDefs.find(
            (col: ColumnDefinition<any>) => col.field === sortByColumnField
          );
          const subjectColumnIndex = untypedContext.columnsDefs.findIndex(
            (col: ColumnDefinition<any>) => col === subjectColumnDefinition
          );
          const gridHelper = new GridHelper(untypedContext.fixture.debugElement);

          // ascending sorted status column
          gridHelper.sortByColumnIndex(subjectColumnIndex);
          renderFixture(untypedContext.fixture);

          gridHelper.getRows().forEach((row: GridRowTestHelper, rowIndex: number) => {
            expect(row.getCellAt(subjectColumnIndex).getCellWrapperElement().textContent?.trim()).toEqual(
              states[rowIndex]
            );
          });

          // descending sorted status column
          vi.spyOn(subjectColumnDefinition.sortComparator, 'compare');
          gridHelper.sortByColumnIndex(subjectColumnIndex);
          renderFixture(untypedContext.fixture);

          gridHelper.getRows().forEach((row: GridRowTestHelper, rowIndex: number) => {
            expect(row.getCellAt(subjectColumnIndex).getCellWrapperElement().textContent?.trim()).toEqual(
              states[states.length - rowIndex - 1]
            );
          });
        });

        it('column sort order change is emitted when sort by column', () => {
          const untypedContext: any = testContext;

          const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
          vi.spyOn(untypedContext.component, 'columnSortOrderChange').mockImplementation(() => undefined);
          gridHelper.sortByColumn(untypedContext.columnsDefs[2].displayName);
          renderFixture(untypedContext.fixture);
          const expectedColumnSortOrdeChange: ColumnSortOrder = {
            sortOrder: ClrDatagridSortOrder.ASC,
            column: untypedContext.columnsDefs[2],
          };
          expect(untypedContext.component.columnSortOrderChange).toHaveBeenCalledWith(expectedColumnSortOrdeChange);
          expect(untypedContext.columnsDefs[2].defaultSortOrder).toEqual(ClrDatagridSortOrder.ASC);
          expect(untypedContext.columnsDefs[0].defaultSortOrder).toEqual(ClrDatagridSortOrder.UNSORTED);
          expect(untypedContext.columnsDefs[1].defaultSortOrder).toEqual(ClrDatagridSortOrder.UNSORTED);
        });
      });

      describe('WHEN sortAndFilterByField is passed to one of the columns', () => {
        beforeEach(() => {
          const untypedContext: any = testContext;

          untypedContext.columnsDefs = [
            {
              displayName: 'Name',
              field: 'name',
              width: 10 + 'px',
              sortAndFilterByField: 'name',
            },
            {
              displayName: 'State',
              field: 'powerState',
              width: 100 + 'px',
            },
            {
              displayName: 'Status',
              field: 'status',
            },
          ] as Array<ColumnDefinition<any>>;
          untypedContext.component.selectionType = SelectionType.Multi;
          untypedContext.component.columnsDefs = untypedContext.columnsDefs;
          untypedContext.component.data = untypedContext.data;

          renderFixture(untypedContext.fixture);
        });

        it('that column is sortable and others columns are not sortable', () => {
          const untypedContext: any = testContext;

          const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
          expect(gridHelper.isColumnSortable(untypedContext.columnsDefs[0].displayName)).toBeTruthy();
          expect(gridHelper.isColumnSortable(untypedContext.columnsDefs[1].displayName)).toBeFalsy();
          expect(gridHelper.isColumnSortable(untypedContext.columnsDefs[2].displayName)).toBeFalsy();
        });

        it('can sort the column alphabetically', () => {
          const untypedContext: any = testContext;

          const states: string[] = ['vm0', 'vm1', 'vm2', 'vm3'];
          const subjectColumnIndex = 0;
          const gridHelper = new GridHelper(untypedContext.fixture.debugElement);

          // ascending sorted status column
          gridHelper.sortByColumnIndex(subjectColumnIndex);
          renderFixture(untypedContext.fixture);

          gridHelper.getRows().forEach((row: GridRowTestHelper, rowIndex: number) => {
            expect(row.getCellAt(subjectColumnIndex).getCellWrapperElement().textContent?.trim()).toEqual(
              states[rowIndex]
            );
          });

          // descending sorted status column
          gridHelper.sortByColumnIndex(subjectColumnIndex);
          renderFixture(untypedContext.fixture);

          gridHelper.getRows().forEach((row: GridRowTestHelper, rowIndex: number) => {
            expect(row.getCellAt(subjectColumnIndex).getCellWrapperElement().textContent?.trim()).toEqual(
              states[states.length - rowIndex - 1]
            );
          });
        });

        it('column sort order change is emitted when sort by column', () => {
          const untypedContext: any = testContext;

          const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
          vi.spyOn(untypedContext.component, 'columnSortOrderChange').mockImplementation(() => undefined);
          gridHelper.sortByColumn(untypedContext.columnsDefs[0].displayName);
          renderFixture(untypedContext.fixture);
          const expectedColumnSortOrdeChange: ColumnSortOrder = {
            sortOrder: 1,
            column: untypedContext.columnsDefs[0],
          };
          expect(untypedContext.component.columnSortOrderChange).toHaveBeenCalledWith(expectedColumnSortOrdeChange);
        });
      });
    });

    describe('pinned columns', () => {
      // Keyed by column instead of by position: a pinned column is projected into the sticky
      // container, which comes before the scrollable one, so DOM order stops matching the order the
      // columns are defined in.
      function getDragDisabledByColumn(
        fixture: ComponentFixture<DatagridHostComponent>
      ): Record<string, boolean | undefined> {
        const disabledByColumn: Record<string, boolean | undefined> = {};

        fixture.debugElement.queryAll(By.directive(CdkDrag)).forEach((dragDebugEl: DebugElement) => {
          const cdkDrag = dragDebugEl.injector.get(CdkDrag);
          const column = cdkDrag.data as ColumnDefinition<any>;
          disabledByColumn[column.displayName] = cdkDrag.disabled;
        });

        return disabledByColumn;
      }

      beforeEach(() => {
        testContext.component.data = testContext.data;
      });

      it('keeps every column draggable when none is pinned', () => {
        testContext.component.columnsDefs = testContext.columnsDefs;
        renderFixture(testContext.fixture);

        expect(getDragDisabledByColumn(testContext.fixture)).toEqual({ Name: false, State: false, Status: false });
      });

      // A pinned column is rendered in the sticky container, outside the group the reorder addon
      // drags within, so it must not be a drag source.
      it('turns off dragging for a pinned column only', () => {
        testContext.columnsDefs[1].pinned = true;
        testContext.component.columnsDefs = [...testContext.columnsDefs];
        renderFixture(testContext.fixture);

        expect(getDragDisabledByColumn(testContext.fixture)).toEqual({ Name: false, State: true, Status: false });
      });

      it('makes the column draggable again once it is unpinned', () => {
        testContext.columnsDefs[1].pinned = true;
        testContext.component.columnsDefs = [...testContext.columnsDefs];
        renderFixture(testContext.fixture);
        expect(getDragDisabledByColumn(testContext.fixture)).toEqual({ Name: false, State: true, Status: false });

        testContext.columnsDefs[1].pinned = false;
        testContext.component.columnsDefs = [...testContext.columnsDefs];
        renderFixture(testContext.fixture);

        expect(getDragDisabledByColumn(testContext.fixture)).toEqual({ Name: false, State: false, Status: false });
      });
    });

    describe('enableColumnActions', () => {
      beforeEach(() => {
        testContext.component.data = testContext.data;
        testContext.component.columnsDefs = testContext.columnsDefs;
      });

      it('renders no column actions menu by default', () => {
        renderFixture(testContext.fixture);

        expect(testContext.fixture.debugElement.queryAll(By.css('.datagrid-column-actions-toggle')).length).toBe(0);
      });

      it('renders one menu per column once it is turned on', () => {
        testContext.component.enableColumnActions = true;
        renderFixture(testContext.fixture);

        expect(testContext.fixture.debugElement.queryAll(By.css('.datagrid-column-actions-toggle')).length).toBe(
          testContext.columnsDefs.length
        );
      });

      // The divider in front of the move actions only belongs there when the menu rendered something
      // above it. A filter does not: it keeps its toggle in the header, and the menu drops its filter
      // action in exchange - so a column that only has a filter used to open on a separator.
      describe('divider in front of the move actions', () => {
        // The menu is rendered into a CDK overlay attached to document.body, outside the fixture, so
        // it has to be read through plain document queries once it is open.
        function menuRoles(fixture: ComponentFixture<DatagridHostComponent>): string[] {
          fixture.debugElement.query(By.css('.datagrid-column-actions-toggle')).nativeElement.click();
          renderFixture(fixture);

          const roles = Array.from(document.querySelector('.dropdown-menu').children).map(item =>
            item.getAttribute('role')
          );

          fixture.debugElement.query(By.css('.datagrid-column-actions-toggle')).nativeElement.click();
          renderFixture(fixture);

          return roles;
        }

        function openMenuFor(context: DatagridSpecContext, column: ColumnDefinition<any>): string[] {
          context.component.enableColumnActions = true;
          context.component.columnsDefs = [column];
          renderFixture(context.fixture);

          return menuRoles(context.fixture);
        }

        it('is left out on a column that only has a filter', () => {
          const roles = openMenuFor(testContext, {
            displayName: 'Only filter',
            field: 'name',
            stringFilter: { accepts: () => true },
          } as ColumnDefinition<any>);

          expect(roles).toEqual(['menuitem', 'menuitem']);
        });

        it('separates the sort actions from the move actions', () => {
          const roles = openMenuFor(testContext, {
            displayName: 'Sortable',
            sortAndFilterByField: 'name',
          } as ColumnDefinition<any>);

          expect(roles).toEqual(['menuitemradio', 'menuitemradio', 'separator', 'menuitem', 'menuitem']);
        });

        it('separates the pin action from the move actions', () => {
          const roles = openMenuFor(testContext, {
            displayName: 'Pinnable',
            field: 'name',
            pinnable: true,
          } as ColumnDefinition<any>);

          expect(roles).toEqual(['menuitem', 'separator', 'menuitem', 'menuitem']);
        });
      });
    });

    describe('pin toggle in the column actions menu', () => {
      // The menu is rendered into a CDK overlay attached to document.body, outside the fixture's own
      // DOM subtree, so it has to be read through plain document queries once it is open.
      function toggleMenu(fixture: ComponentFixture<DatagridHostComponent>, columnIndex: number) {
        fixture.debugElement.queryAll(By.css('.datagrid-column-actions-toggle'))[columnIndex].nativeElement.click();
        renderFixture(fixture);
      }

      function menuItem(label: string): HTMLElement {
        return Array.from(document.querySelectorAll<HTMLElement>('.dropdown-menu .dropdown-item')).find(
          item => item.textContent.trim() === label
        );
      }

      beforeEach(() => {
        testContext.component.data = testContext.data;
        // The menu is opt-in, so it has to be switched on for these tests.
        testContext.component.enableColumnActions = true;
        testContext.columnsDefs[1].pinnable = true;
        testContext.component.columnsDefs = testContext.columnsDefs;
        renderFixture(testContext.fixture);
      });

      it('offers Pin Column only on a column marked pinnable', () => {
        toggleMenu(testContext.fixture, 0);
        expect(menuItem('Pin Column')).toBeUndefined();
        toggleMenu(testContext.fixture, 0);

        toggleMenu(testContext.fixture, 1);
        expect(menuItem('Pin Column')).not.toBeUndefined();
      });

      it('pins the column and reports it through columnPinnedChange', () => {
        vi.spyOn(testContext.component, 'columnPinnedChange').mockImplementation(() => undefined);

        toggleMenu(testContext.fixture, 1);
        menuItem('Pin Column').click();
        renderFixture(testContext.fixture);

        expect(testContext.columnsDefs[1].pinned).toBe(true);
        expect(testContext.component.columnPinnedChange).toHaveBeenCalledWith({
          pinned: true,
          column: testContext.columnsDefs[1],
        });
      });

      it('unpins the column once it is pinned', () => {
        toggleMenu(testContext.fixture, 1);
        menuItem('Pin Column').click();
        renderFixture(testContext.fixture);
        expect(testContext.columnsDefs[1].pinned).toBe(true);

        // The menu stays open after Pin Column is clicked ([clrCloseMenuOnItemClick]="false"), and
        // its label is reactive to the pinned state, so the same still-open menu now offers Unpin
        // Column - no need to close and reopen anything.
        menuItem('Unpin Column').click();
        renderFixture(testContext.fixture);

        expect(testContext.columnsDefs[1].pinned).toBe(false);
      });
    });

    describe('custom column actions', () => {
      function toggleMenu(fixture: ComponentFixture<DatagridHostComponent>, columnIndex: number) {
        fixture.debugElement.queryAll(By.css('.datagrid-column-actions-toggle'))[columnIndex].nativeElement.click();
        renderFixture(fixture);
      }

      function menuItemLabels(): string[] {
        return Array.from(document.querySelectorAll<HTMLElement>('.dropdown-menu .dropdown-item')).map(item =>
          item.textContent.trim()
        );
      }

      function menuItem(label: string): HTMLElement {
        return Array.from(document.querySelectorAll<HTMLElement>('.dropdown-menu .dropdown-item')).find(
          item => item.textContent.trim() === label
        );
      }

      beforeEach(() => {
        testContext.component.data = testContext.data;
        testContext.component.enableColumnActions = true;
        testContext.component.columnActions = [
          // 'angle' rather than something like 'copy' because cds-icon rewrites the shape of an icon
          // that is not registered to 'unknown', and this asserts the binding, not the icon registry.
          // An application does have to register whatever shape it names here.
          { id: 'copy', label: 'Copy values', enabled: true, icon: 'angle' },
          { id: 'about', label: 'About column', enabled: false },
        ];
        testContext.columnsDefs[1].actions = [{ id: 'reset', label: 'Reset State', enabled: true }];
        testContext.component.columnsDefs = testContext.columnsDefs;
        renderFixture(testContext.fixture);
      });

      it('offers the grid actions on every column, after the built-in ones', () => {
        toggleMenu(testContext.fixture, 0);
        const labels = menuItemLabels();

        expect(labels).toContain('Copy values');
        expect(labels).toContain('About column');
        // Last, so the built-in items keep the same place in every menu.
        expect(labels.indexOf('Copy values')).toBeGreaterThan(labels.indexOf('Move Right'));
      });

      it('appends the actions of a single column after the grid ones', () => {
        toggleMenu(testContext.fixture, 0);
        expect(menuItemLabels()).not.toContain('Reset State');
        toggleMenu(testContext.fixture, 0);

        toggleMenu(testContext.fixture, 1);
        const labels = menuItemLabels();
        expect(labels).toContain('Reset State');
        expect(labels.indexOf('Reset State')).toBeGreaterThan(labels.indexOf('About column'));
      });

      it('reports a click through actionClick with the column as context', () => {
        const received: ActionClickEvent[] = [];
        testContext.component.appfxDatagridComponent.actionClick.subscribe((event: ActionClickEvent) =>
          received.push(event)
        );

        toggleMenu(testContext.fixture, 1);
        menuItem('Reset State').click();
        renderFixture(testContext.fixture);

        expect(received.length).toBe(1);
        expect(received[0].action.id).toBe('reset');
        expect(received[0].context).toBe(testContext.columnsDefs[1]);
      });

      it('does not report a disabled action', () => {
        const received: ActionClickEvent[] = [];
        testContext.component.appfxDatagridComponent.actionClick.subscribe((event: ActionClickEvent) =>
          received.push(event)
        );

        toggleMenu(testContext.fixture, 0);
        expect(menuItem('About column').getAttribute('aria-disabled')).toBe('true');
        menuItem('About column').click();
        renderFixture(testContext.fixture);

        expect(received).toEqual([]);
      });

      it('leads an action with its icon when one is given', () => {
        toggleMenu(testContext.fixture, 0);

        expect(menuItem('Copy values').querySelector('cds-icon')?.getAttribute('shape')).toBe('angle');
        expect(menuItem('About column').querySelector('cds-icon')).toBeNull();
      });

      // Bound through [attr.title], so an action without a tooltip gets no title at all rather than
      // title="undefined", which would be shown on hover and could be read out as its description.
      it('only sets a title on an action that has a tooltip', () => {
        testContext.component.columnActions = [
          { id: 'copy', label: 'Copy values', enabled: true, tooltip: 'Copies the column values' },
          { id: 'about', label: 'About column', enabled: true },
        ];
        renderFixture(testContext.fixture);

        toggleMenu(testContext.fixture, 0);

        expect(menuItem('Copy values').getAttribute('title')).toBe('Copies the column values');
        expect(menuItem('About column').hasAttribute('title')).toBe(false);
      });

      // The grid-wide and per-column lists are merged, so the same id can come from both. The actions
      // are tracked by identity, not by id, so that neither drops one of them nor warns about it.
      it('renders a column action that reuses the id of a grid action', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        testContext.columnsDefs[1].actions = [{ id: 'copy', label: 'Copy state', enabled: true }];
        renderFixture(testContext.fixture);

        toggleMenu(testContext.fixture, 1);

        const labels = menuItemLabels();
        expect(labels).toContain('Copy values');
        expect(labels).toContain('Copy state');
        expect(vi.mocked(warn).mock.calls.some(args => String(args[0]).includes('NG0955'))).toBe(false);
      });

      // Custom actions leave clrCanClosePopover at its default, so unlike the move actions, which are
      // meant to be repeated, they close the menu once picked.
      it('closes the menu after an action is clicked', () => {
        toggleMenu(testContext.fixture, 1);
        menuItem('Reset State').click();
        renderFixture(testContext.fixture);

        const trigger = testContext.fixture.debugElement.queryAll(By.css('.datagrid-column-actions-toggle'))[1]
          .nativeElement;
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        expect(menuItem('Reset State')).toBeUndefined();
      });

      describe('with children', () => {
        beforeEach(() => {
          testContext.columnsDefs[1].actions = [
            {
              id: 'more',
              label: 'More',
              enabled: true,
              children: [
                { id: 'child', label: 'Child action', enabled: true },
                { id: 'disabled-child', label: 'Disabled child', enabled: false },
              ],
            },
          ];
          renderFixture(testContext.fixture);
        });

        it('opens the children as a nested menu', () => {
          toggleMenu(testContext.fixture, 1);
          expect(menuItemLabels()).not.toContain('Child action');

          menuItem('More').click();
          renderFixture(testContext.fixture);

          expect(menuItem('More').getAttribute('aria-haspopup')).toBe('menu');
          expect(menuItem('More').getAttribute('aria-expanded')).toBe('true');
          expect(menuItemLabels()).toContain('Child action');
        });

        it('reports a child through actionClick, not the parent', () => {
          const received: ActionClickEvent[] = [];
          testContext.component.appfxDatagridComponent.actionClick.subscribe((event: ActionClickEvent) =>
            received.push(event)
          );

          toggleMenu(testContext.fixture, 1);
          menuItem('More').click();
          renderFixture(testContext.fixture);
          expect(received).toEqual([]);

          menuItem('Child action').click();
          renderFixture(testContext.fixture);

          expect(received.length).toBe(1);
          expect(received[0].action.id).toBe('child');
          expect(received[0].context).toBe(testContext.columnsDefs[1]);
        });

        it('reaches the action with children by the arrow keys', async () => {
          const settle = async () => {
            renderFixture(testContext.fixture);
            // The menu moves focus to its first item from a timeout of its own.
            await new Promise(resolve => setTimeout(resolve));
            renderFixture(testContext.fixture);
          };
          const focusedLabel = () => (document.activeElement as HTMLElement)?.textContent.trim();

          const trigger = testContext.fixture.debugElement.queryAll(By.css('.datagrid-column-actions-toggle'))[1]
            .nativeElement;
          trigger.focus();
          trigger.click();
          await settle();

          const order = [focusedLabel()];
          for (let i = 0; i < 5; i++) {
            document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            await settle();
            order.push(focusedLabel());
          }

          expect(order).toEqual(['Move Left', 'Move Right', 'Copy values', 'About column', 'More', 'Move Left']);
        });

        it('does not report a disabled child', () => {
          const received: ActionClickEvent[] = [];
          testContext.component.appfxDatagridComponent.actionClick.subscribe((event: ActionClickEvent) =>
            received.push(event)
          );

          toggleMenu(testContext.fixture, 1);
          menuItem('More').click();
          renderFixture(testContext.fixture);
          expect(menuItem('Disabled child').getAttribute('aria-disabled')).toBe('true');
          menuItem('Disabled child').click();
          renderFixture(testContext.fixture);

          expect(received).toEqual([]);
        });
      });

      it('adds nothing to the menu when no actions are configured', () => {
        testContext.component.columnActions = null;
        testContext.columnsDefs[1].actions = undefined;
        renderFixture(testContext.fixture);

        toggleMenu(testContext.fixture, 1);
        const labels = menuItemLabels();
        expect(labels).not.toContain('Copy values');
        expect(labels).not.toContain('Reset State');
        expect(document.querySelectorAll('.dropdown-menu .dropdown-divider').length).toBe(0);
      });
    });

    // The menu survives the move along with the column it belongs to. It used to be left anchored to
    // where the trigger was before the move, which is what clrCanClosePopover fixes.
    describe('column moves without pinned columns', () => {
      function toggleMenu(fixture: ComponentFixture<DatagridHostComponent>, columnIndex: number) {
        fixture.debugElement.queryAll(By.css('.datagrid-column-actions-toggle'))[columnIndex].nativeElement.click();
        renderFixture(fixture);
      }

      function moveButton(label: string): HTMLElement {
        return Array.from(document.querySelectorAll<HTMLElement>('.dropdown-menu .dropdown-item')).find(
          item => item.textContent.trim() === label
        );
      }

      beforeEach(() => {
        testContext.component.data = testContext.data;
        testContext.component.enableColumnActions = true;
        testContext.component.columnsDefs = testContext.columnsDefs;
        renderFixture(testContext.fixture);
      });

      it('re-anchors the menu to the moved column instead of closing it', () => {
        expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['Name', 'State', 'Status']);

        const columnActions = testContext.fixture.debugElement.queryAll(By.directive(ClrDatagridColumnActions))[0]
          .componentInstance as ClrDatagridColumnActions;
        const repositionMenu = vi.spyOn(columnActions, 'repositionMenu');

        toggleMenu(testContext.fixture, 0);
        expect(document.querySelectorAll('.dropdown-menu').length).toBe(1);

        moveButton('Move Right').click();
        renderFixture(testContext.fixture);

        expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['State', 'Name', 'Status']);
        // Still open, and re-anchored rather than left where the trigger used to be, so the next step
        // can be taken without reopening it.
        expect(document.querySelectorAll('.dropdown-menu').length).toBe(1);
        expect(repositionMenu).toHaveBeenCalled();
      });

      it('keeps the menu usable for a second step', () => {
        toggleMenu(testContext.fixture, 0);
        moveButton('Move Right').click();
        renderFixture(testContext.fixture);

        moveButton('Move Right').click();
        renderFixture(testContext.fixture);

        expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['State', 'Status', 'Name']);
      });
    });

    // Five columns with the first and the third pinned, so the array order and the rendered order do
    // not agree: the pinned pair is rendered in the sticky container ahead of the rest. The loose
    // columns move among themselves the same as without a pinned column, and the pinned ones are not
    // moved at all - see DatagridColumnsOrderDirective.
    describe('column moves with pinned columns', () => {
      function toggleMenu(fixture: ComponentFixture<DatagridHostComponent>, columnIndex: number) {
        fixture.debugElement.queryAll(By.css('.datagrid-column-actions-toggle'))[columnIndex].nativeElement.click();
        renderFixture(fixture);
      }

      function moveButton(label: string): HTMLElement {
        return Array.from(document.querySelectorAll<HTMLElement>('.dropdown-menu .dropdown-item')).find(
          item => item.textContent.trim() === label
        );
      }

      // A move leaves the menu open on the moved column, so it is closed from there afterwards.
      function clickMove(fixture: ComponentFixture<DatagridHostComponent>, columnIndex: number, label: string) {
        toggleMenu(fixture, columnIndex);
        moveButton(label).click();
        renderFixture(fixture);
        fixture.debugElement
          .query(By.css('.datagrid-column-actions-toggle[aria-expanded="true"]'))
          ?.nativeElement.click();
        renderFixture(fixture);
      }

      function disabledStateOf(fixture: ComponentFixture<DatagridHostComponent>, columnIndex: number) {
        toggleMenu(fixture, columnIndex);
        const state = {
          left: moveButton('Move Left').getAttribute('aria-disabled'),
          right: moveButton('Move Right').getAttribute('aria-disabled'),
        };
        toggleMenu(fixture, columnIndex);
        return state;
      }

      beforeEach(() => {
        testContext.component.data = testContext.data;
        testContext.component.enableColumnActions = true;
        testContext.component.columnsDefs = [
          { displayName: 'C1', field: 'name', pinnable: true, pinned: true },
          { displayName: 'C2', field: 'powerState', pinnable: true },
          { displayName: 'C3', field: 'status', pinnable: true, pinned: true },
          { displayName: 'C4', field: 'host', sortAndFilterByField: 'host', pinnable: true },
          { displayName: 'C5', field: 'extra', pinnable: true },
        ] as Array<ColumnDefinition<any>>;
        renderFixture(testContext.fixture);
      });

      function columnByField(fixture: ComponentFixture<DatagridHostComponent>, field: string) {
        return fixture.debugElement
          .queryAll(By.directive(ClrDatagridColumn))
          .map((columnDebugEl: DebugElement) => columnDebugEl.componentInstance)
          .find(column => column.field === field);
      }

      it('renders the pinned columns ahead of the rest', () => {
        expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['C1', 'C3', 'C2', 'C4', 'C5']);
      });

      // A loose column steps within the scrollable group, so only its real edges are disabled. The
      // regression was that C2 had both directions disabled and C4 had Move Left disabled, because
      // any move spanning a pinned column was refused. A pinned column cannot be moved at all.
      it('disables both moves on a pinned column, and only the edges on a loose one', () => {
        // Sticky container: C1 C3.
        expect(disabledStateOf(testContext.fixture, 0)).toEqual({ left: 'true', right: 'true' });
        expect(disabledStateOf(testContext.fixture, 1)).toEqual({ left: 'true', right: 'true' });
        // Scrollable container: C2 C4 C5.
        expect(disabledStateOf(testContext.fixture, 2)).toEqual({ left: 'true', right: 'false' });
        expect(disabledStateOf(testContext.fixture, 3)).toEqual({ left: 'false', right: 'false' });
        expect(disabledStateOf(testContext.fixture, 4)).toEqual({ left: 'false', right: 'true' });
      });

      it('steps the first loose column past the next one', () => {
        clickMove(testContext.fixture, 2, 'Move Right');

        expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['C1', 'C3', 'C4', 'C2', 'C5']);
      });

      // The last loose column used to be movable left exactly once, because the second step would
      // have spanned the pinned column sitting between the two loose ones in the array.
      it('walks the last loose column across its whole group', () => {
        clickMove(testContext.fixture, 4, 'Move Left');
        expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['C1', 'C3', 'C2', 'C5', 'C4']);

        clickMove(testContext.fixture, 3, 'Move Left');
        expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['C1', 'C3', 'C5', 'C2', 'C4']);
      });

      // The menu item is only marked disabled, not natively disabled, so it still receives the click -
      // which must not move the column either.
      it('does not move a pinned column when its move action is clicked anyway', () => {
        vi.spyOn(testContext.component, 'onColumnOrderChange').mockImplementation(() => undefined);

        clickMove(testContext.fixture, 0, 'Move Right');

        expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['C1', 'C3', 'C2', 'C4', 'C5']);
        expect(testContext.component.onColumnOrderChange).not.toHaveBeenCalled();
      });

      // The column views are moved rather than recreated, so what the user set on a column stays on it.
      it('keeps an active sort when a column is moved', () => {
        columnByField(testContext.fixture, 'host').sort();
        renderFixture(testContext.fixture);
        expect(columnByField(testContext.fixture, 'host').sortOrder).toBe(ClrDatagridSortOrder.ASC);

        clickMove(testContext.fixture, 2, 'Move Right');

        expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['C1', 'C3', 'C4', 'C2', 'C5']);
        expect(columnByField(testContext.fixture, 'host').sortOrder).toBe(ClrDatagridSortOrder.ASC);
      });

      function columnElementByTitle(fixture: ComponentFixture<DatagridHostComponent>, title: string): HTMLElement {
        return Array.from(fixture.debugElement.nativeElement.querySelectorAll('clr-dg-column')).find(
          (el: HTMLElement) => el.querySelector('.datagrid-column-title')?.textContent.trim() === title
        ) as HTMLElement;
      }

      // Drives a real resize through the column separator's keyboard shortcut, the same as
      // core's own arrow-key resizing - core only reports a resize once it is actually applied
      // (on keyup), not while it is only being calculated, so a synthetic width can't be
      // substituted for it.
      function resizeColumnByKeyboard(fixture: ComponentFixture<DatagridHostComponent>, title: string, by: number) {
        const handle = columnElementByTitle(fixture, title).querySelector<HTMLElement>('.datagrid-column-handle');
        const key = by > 0 ? 'ArrowRight' : 'ArrowLeft';
        handle.dispatchEvent(new KeyboardEvent('keydown', { key: key, bubbles: true }));
        handle.dispatchEvent(new KeyboardEvent('keyup', { key: key, bubbles: true }));
        renderFixture(fixture);
      }

      // Reproduced with a real keyboard resize rather than calling onColumnResize directly, since that
      // only reports a width - it does not drive one.
      it('keeps a resized width when a column is moved', () => {
        resizeColumnByKeyboard(testContext.fixture, 'C2', 1);
        const resizedWidth = columnElementByTitle(testContext.fixture, 'C2').style.width;
        expect(resizedWidth).not.toBe('');

        clickMove(testContext.fixture, 4, 'Move Left'); // moves C5, unrelated to C2

        expect(columnElementByTitle(testContext.fixture, 'C2').style.width).toBe(resizedWidth);
      });

      // The same through the drag and drop path instead of the column actions menu.
      it('keeps a resized width when a column is reordered by drag and drop', () => {
        resizeColumnByKeyboard(testContext.fixture, 'C2', 1);
        const resizedWidth = columnElementByTitle(testContext.fixture, 'C2').style.width;
        expect(resizedWidth).not.toBe('');

        // Drags the loose C4 onto the loose C5's slot - same group, so the drop is not refused.
        const cdkDropList = testContext.fixture.debugElement.query(By.directive(CdkDropList)).injector.get(CdkDropList);
        const targetIndex = cdkDropList
          .getSortedItems()
          .findIndex((item: any) => item.data === testContext.component.columnsDefs[4]);
        // CdkDragDrop is a large interface meant for a real drag - cast rather than fill in the rest
        // of it, matching how the plain drag and drop reorder tests above work around the same gap.
        const droppedData = {
          item: { data: testContext.component.columnsDefs[3] },
          currentIndex: targetIndex,
        } as any;
        cdkDropList.dropped.next(droppedData);
        renderFixture(testContext.fixture);

        expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['C1', 'C3', 'C2', 'C5', 'C4']);
        expect(columnElementByTitle(testContext.fixture, 'C2').style.width).toBe(resizedWidth);
      });

      it('never moves a column out of its own container', () => {
        const pinnedHeaders = () =>
          Array.from(
            testContext.fixture.nativeElement.querySelectorAll(
              '.datagrid-pinned-cells clr-dg-column .datagrid-column-title'
            )
          ).map((element: HTMLElement) => element.textContent.trim());

        expect(pinnedHeaders()).toEqual(['C1', 'C3']);

        clickMove(testContext.fixture, 2, 'Move Right');
        clickMove(testContext.fixture, 3, 'Move Right');

        expect(pinnedHeaders()).toEqual(['C1', 'C3']);
        expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['C1', 'C3', 'C4', 'C5', 'C2']);
      });
    });

    // A hidden column is left out of visibleColumns, so a pinned-and-hidden one is rendered in
    // neither container and the loose columns step past it.
    describe('column moves with a pinned column that is hidden', () => {
      function toggleMenu(fixture: ComponentFixture<DatagridHostComponent>, columnIndex: number) {
        fixture.debugElement.queryAll(By.css('.datagrid-column-actions-toggle'))[columnIndex].nativeElement.click();
        renderFixture(fixture);
      }

      function moveButton(label: string): HTMLElement {
        return Array.from(document.querySelectorAll<HTMLElement>('.dropdown-menu .dropdown-item')).find(
          item => item.textContent.trim() === label
        );
      }

      beforeEach(() => {
        testContext.component.data = testContext.data;
        testContext.component.enableColumnActions = true;
        // Bound as a new array with hidden already set - mutating hidden on an already-bound
        // definition does not recompute visibleColumns, and the column then stays rendered.
        testContext.component.columnsDefs = [
          { displayName: 'C1', field: 'name', pinnable: true, pinned: true, hidden: true },
          { displayName: 'C2', field: 'powerState' },
          { displayName: 'C3', field: 'status' },
        ] as Array<ColumnDefinition<any>>;
        renderFixture(testContext.fixture);
      });

      it('moves the loose columns past it', () => {
        toggleMenu(testContext.fixture, 0);
        moveButton('Move Right').click();
        renderFixture(testContext.fixture);

        expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['C3', 'C2']);
      });
    });

    // Clarity moves the cells of a pinned column into the row's pinned container, out of the parent the
    // cells are projected into. A cell that the @for creates in front of one of them therefore cannot be
    // inserted, which is what showing a column or replacing the definitions used to run into.
    describe('showing columns while a column is pinned', () => {
      function setHidden(fixture: ComponentFixture<DatagridHostComponent>, title: string, hidden: boolean) {
        const toggle = fixture.debugElement.query(By.directive(DatagridColumnToggleComponent))
          .componentInstance as DatagridColumnToggleComponent;
        const column = toggle.columns.find(other => other.displayName === title);
        toggle.toggleColumnState(column, { target: { checked: !hidden } } as unknown as Event);
        renderFixture(fixture);
      }

      function pinnedHeaders(fixture: ComponentFixture<DatagridHostComponent>): string[] {
        return Array.from(
          fixture.nativeElement.querySelectorAll('.datagrid-pinned-cells clr-dg-column .datagrid-column-title')
        ).map((element: HTMLElement) => element.textContent.trim());
      }

      function columnElementByTitle(fixture: ComponentFixture<DatagridHostComponent>, title: string): HTMLElement {
        return Array.from(fixture.nativeElement.querySelectorAll('clr-dg-column')).find(
          (el: HTMLElement) => el.querySelector('.datagrid-column-title')?.textContent.trim() === title
        ) as HTMLElement;
      }

      function render(context: DatagridSpecContext, columns: Array<ColumnDefinition<any>>) {
        context.component.data = context.data;
        context.component.enableColumnActions = true;
        context.component.columnsDefs = columns;
        renderFixture(context.fixture);
      }

      describe('with two pinned columns', () => {
        beforeEach(() => {
          render(testContext, [
            { displayName: 'C1', field: 'name', pinnable: true, pinned: true },
            { displayName: 'C2', field: 'powerState', pinnable: true, pinned: true },
            { displayName: 'C3', field: 'status', pinnable: true },
            { displayName: 'C4', field: 'host', pinnable: true },
          ] as Array<ColumnDefinition<any>>);
        });

        it('shows a pinned column again in front of the other one', () => {
          setHidden(testContext.fixture, 'C1', true);
          setHidden(testContext.fixture, 'C1', false);

          expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['C1', 'C2', 'C3', 'C4']);
          expect(pinnedHeaders(testContext.fixture)).toEqual(['C1', 'C2']);
        });

        it('shows both pinned columns again, the second one first', () => {
          setHidden(testContext.fixture, 'C1', true);
          setHidden(testContext.fixture, 'C2', true);
          setHidden(testContext.fixture, 'C2', false);
          setHidden(testContext.fixture, 'C1', false);

          expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['C1', 'C2', 'C3', 'C4']);
          expect(pinnedHeaders(testContext.fixture)).toEqual(['C1', 'C2']);
        });

        it('renders the same columns passed in as new definitions', () => {
          testContext.component.columnsDefs = testContext.component.columnsDefs.map(column => ({ ...column }));
          renderFixture(testContext.fixture);

          expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['C1', 'C2', 'C3', 'C4']);
          expect(pinnedHeaders(testContext.fixture)).toEqual(['C1', 'C2']);
        });

        // Only a column that is not rendered yet needs the rebuild. A move or a hide keeps the other
        // column views, so the actions menu stays open and anchored on a move.
        it('does not rebuild the column views for a move or a hide', () => {
          const rebuildColumnViews = vi.spyOn<any, any>(
            testContext.component.appfxDatagridComponent,
            'rebuildColumnViews'
          );

          testContext.fixture.debugElement.queryAll(By.css('.datagrid-column-actions-toggle'))[2].nativeElement.click();
          renderFixture(testContext.fixture);
          Array.from(document.querySelectorAll<HTMLElement>('.dropdown-menu .dropdown-item'))
            .find(item => item.textContent.trim() === 'Move Right')
            .click();
          renderFixture(testContext.fixture);
          setHidden(testContext.fixture, 'C3', true);

          expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['C1', 'C2', 'C4']);
          expect(rebuildColumnViews).not.toHaveBeenCalled();
        });
      });

      it('shows a loose column again in front of a pinned one', () => {
        render(testContext, [
          { displayName: 'C1', field: 'name', pinnable: true },
          { displayName: 'C2', field: 'powerState', pinnable: true, pinned: true },
          { displayName: 'C3', field: 'status', pinnable: true },
        ] as Array<ColumnDefinition<any>>);

        setHidden(testContext.fixture, 'C1', true);
        setHidden(testContext.fixture, 'C1', false);

        expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['C2', 'C1', 'C3']);
      });

      // Showing a column rebuilds every column view, so the state of the others has to come back from
      // their definitions.
      describe('keeps the state of the other columns', () => {
        beforeEach(() => {
          render(testContext, [
            { displayName: 'Status', field: 'status', pinnable: true, pinned: true },
            { displayName: 'Name', field: 'name', sortAndFilterByField: 'name' },
            { displayName: 'State', field: 'powerState' },
          ] as Array<ColumnDefinition<any>>);
        });

        it('keeps an applied filter', () => {
          setHidden(testContext.fixture, 'State', true);
          const gridHelper = new GridHelper(testContext.fixture.debugElement);
          gridHelper.openFilter('Name');
          renderFixture(testContext.fixture);
          gridHelper.getFilterInput().inputText('vm2', 'keyup');
          renderFixture(testContext.fixture);
          gridHelper.closeFilter();
          renderFixture(testContext.fixture);
          expect(new GridHelper(testContext.fixture.debugElement).getRows().length).toBe(1);

          setHidden(testContext.fixture, 'State', false);

          expect(new GridHelper(testContext.fixture.debugElement).getRows().length).toBe(1);
        });

        it('omits the resize handle from the last scrollable column', () => {
          setHidden(testContext.fixture, 'State', true);
          expect(columnElementByTitle(testContext.fixture, 'Name').querySelector('.datagrid-column-handle')).toBeNull();
          setHidden(testContext.fixture, 'State', false);
          expect(
            columnElementByTitle(testContext.fixture, 'Name').querySelector('.datagrid-column-handle')
          ).not.toBeNull();
        });

        // Reproduced with a real keyboard resize, since calling onColumnResize only reports a width.
        it('keeps a resized width', () => {
          const handle = columnElementByTitle(testContext.fixture, 'Name').querySelector<HTMLElement>(
            '.datagrid-column-handle'
          );
          handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
          handle.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight', bubbles: true }));
          renderFixture(testContext.fixture);
          const resizedWidth = columnElementByTitle(testContext.fixture, 'Name').style.width;
          expect(resizedWidth).not.toBe('');

          // Resize while Name has a following scrollable column, then rebuild the views.
          setHidden(testContext.fixture, 'State', true);
          setHidden(testContext.fixture, 'State', false);

          expect(columnElementByTitle(testContext.fixture, 'Name').style.width).toBe(resizedWidth);
        });
      });
    });

    describe('disableUnsort', () => {
      function getColumnDisableUnsort(fixture: ComponentFixture<DatagridHostComponent>): boolean[] {
        return fixture.debugElement
          .queryAll(By.directive(ClrDatagridColumn))
          .map((columnDebugEl: DebugElement) => columnDebugEl.componentInstance.disableUnsort);
      }

      beforeEach(() => {
        testContext.component.columnsDefs = testContext.columnsDefs;
        testContext.component.data = testContext.data;
      });

      it('disables unsort for every column by default', () => {
        renderFixture(testContext.fixture);
        expect(testContext.component.appfxDatagridComponent.disableUnsort).toBe(true);
        expect(getColumnDisableUnsort(testContext.fixture)).toEqual([true, true, true]);
      });

      it('enables unsort for every column when the grid input is false', () => {
        testContext.component.disableUnsort = false;
        renderFixture(testContext.fixture);
        expect(getColumnDisableUnsort(testContext.fixture)).toEqual([false, false, false]);
      });

      it('lets a column re-enable unsort when the grid disables it', () => {
        testContext.component.disableUnsort = true;
        testContext.columnsDefs[2].disableUnsort = false;
        testContext.component.columnsDefs = [...testContext.columnsDefs];
        renderFixture(testContext.fixture);
        expect(getColumnDisableUnsort(testContext.fixture)).toEqual([true, true, false]);
      });

      it('lets a column disable unsort when the grid enables it', () => {
        testContext.component.disableUnsort = false;
        testContext.columnsDefs[2].disableUnsort = true;
        testContext.component.columnsDefs = [...testContext.columnsDefs];
        renderFixture(testContext.fixture);
        expect(getColumnDisableUnsort(testContext.fixture)).toEqual([false, false, true]);
      });

      it('keeps a sorted column sorted on the third click when unsort is disabled', () => {
        const sortableColumnIndex = 2; // "Status" column defines a sortComparator
        testContext.component.disableUnsort = true;
        renderFixture(testContext.fixture);
        const gridHelper = new GridHelper(testContext.fixture.debugElement);

        gridHelper.sortByColumnIndex(sortableColumnIndex); // ascending
        gridHelper.sortByColumnIndex(sortableColumnIndex); // descending
        gridHelper.sortByColumnIndex(sortableColumnIndex); // back to ascending (never unsorted)
        renderFixture(testContext.fixture);

        expect(testContext.columnsDefs[sortableColumnIndex].defaultSortOrder).toEqual(ClrDatagridSortOrder.ASC);
      });

      it('returns a sorted column to unsorted on the third click when unsort is enabled', () => {
        const sortableColumnIndex = 2; // "Status" column defines a sortComparator
        testContext.component.disableUnsort = false;
        renderFixture(testContext.fixture);
        const gridHelper = new GridHelper(testContext.fixture.debugElement);

        gridHelper.sortByColumnIndex(sortableColumnIndex); // ascending
        gridHelper.sortByColumnIndex(sortableColumnIndex); // descending
        gridHelper.sortByColumnIndex(sortableColumnIndex); // unsorted
        renderFixture(testContext.fixture);

        expect(testContext.columnsDefs[sortableColumnIndex].defaultSortOrder).toEqual(ClrDatagridSortOrder.UNSORTED);
      });
    });

    describe('hide', () => {
      beforeEach(() => {
        const untypedContext: any = testContext;

        untypedContext.columnsDefs = [
          {
            displayName: 'Name',
            field: 'name',
            stringFilter: new NameFilter(),
            hideable: false,
          },
          {
            displayName: 'State',
            field: 'powerState',
          },
          {
            displayName: 'Host',
            field: 'host',
            hidden: true,
          },
          {
            displayName: 'Status',
            field: 'status',
            columnRenderer: StatusRendererComponent,
            filter: PowerStateFilterComponent,
          },
        ];
        untypedContext.component.columnsDefs = untypedContext.columnsDefs;
        untypedContext.component.data = untypedContext.data;
        renderFixture(untypedContext.fixture);
        renderFixture(untypedContext.fixture);
        untypedContext.hiddenColumns = () => {
          return untypedContext.component.appfxDatagridComponent.columns
            .filter((column: ColumnDefinition<any>) => column.hidden === true)
            .map((column: ColumnDefinition<any>) => column.displayName);
        };
      });

      it('allows creation of grid with hidden columns', () => {
        const untypedContext: any = testContext;

        const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
        const hiddenHeaders: string[] = untypedContext.hiddenColumns();
        expect(hiddenHeaders.length).toEqual(1);
        expect(hiddenHeaders[0]).toEqual(untypedContext.columnsDefs[2].displayName);
        const row: GridRowTestHelper = gridHelper.getRows()[0];
        expect(row.getElement().querySelectorAll('clr-dg-cell.datagrid-cell').length).toEqual(3);
      });

      it('allows hide of column', () => {
        const untypedContext: any = testContext;

        const gridHelper = new GridHelper(untypedContext.fixture.debugElement);

        let hiddenHeaders: string[] = untypedContext.hiddenColumns();
        expect(hiddenHeaders.length).toEqual(1);

        gridHelper.getFooter().openShowHideColumnsMenu();
        renderFixture(untypedContext.fixture);
        gridHelper.getFooter().clickShowHideColumnsItem(untypedContext.columnsDefs[2].displayName);
        renderFixture(untypedContext.fixture);
        hiddenHeaders = untypedContext.hiddenColumns();
        expect(hiddenHeaders.length).toEqual(0);
        const row: GridRowTestHelper = gridHelper.getRows()[0];
        expect(row.getElement().querySelectorAll('clr-dg-cell.datagrid-cell').length).toEqual(4);
      });

      it("doesn't allow hiding non-hideable column", () => {
        const untypedContext: any = testContext;

        const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
        gridHelper.getFooter().openShowHideColumnsMenu();
        renderFixture(untypedContext.fixture);
        const showHideColumnsItem = gridHelper
          .getFooter()
          .findShowHideColumnsItemByName(untypedContext.columnsDefs[0].displayName);
        expect(showHideColumnsItem).toBeNull();
      });

      it('column hidden state change is emitted when show column', () => {
        const untypedContext: any = testContext;

        const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
        vi.spyOn(untypedContext.component, 'onColumnHiddenStateChange').mockImplementation(() => undefined);
        gridHelper.getFooter().openShowHideColumnsMenu();
        renderFixture(untypedContext.fixture);

        gridHelper.getFooter().clickShowHideColumnsItem(untypedContext.columnsDefs[2].displayName);
        expect(untypedContext.component.onColumnHiddenStateChange).toHaveBeenCalledWith({
          hidden: false,
          column: untypedContext.columnsDefs[2],
        });
      });
    });

    describe('filter', () => {
      describe('WHEN filter property is passed to a column', () => {
        beforeEach(() => {
          const untypedContext: any = testContext;

          untypedContext.component.columnsDefs = [
            {
              displayName: 'Name',
              field: 'name',
              stringFilter: new NameFilter(),
            },
            {
              displayName: 'State',
              field: 'powerState',
            },
            {
              displayName: 'Host',
              field: 'host',
              hidden: true,
            },
            {
              displayName: 'Status',
              field: 'status',
              columnRenderer: StatusRendererComponent,
              filter: PowerStateFilterComponent,
            },
          ];
          untypedContext.component.data = untypedContext.data;
          renderFixture(untypedContext.fixture);
        });

        it('allows filtering', () => {
          const untypedContext: any = testContext;

          const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
          gridHelper.openFilter('Name');
          vi.spyOn(untypedContext.component, 'onColumnFilterChange');
          renderFixture(untypedContext.fixture);
          const filterInput: FilterInputTestHelper = gridHelper.getFilterInput();
          filterInput.inputText('vm1', 'keyup');
          renderFixture(untypedContext.fixture);
          expect(gridHelper.getRows().length).toBe(1);
          expect(untypedContext.component.onColumnFilterChange).toHaveBeenCalledWith({
            filterValue: 'vm1',
            column: untypedContext.component.columnsDefs[0],
          });
          gridHelper.closeFilter();
          renderFixture(untypedContext.fixture);
        });

        it('can use custom filter ', () => {
          const untypedContext: any = testContext;

          const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
          gridHelper.openFilter('Status');
          renderFixture(untypedContext.fixture);
          expect(
            document.body.querySelectorAll('.clr-popover-content appfx-dg-filter-container custom-power-state-filter')
              .length
          ).toEqual(1);
          gridHelper.closeFilter();
          renderFixture(untypedContext.fixture);
        });
      });

      describe('WHEN sortAndFilterByField property is passed to a column', () => {
        beforeEach(() => {
          const untypedContext: any = testContext;

          untypedContext.columnsDefs = [
            {
              displayName: 'Name',
              field: 'name',
              sortAndFilterByField: 'name',
            },
            {
              displayName: 'State',
              field: 'powerState',
            },
            {
              displayName: 'Host',
              field: 'host',
              hidden: true,
            },
            {
              displayName: 'Status',
              field: 'status',
            },
          ];
          untypedContext.component.columnsDefs = untypedContext.columnsDefs;
          untypedContext.component.data = untypedContext.data;
          renderFixture(untypedContext.fixture);
        });

        it('allows filtering by that column', () => {
          const untypedContext: any = testContext;

          const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
          gridHelper.openFilter('Name');
          renderFixture(untypedContext.fixture);
          const filterInput: FilterInputTestHelper = gridHelper.getFilterInput();
          filterInput.inputText('vm2', 'keyup');
          renderFixture(untypedContext.fixture);

          expect(gridHelper.getRows().length).toBe(1);
          expect(gridHelper.getRows()[0].getCellAt(0).getText()).toEqual('vm2');

          gridHelper.closeFilter();
          renderFixture(untypedContext.fixture);
        });
      });
    });

    describe('reorder', () => {
      beforeEach(() => {
        const untypedContext: any = testContext;

        untypedContext.component.selectionType = SelectionType.Single;
        untypedContext.component.columnsDefs = [
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
        ] as Array<ColumnDefinition<any>>;
        untypedContext.component.data = untypedContext.data;
        renderFixture(untypedContext.fixture);
      });

      it('with drag and drop', () => {
        const untypedContext: any = testContext;

        let gridHelper = new GridHelper(untypedContext.fixture.debugElement);
        expect(gridHelper.getHeaders()[0]).toEqual('Name');
        expect(gridHelper.getHeaders()[1]).toEqual('State');
        expect(gridHelper.getHeaders()[2]).toEqual('Status');
        const hostElement = untypedContext.fixture.debugElement.query(By.directive(CdkDropList));
        const cdkDropList = hostElement.injector.get(CdkDropList);
        //Move first column after the last on
        const newColumnIndex = cdkDropList.getSortedItems().findIndex((item: any) => {
          return item.data === untypedContext.component.columnsDefs[2];
        });
        const droppedData = {
          item: {
            data: untypedContext.component.columnsDefs[0],
          },
          currentIndex: newColumnIndex,
        };
        cdkDropList.dropped.next(droppedData);
        renderFixture(untypedContext.fixture);

        gridHelper = new GridHelper(untypedContext.fixture.debugElement);
        expect(gridHelper.getHeaders()[0]).toEqual('State');
        expect(gridHelper.getHeaders()[1]).toEqual('Status');
        expect(gridHelper.getHeaders()[2]).toEqual('Name');
      });

      it('emits reorder change event', () => {
        const untypedContext: any = testContext;

        vi.spyOn(untypedContext.component, 'onColumnOrderChange').mockImplementation(() => undefined);
        const hostElement = untypedContext.fixture.debugElement.query(By.directive(CdkDropList));
        const cdkDropList = hostElement.injector.get(CdkDropList);
        const newColumnIndex = cdkDropList.getSortedItems().findIndex((item: any) => {
          return item.data === untypedContext.component.columnsDefs[2];
        });
        const droppedData = {
          item: {
            data: untypedContext.component.columnsDefs[0],
          },
          currentIndex: newColumnIndex,
        };
        cdkDropList.dropped.next(droppedData);
        renderFixture(untypedContext.fixture);
        expect(untypedContext.component.onColumnOrderChange).toHaveBeenCalledWith({
          previousIndex: 0,
          currentIndex: 2,
          columns: [
            untypedContext.component.columnsDefs[1],
            untypedContext.component.columnsDefs[2],
            untypedContext.component.columnsDefs[0],
          ],
        });
      });
    });
  });

  describe('drag drop rows', () => {
    beforeEach(() => {
      const untypedContext: any = testContext;

      untypedContext.component.columnsDefs = untypedContext.columnsDefs;
      untypedContext.component.data = untypedContext.data;
      untypedContext.component.isRowSelectionMode = true;
    });

    it('able to get dragged rows', () => {
      const untypedContext: any = testContext;

      const dataGridComponent = untypedContext.component.appfxDatagridComponent;
      const firstRow = untypedContext.data[0];
      dataGridComponent.selectedItems = [untypedContext.data[0]];
      dataGridComponent.setDraggedItems(firstRow);
      expect(dataGridComponent.draggedItems.length).toEqual(1);
      dataGridComponent.selectedItems = [untypedContext.data[0], untypedContext.data[1]];
      dataGridComponent.setDraggedItems(firstRow);
      expect(dataGridComponent.draggedItems.length).toEqual(2);
      dataGridComponent.setDraggedItems(untypedContext.data[2]);
      expect(dataGridComponent.draggedItems.length).toEqual(1);
    });
  });

  describe('#dropGroup', () => {
    it('should call getGroupItems', () => {
      const untypedContext: any = testContext;

      const groupService = TestBed.inject(DragAndDropGroupService);
      const mockGroupItems = ['first-element', 'second-element'] as unknown[] as CdkDropList[];
      const mockGroupId = 'inventory';
      vi.spyOn(groupService, 'getGroupItems').mockReturnValue(mockGroupItems);

      const result = untypedContext.component.appfxDatagridComponent.dropGroup(mockGroupId);
      expect(result).toEqual(mockGroupItems);
      expect(groupService.getGroupItems).toHaveBeenCalledWith(mockGroupId);
    });
  });

  describe('is row locked', () => {
    beforeEach(() => {
      const untypedContext: any = testContext;

      untypedContext.component.data = untypedContext.data;
      untypedContext.component.isRowSelectionMode = true;
    });

    it('when returns false', async () => {
      useTestTimers();
      const untypedContext: any = testContext;
      vi.spyOn(untypedContext.component, 'isRowLocked').mockReturnValue(false);
      renderFixture(untypedContext.fixture);
      await vi.advanceTimersByTimeAsync(0);

      const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
      expect(gridHelper.getSelectedRows().length).toBe(0);

      gridHelper.getRows()[0].click();
      renderFixture(untypedContext.fixture);

      expect(gridHelper.getSelectedRows().length).toBe(1);
      expect(gridHelper.getRows()[0].isSelected()).toBeTruthy();
      expect(untypedContext.component.isRowLocked).toHaveBeenCalledWith(untypedContext.data[0]);
    });

    it('when returns true', async () => {
      useTestTimers();
      const untypedContext: any = testContext;
      vi.spyOn(untypedContext.component, 'isRowLocked').mockReturnValue(true);
      renderFixture(untypedContext.fixture);
      await vi.advanceTimersByTimeAsync(0);

      const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
      expect(gridHelper.getSelectedRows().length).toBe(0);

      gridHelper.getRows()[0].click();
      renderFixture(untypedContext.fixture);

      expect(gridHelper.getRows()[0].isSelectionDisabled).toBeTruthy();
      expect(gridHelper.getRows()[1].isSelectionDisabled).toBeTruthy();
      expect(gridHelper.getRows()[2].isSelectionDisabled).toBeTruthy();
      expect(gridHelper.getRows()[3].isSelectionDisabled).toBeTruthy();
      expect(untypedContext.component.isRowLocked).toHaveBeenCalledWith(untypedContext.data[0]);
    });
  });

  describe('Single-selection mode', () => {
    beforeEach(() => {
      const untypedContext: any = testContext;

      untypedContext.component.columnsDefs = untypedContext.columnsDefs;
      untypedContext.component.data = untypedContext.data;
      untypedContext.component.isRowSelectionMode = true;
      untypedContext.component.appfxDatagridComponent.ngOnInit();
    });

    it('is set by default', async () => {
      useTestTimers();
      renderFixture(testContext.fixture);

      const gridHelper = new GridHelper(testContext.fixture.debugElement);
      expect(gridHelper.getSelectedRows().length).toBe(0);

      vi.spyOn(testContext.component, 'changeSelection').mockImplementation(() => undefined);
      gridHelper.getRows()[0].click();

      renderFixture(testContext.fixture);
      await vi.advanceTimersByTimeAsync(0);

      expect(gridHelper.getSelectedRows().length).toBe(1);

      expect(gridHelper.getRows()[0].isSelected()).toBeTruthy();
      expect(testContext.component.changeSelection).toHaveBeenCalledWith([testContext.data[0]]);
      gridHelper.getRows()[2].click();
      renderFixture(testContext.fixture);
      await vi.advanceTimersByTimeAsync(0);

      expect(gridHelper.getRows()[2].isSelected()).toBeTruthy();
      expect(gridHelper.getSelectedRows().length).toBe(1);
    });

    it('let the user to select only one item', async () => {
      useTestTimers();
      renderFixture(testContext.fixture);
      renderFixture(testContext.fixture);
      await vi.advanceTimersByTimeAsync(0);

      vi.spyOn(testContext.component, 'changeSelection').mockImplementation(() => undefined);
      const gridHelper = new GridHelper(testContext.fixture.debugElement);
      gridHelper.getRows()[0].click();
      renderFixture(testContext.fixture);
      await vi.advanceTimersByTimeAsync(0);

      expect(gridHelper.getRows()[0].isSelected()).toBeTruthy();
      expect(gridHelper.getSelectedRows().length).toBe(1);
      expect(testContext.component.changeSelection).toHaveBeenCalledWith([testContext.data[0]]);

      gridHelper.getRows()[2].click();
      renderFixture(testContext.fixture);
      await vi.advanceTimersByTimeAsync(0);

      expect(gridHelper.getSelectedRows().length).toBe(1);
      expect(gridHelper.getRows()[2].isSelected()).toBeTruthy();
      expect(testContext.component.changeSelection).toHaveBeenCalledWith([testContext.data[0]]);
    });

    it('can be changed to multi-selection mode and reset to single selection mode', async () => {
      useTestTimers();
      renderFixture(testContext.fixture);
      await vi.advanceTimersByTimeAsync(0);
      renderFixture(testContext.fixture);

      const gridHelper = new GridHelper(testContext.fixture.debugElement);
      expect(gridHelper.getRows()[2].isRowSingleSelectable()).toBeTruthy();

      testContext.component.appfxDatagridComponent.selectionType = SelectionType.None;
      testContext.component.appfxDatagridComponent.onModelChange();
      await vi.advanceTimersByTimeAsync(0);
      renderFixture(testContext.fixture);
      expect(gridHelper.getRows()[2].isRowSingleSelectable()).toBeFalsy();

      testContext.component.appfxDatagridComponent.selectionType = SelectionType.Multi;
      await vi.advanceTimersByTimeAsync(0);
      testContext.component.appfxDatagridComponent.onModelChange();
      renderFixture(testContext.fixture);
      expect(gridHelper.getRows()[2].isRowSingleSelectable()).toBeFalsy();

      gridHelper.getRows()[2].click();
      await vi.advanceTimersByTimeAsync(0);
      renderFixture(testContext.fixture);
      expect(gridHelper.getRows()[2].isSelected()).toBeTruthy();
      gridHelper.getRows()[1].click();
      await vi.advanceTimersByTimeAsync(0);
      renderFixture(testContext.fixture);
      expect(gridHelper.getSelectedRows().length).toBe(2);
      testContext.component.appfxDatagridComponent.selectionType = SelectionType.Single;
      testContext.component.appfxDatagridComponent.onModelChange();
      await vi.advanceTimersByTimeAsync(0);
      renderFixture(testContext.fixture);
      expect(gridHelper.getRows()[2].isRowSingleSelectable()).toBeTruthy();
    });

    it('allows selected items to be changed from the host component', async () => {
      useTestTimers();
      testContext.component.appfxDatagridComponent.selectionType = SelectionType.Single;

      renderFixture(testContext.fixture);
      await vi.advanceTimersByTimeAsync(0);
      renderFixture(testContext.fixture);
      const gridHelper = new GridHelper(testContext.fixture.debugElement);
      gridHelper.getRows()[0].click();
      await vi.advanceTimersByTimeAsync(0);
      renderFixture(testContext.fixture);
      expect(gridHelper.getRows()[0].isSelected()).toBeTruthy();

      testContext.component.appfxDatagridComponent.selectedItems = [testContext.data[3]];
      await vi.advanceTimersByTimeAsync(0);
      renderFixture(testContext.fixture);
      expect(gridHelper.getRows()[3].isSelected()).toBeTruthy();
      expect(gridHelper.getRows()[0].isSelected()).toBeFalsy();
    });

    it('let the user to select the first item when pre-select first item flag is enabled', () => {
      const untypedContext: any = testContext;

      untypedContext.component.appfxDatagridComponent.preSelectFirstItem = true;
      renderFixture(untypedContext.fixture);

      const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
      expect(gridHelper.getRows()[0].isSelected()).toBeTruthy();
    });
  });

  describe('None selection mode', () => {
    beforeEach(() => {
      const untypedContext: any = testContext;

      untypedContext.component.columnsDefs = untypedContext.columnsDefs;
      untypedContext.component.data = untypedContext.data;
      untypedContext.component.appfxDatagridComponent.ngOnInit();
    });

    it('the user can not select an item', async () => {
      useTestTimers();
      renderFixture(testContext.fixture);
      await vi.advanceTimersByTimeAsync(0);
      renderFixture(testContext.fixture);

      const gridHelper = new GridHelper(testContext.fixture.debugElement);
      gridHelper.getRows()[0].click();
      await vi.advanceTimersByTimeAsync(0);
      renderFixture(testContext.fixture);
      expect(gridHelper.getRows()[0].isSelected()).toBeTruthy();
      expect(gridHelper.getSelectedRows().length).toBe(1);

      testContext.component.appfxDatagridComponent.selectionType = SelectionType.None;
      testContext.component.appfxDatagridComponent.onModelChange();
      await vi.advanceTimersByTimeAsync(0);
      renderFixture(testContext.fixture);
      vi.spyOn(testContext.component, 'changeSelection').mockImplementation(() => undefined);
      expect(gridHelper.getRows()[2].isRowSingleSelectable()).toBeFalsy();

      const rows = gridHelper.getRows();
      expect(rows.length).toBeGreaterThan(0);
      rows.forEach((row, i) => {
        expect(row.isRowClickable(), `Row ${i} should not be clickable`).toBeFalsy();
        expect(row.isSelectionAvailable(), `Row ${i} should not have selection available`).toBeFalsy();
      });
      expect(testContext.component.changeSelection).not.toHaveBeenCalled();
    });
  });

  describe('Multi-selection mode', () => {
    beforeEach(() => {
      const untypedContext: any = testContext;

      // required to execute the async callbacks in Clarity's Datagrid component
      vi.useRealTimers();
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] });
      untypedContext.component.selectionType = SelectionType.Multi;
      untypedContext.component.columnsDefs = untypedContext.columnsDefs;
      untypedContext.component.data = untypedContext.data;
      untypedContext.component.appfxDatagridComponent.ngOnInit();
      renderFixture(untypedContext.fixture);
      vi.advanceTimersByTime(10);
      renderFixture(untypedContext.fixture);
      untypedContext.component.appfxDatagridComponent.selectedItems = []; // reset
      renderFixture(untypedContext.fixture);
      vi.advanceTimersByTime(10);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('let the user to select several items', () => {
      const untypedContext: any = testContext;

      const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
      gridHelper.getRows()[0].click();

      vi.advanceTimersByTime(10);
      renderFixture(untypedContext.fixture);
      expect(gridHelper.getSelectedRows().length).toBe(1);
      vi.spyOn(untypedContext.component, 'changeSelection').mockImplementation(() => undefined);
      gridHelper.getRows()[2].click();
      vi.advanceTimersByTime(10);
      renderFixture(untypedContext.fixture);
      vi.advanceTimersByTime(10);
      expect(gridHelper.getSelectedRows().length).toBe(2);
      expect(gridHelper.getRows()[0].isSelected()).toBeTruthy();
      expect(gridHelper.getRows()[2].isSelected()).toBeTruthy();
      expect(untypedContext.component.changeSelection).toHaveBeenCalledWith([
        untypedContext.data[0],
        untypedContext.data[2],
      ]);
    });

    it('selected items can be changed from the host component', () => {
      const untypedContext: any = testContext;

      const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
      expect(gridHelper.getSelectedRows().length).toBe(0);

      untypedContext.component.appfxDatagridComponent.selectedItems = [untypedContext.data[3], untypedContext.data[2]];
      renderFixture(untypedContext.fixture);

      expect(gridHelper.getSelectedRows().length).toBe(2);
      expect(gridHelper.getRows()[3].isSelected()).toBeTruthy();
      expect(gridHelper.getRows()[2].isSelected()).toBeTruthy();
    });

    it('should set selected items to empty array when selectedItems is undefined', () => {
      const untypedContext: any = testContext;

      const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
      expect(gridHelper.getSelectedRows().length).toBe(0);

      untypedContext.component.appfxDatagridComponent.selectedItems = undefined;
      renderFixture(untypedContext.fixture);

      expect(gridHelper.getSelectedRows().length).toBe(0);
      expect(gridHelper.getRows()[3].isSelected()).toBeFalsy();
      expect(gridHelper.getRows()[2].isSelected()).toBeFalsy();
    });

    it('should set selected items to empty array when selectedItems is array of undefined', () => {
      const untypedContext: any = testContext;

      const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
      expect(gridHelper.getSelectedRows().length).toBe(0);

      untypedContext.component.appfxDatagridComponent.selectedItems = [undefined];
      renderFixture(untypedContext.fixture);

      expect(gridHelper.getSelectedRows().length).toBe(0);
      expect(gridHelper.getRows()[3].isSelected()).toBeFalsy();
      expect(gridHelper.getRows()[2].isSelected()).toBeFalsy();
    });

    it('should deselect all items on "Deselect All" button click', () => {
      const untypedContext: any = testContext;

      const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
      expect(gridHelper.getSelectedRows().length).toBe(0);

      untypedContext.component.appfxDatagridComponent.selectedItems = [untypedContext.data[3], untypedContext.data[2]];
      renderFixture(untypedContext.fixture);
      expect(gridHelper.getSelectedRows().length).toBe(2);
      untypedContext.component.appfxDatagridComponent.onDeselectAllClick();
      renderFixture(untypedContext.fixture);

      expect(gridHelper.getSelectedRows().length).toBe(0);
    });

    it('`Select All` checkbox selects/deselects all rows in virtual datagrid', () => {
      const untypedContext: any = testContext;

      untypedContext.component.columnsDefs = untypedContext.columnsDefs;
      untypedContext.component.virtualScrolling = true;
      untypedContext.component.trackByProperty = 'name';
      untypedContext.component.dataRange = { total: 5, skip: 0, data: untypedContext.data };

      vi.advanceTimersByTime(10);
      renderFixture(untypedContext.fixture);
      vi.spyOn(untypedContext.component, 'changeSelection').mockImplementation(() => undefined);
      const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
      //Select All
      gridHelper.getSelectAllElement()?.click();
      renderFixture(untypedContext.fixture);

      expect(untypedContext.component.appfxDatagridComponent.selectedItems.length).toBe(4);
      expect(gridHelper.getSelectedRows().length).toBe(4);
      expect(untypedContext.component.changeSelection).toHaveBeenCalledWith(untypedContext.data);
      // Deselect All
      gridHelper.getSelectAllElement()?.click();
      renderFixture(untypedContext.fixture);

      expect(gridHelper.getSelectedRows().length).toBe(0);
      expect(untypedContext.component.changeSelection).toHaveBeenCalledWith([]);
    });
  });

  describe('Row selection mode', () => {
    beforeEach(() => {
      const untypedContext: any = testContext;

      untypedContext.component.columnsDefs = untypedContext.columnsDefs;
      untypedContext.component.data = untypedContext.data;
    });

    it('is set by default', async () => {
      useTestTimers();
      renderFixture(testContext.fixture);
      await vi.advanceTimersByTimeAsync(0);
      renderFixture(testContext.fixture);
      expect(testContext.component.appfxDatagridComponent.rowSelectionMode).toBeTruthy();
      const gridHelper = new GridHelper(testContext.fixture.debugElement);
      expect(gridHelper.getSelectedRows().length).toBe(0);
      gridHelper.getRows()[0].click();
      await vi.advanceTimersByTimeAsync(0);
      renderFixture(testContext.fixture);
      expect(gridHelper.getSelectedRows().length).toBe(1);
    });

    it('can be disabled', async () => {
      useTestTimers();
      const detectChanges = async () => {
        await vi.advanceTimersByTimeAsync(0);
        renderFixture(testContext.fixture);
      };

      const gridHelper = new GridHelper(testContext.fixture.debugElement);

      testContext.component.selectionType = SelectionType.Single;
      testContext.component.isRowSelectionMode = true;
      await detectChanges();

      expect(gridHelper.getRows()[0].isRowClickable()).toEqual(true);
      expect(gridHelper.getSelectedRows().length).toBe(0);

      testContext.component.isRowSelectionMode = false;
      await detectChanges();

      expect(gridHelper.getRows()[0].isRowClickable()).toEqual(false);
      expect(gridHelper.getSelectedRows().length).toBe(0);

      gridHelper.getRows()[0].select();

      await detectChanges();
      expect(gridHelper.getSelectedRows().length).toBe(1);
    });
  });

  describe('Actions', () => {
    beforeEach(() => {
      const untypedContext: any = testContext;

      untypedContext.component.columnsDefs = untypedContext.columnsDefs;
      untypedContext.component.data = untypedContext.data;
    });

    it('allows creation of datagrid with rows actions', () => {
      const untypedContext: any = testContext;

      const simpleChange: SimpleChanges = {
        singleRowActions: new SimpleChange(undefined, untypedContext.actions, true),
      };

      untypedContext.component.appfxDatagridComponent.selectionType = SelectionType.None;
      untypedContext.component.appfxDatagridComponent.singleRowActions = untypedContext.actions;
      untypedContext.component.appfxDatagridComponent.ngOnChanges(simpleChange);
      vi.spyOn(untypedContext.component, 'onRowActionOverflowOpen').mockImplementation(() => undefined);
      vi.spyOn(untypedContext.component, 'onActionClick').mockImplementation(() => undefined);
      untypedContext.component.appfxDatagridComponent.onModelChange();

      renderFixture(untypedContext.fixture);
      const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
      const gridElement: HTMLElement = gridHelper.getRows()[1].getSingleRowActionMenuButton();
      gridElement.click();
      renderFixture(untypedContext.fixture);
      gridHelper.getRows()[1].clickOnSingleRowActionMenuItem('Delete');
      expect(untypedContext.component.onRowActionOverflowOpen).toHaveBeenCalledWith({
        open: true,
        actions: untypedContext.actions,
        context: untypedContext.data[1],
      });
      expect(untypedContext.component.onActionClick).toHaveBeenCalledWith({
        action: untypedContext.actions[1],
        context: untypedContext.data[1],
      });
    });

    it('allows creation of a datagrid with action bar', () => {
      const untypedContext: any = testContext;

      untypedContext.component.appfxDatagridComponent.actionBarActions = untypedContext.actions;
      vi.spyOn(untypedContext.component, 'onActionClick').mockImplementation(() => undefined);
      untypedContext.component.appfxDatagridComponent.ngOnInit();
      renderFixture(untypedContext.fixture);
      const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
      gridHelper.clickActionBarButton(untypedContext.actions[2].label);
      expect(untypedContext.component.onActionClick).toHaveBeenCalledWith({
        action: untypedContext.actions[2],
        context: [],
      });
    });
  });

  describe('Footer', () => {
    it('is visible by default', () => {
      const untypedContext: any = testContext;

      untypedContext.component.columnsDefs = untypedContext.columnsDefs;
      untypedContext.component.data = untypedContext.data;

      renderFixture(untypedContext.fixture);
      const gridFooter = new GridHelper(untypedContext.fixture.debugElement).getFooter();
      expect(gridFooter.getFooterText()).toContain('4 items');
    });

    it('footer actions emit events', () => {
      const untypedContext: any = testContext;

      untypedContext.component.appfxDatagridComponent.footerModel = {
        footerActions: [
          {
            id: 'footer-action-1',
            label: 'Footer Action 1',
            enabled: true,
          },
        ],
        showFooter: true,
      };
      vi.spyOn(untypedContext.component, 'onActionClick').mockImplementation(() => undefined);
      untypedContext.component.appfxDatagridComponent.ngOnInit();
      renderFixture(untypedContext.fixture);
      const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
      const button = gridHelper.findFooterButton(
        untypedContext.component.appfxDatagridComponent.footerModel.footerActions[0].label
      );
      expect(button).toBeDefined();
      button?.click();
      expect(untypedContext.component.onActionClick).toHaveBeenCalledWith({
        action: untypedContext.component.appfxDatagridComponent.footerModel.footerActions[0],
        context: [],
      });
    });

    it('footer action with children emits events with correct context', () => {
      const untypedContext: any = testContext;

      untypedContext.component.appfxDatagridComponent.selectionType = SelectionType.Multi;
      untypedContext.component.data = untypedContext.data;
      untypedContext.component.appfxDatagridComponent.footerModel = {
        footerActions: [
          {
            id: 'footer-action-1',
            label: 'Footer Action 1',
            enabled: true,
            children: [
              {
                id: 'footer-action-2',
                label: 'Footer Action 2',
                enabled: true,
              },
            ],
          },
        ],
        showFooter: true,
      };
      vi.spyOn(untypedContext.component, 'onActionClick').mockImplementation(() => undefined);
      untypedContext.component.appfxDatagridComponent.ngOnInit();
      renderFixture(untypedContext.fixture);
      const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
      gridHelper.getRows().forEach(row => row.select());
      const button = gridHelper.findFooterButton(
        untypedContext.component.appfxDatagridComponent.footerModel.footerActions[0].label
      );
      expect(button).toBeDefined();
      button?.click();
      renderFixture(untypedContext.fixture);
      const childButton = gridHelper.findFooterDropdownChildButton(
        untypedContext.component.appfxDatagridComponent.footerModel.footerActions[0].children[0].label
      );
      expect(childButton).toBeDefined();
      childButton?.click();
      expect(untypedContext.component.onActionClick).toHaveBeenCalledWith({
        action: untypedContext.component.appfxDatagridComponent.footerModel.footerActions[0].children[0],
        context: untypedContext.component.appfxDatagridComponent.selectedItems,
      });
    });

    it('can be by hide', () => {
      const untypedContext: any = testContext;

      untypedContext.component.columnsDefs = untypedContext.columnsDefs;
      untypedContext.component.data = untypedContext.data;
      untypedContext.component.appfxDatagridComponent.footerModel = {
        showFooter: false,
      };

      renderFixture(untypedContext.fixture);
      const gridFooter = new GridHelper(untypedContext.fixture.debugElement).getFooter();
      expect(gridFooter.getElement()).toBeNull();
    });

    it('supports pagination', () => {
      const allGridData = [...testContext.data];
      allGridData.push(
        {
          status: 'Error',
          name: 'vm5',
          powerState: PowerState.off,
        },
        {
          status: 'Normal',
          name: 'vm6',
          powerState: PowerState.on,
        }
      );
      testContext.component.columnsDefs = testContext.columnsDefs;
      testContext.component.data = allGridData;
      testContext.component.appfxDatagridComponent.pageSize = 2;
      testContext.component.appfxDatagridComponent.totalItems = 6;

      renderFixture(testContext.fixture);
      const gridHelper = new GridHelper(testContext.fixture.debugElement);
      const footerText: string = gridHelper.getFooter().getFooterText();
      expect(footerText).toContain('1 - 2 of 6 items');
      let rows: GridRowTestHelper[] = gridHelper.getRows();
      expect(rows.length).toEqual(2);

      rows.forEach((row: GridRowTestHelper, rowIndex: number) => {
        for (const columnDef of testContext.columnsDefs) {
          const expectedRow: any = testContext.data[rowIndex];
          const subjectColumnIndex = testContext.columnsDefs.findIndex(
            (col: ColumnDefinition<any>) => col === columnDef
          );
          expect(row.getCellAt(subjectColumnIndex).getCellWrapperElement().textContent?.trim()).toEqual(
            expectedRow[columnDef.field]
          );
        }
      });

      vi.spyOn(testContext.component, 'refreshGridData').mockImplementation(() => undefined);
      gridHelper.getFooter().clickNextPaginationButton();
      renderFixture(testContext.fixture);
      rows = gridHelper.getRows();
      expect(rows.length).toEqual(2);

      rows.forEach((row: GridRowTestHelper, rowIndex: number) => {
        for (const columnDef of testContext.columnsDefs) {
          const expectedRow: any = testContext.data[rowIndex + 2];
          const subjectColumnIndex = testContext.columnsDefs.findIndex(
            (col: ColumnDefinition<any>) => col === columnDef
          );
          expect(row.getCellAt(subjectColumnIndex).getCellWrapperElement().textContent?.trim()).toEqual(
            expectedRow[columnDef.field]
          );
        }
      });

      expect(testContext.component.refreshGridData).toHaveBeenCalledWith({
        page: { from: 2, to: 3, size: 2, current: 2 },
      });
    });

    it('can hide column toggle', () => {
      const untypedContext: any = testContext;

      untypedContext.component.columnsDefs = untypedContext.columnsDefs;
      untypedContext.component.appfxDatagridComponent.footerModel = {
        hideColumnToggle: true,
      };

      renderFixture(untypedContext.fixture);
      const gridHelper = new GridHelper(untypedContext.fixture.debugElement);

      // Verify that column headers are still properly rendered.
      const headers = gridHelper.getHeaders();
      headers.forEach((columnName: string, index: number) => {
        expect(columnName).toEqual(untypedContext.columnsDefs[index].displayName);
      });

      const rows = gridHelper.getRows();
      expect(rows.length).toEqual(0);

      const gridFooter = gridHelper.getFooter();
      expect(gridFooter.getElement().querySelector('clr-dg-column-toggle')).toBeNull();
    });

    it('shows correct items count', () => {
      const untypedContext: any = testContext;

      const allGridData = [...untypedContext.data];
      untypedContext.component.appfxDatagridComponent.getFooterMessage = (totalItems: number): string => {
        return 'items ' + totalItems;
      };
      untypedContext.component.columnsDefs = untypedContext.columnsDefs;
      untypedContext.component.data = allGridData;

      renderFixture(untypedContext.fixture);
      const gridHelper = new GridHelper(untypedContext.fixture.debugElement);

      const rows = gridHelper.getRows();
      expect(rows.length).toEqual(4);

      const gridFooter = gridHelper.getFooter();
      expect(gridFooter.getElement().textContent).toContain('items ' + 4);
      untypedContext.component.data = untypedContext.data.slice(1);
      renderFixture(untypedContext.fixture);
      expect(gridHelper.getFooter().getElement().textContent).toContain('items ' + 3);
    });

    it('shows 1 item if one item', () => {
      const untypedContext: any = testContext;

      untypedContext.component.virtualScrolling = true;
      renderFixture(untypedContext.fixture);
      let footerMessage = untypedContext.component.appfxDatagridComponent.getFooterMessage(1, undefined, 1, 1);
      expect(footerMessage).toEqual(untypedContext.dgStrings.singleItem);
      untypedContext.component.virtualScrolling = false;
      renderFixture(untypedContext.fixture);
      footerMessage = untypedContext.component.appfxDatagridComponent.getFooterMessage(1, undefined, 1, 1);
      expect(footerMessage).toEqual(untypedContext.dgStrings.singleItem);
    });

    it('shows loaded range of records', () => {
      const untypedContext: any = testContext;

      untypedContext.component.virtualScrolling = true;
      renderFixture(untypedContext.fixture);
      // shows range when virtual scrolling is enabled
      let footerMessage = untypedContext.component.appfxDatagridComponent.getFooterMessage(640, undefined, 66, 109);
      expect(footerMessage).toEqual('66 - 109 of 640 items');
      // shows total count when virtual scrolling is enabled and loaded items are less than total count
      footerMessage = untypedContext.component.appfxDatagridComponent.getFooterMessage(44, undefined, 66, 109);
      expect(footerMessage).toEqual('44 items');

      untypedContext.component.virtualScrolling = false;
      renderFixture(untypedContext.fixture);
      // shows range when page size is set
      footerMessage = untypedContext.component.appfxDatagridComponent.getFooterMessage(640, 20, 66, 109);
      expect(footerMessage).toEqual('66 - 109 of 640 items');
      // shows total count when page size is not set
      footerMessage = untypedContext.component.appfxDatagridComponent.getFooterMessage(640, undefined, 66, 109);
      expect(footerMessage).toEqual('640 items');
    });

    it('should have custom footer text when datagridLabels.footer is set', () => {
      const untypedContext: any = testContext;

      renderFixture(untypedContext.fixture);
      const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
      expect(gridHelper.getFooter().getFooterText()).toContain('items');
      const customFooterText = 'Apples';
      untypedContext.component.datagridLabels = {
        footer: customFooterText,
      };
      renderFixture(untypedContext.fixture);
      expect(gridHelper.getFooter().getFooterText()).toContain(customFooterText);
    });

    it('should emit exportDataEvent if footerModel.enableCustomExport is true', () => {
      const untypedContext: any = testContext;

      untypedContext.component.appfxDatagridComponent.footerModel = {
        enableCustomExport: true,
      };
      vi.spyOn(untypedContext.component, 'onExportDataEvent').mockImplementation(() => undefined);
      const mockStatus: ExportStatus = {
        inProgress: false,
        exportType: ExportType.ALL,
      };
      untypedContext.component.appfxDatagridComponent.onExportEvent(mockStatus);
      expect(untypedContext.component.onExportDataEvent).toHaveBeenCalledWith(mockStatus);
    });

    it('should emit exportDataEvent if footerModel.clientSideExportConfig.customExport is true', () => {
      const untypedContext: any = testContext;

      untypedContext.component.appfxDatagridComponent.footerModel = {
        clientSideExportConfig: {
          customExport: true,
        },
      };
      vi.spyOn(untypedContext.component, 'onExportDataEvent').mockImplementation(() => undefined);

      const mockStatus: ExportStatus = {
        inProgress: false,
        exportType: ExportType.ALL,
      };
      untypedContext.component.appfxDatagridComponent.onExportEvent(mockStatus);

      expect(untypedContext.component.onExportDataEvent).toHaveBeenCalledWith(mockStatus);
    });

    it('should call exportUIOnlyData if clientSideExportConfig is present', () => {
      const untypedContext: any = testContext;

      const hostElement = untypedContext.fixture.debugElement.query(By.directive(DatagridComponent));
      const exportProviderService = hostElement.injector.get(ExportProviderService);
      const exportSpy = vi.spyOn(exportProviderService, 'exportUIOnlyData').mockImplementation(() => undefined);
      const clientSideExportConfig: ClientSideExportConfig = {
        exportedFileName: 'test-export-filename',
        columnDefinitions: untypedContext.columnsDefs,
      };
      untypedContext.component.appfxDatagridComponent.footerModel = {
        clientSideExportConfig,
      };
      const mockStatus = {} as ExportStatus;
      untypedContext.component.appfxDatagridComponent.onExportEvent(mockStatus);
      expect(exportSpy).toHaveBeenCalledWith(clientSideExportConfig, mockStatus, {
        totalDatagridItems: untypedContext.component.appfxDatagridComponent.gridItems,
        selectedItems: untypedContext.component.appfxDatagridComponent.selectedItems,
        filteredDatagridItems: [],
      });
    });

    it('should do nothing when enableCustomExport and clientSideExportConfig are not set', () => {
      const untypedContext: any = testContext;

      const hostElement = untypedContext.fixture.debugElement.query(By.directive(DatagridComponent));
      const exportProviderService = hostElement.injector.get(ExportProviderService);
      const exportSpy = vi.spyOn(exportProviderService, 'exportUIOnlyData').mockImplementation(() => undefined);
      untypedContext.component.appfxDatagridComponent.footerModel = {
        enableCustomExport: undefined,
        clientSideExportConfig: undefined,
      };
      vi.spyOn(untypedContext.component, 'onExportDataEvent').mockImplementation(() => undefined);
      untypedContext.component.appfxDatagridComponent.onExportEvent({} as ExportStatus);
      expect(untypedContext.component.onExportDataEvent).not.toHaveBeenCalled();
      expect(exportSpy).not.toHaveBeenCalled();
    });
  });

  describe('Right click', () => {
    beforeEach(() => {
      const untypedContext: any = testContext;

      untypedContext.mockEvent = {
        preventDefault: function () {},
      };
      untypedContext.component.columnsDefs = untypedContext.columnsDefs;
      untypedContext.component.data = untypedContext.data;
    });

    it('by default select the grid row', () => {
      const untypedContext: any = testContext;

      renderFixture(untypedContext.fixture);
      vi.spyOn(untypedContext.component, 'onOpenContextMenu').mockImplementation(() => undefined);
      const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
      expect(gridHelper.getRows()[0].isSelected()).toBeFalsy();
      untypedContext.fixture.debugElement
        .query(By.css('clr-datagrid clr-dg-row'))
        .triggerEventHandler('contextmenu', untypedContext.mockEvent);
      renderFixture(untypedContext.fixture);
      expect(gridHelper.getRows()[0].isSelected()).toBeTruthy();
      expect(untypedContext.component.onOpenContextMenu).toHaveBeenCalledWith({
        event: untypedContext.mockEvent,
        context: [untypedContext.data[0]],
      });
    });

    it('opens context menu for last clicked row', () => {
      const untypedContext: any = testContext;

      renderFixture(untypedContext.fixture);
      vi.spyOn(untypedContext.component, 'onOpenContextMenu').mockImplementation(() => undefined);
      const gridHelper = new GridHelper(untypedContext.fixture.debugElement);
      expect(gridHelper.getRows()[0].isSelected()).toBeFalsy();
      const rows = untypedContext.fixture.debugElement.queryAll(By.css('clr-datagrid clr-dg-row'));
      expect(rows.length).toEqual(gridHelper.getRows().length);
      rows[0].triggerEventHandler('contextmenu', untypedContext.mockEvent);
      renderFixture(untypedContext.fixture);
      expect(gridHelper.getRows()[0].isSelected()).toBeTruthy();
      expect(untypedContext.component.onOpenContextMenu).toHaveBeenCalledWith({
        event: untypedContext.mockEvent,
        context: [untypedContext.data[0]],
      });
      rows[1].triggerEventHandler('contextmenu', untypedContext.mockEvent);
      renderFixture(untypedContext.fixture);
      expect(gridHelper.getRows()[0].isSelected()).toBeFalsy();
      expect(gridHelper.getRows()[1].isSelected()).toBeTruthy();
      expect(untypedContext.component.onOpenContextMenu).toHaveBeenCalledWith({
        event: untypedContext.mockEvent,
        context: [untypedContext.data[1]],
      });
      expect(untypedContext.component.onOpenContextMenu).toHaveBeenCalledTimes(2);
    });

    afterEach(() => {
      const untypedContext: any = testContext;

      untypedContext.mockEvent = null;
    });
  });

  describe('Action bar filter', () => {
    beforeEach(() => {
      const untypedContext: any = testContext;

      untypedContext.mockEvent = {
        preventDefault: function () {},
      };
      untypedContext.component.columnsDefs = untypedContext.columnsDefs;
      untypedContext.component.data = untypedContext.data;
    });

    it('emits change event with the search term', () => {
      const untypedContext: any = testContext;

      untypedContext.component.appfxDatagridComponent.filterMode = FilterMode.Quick;
      renderFixture(untypedContext.fixture);
      vi.spyOn(untypedContext.component, 'onSearchTermChange').mockImplementation(() => undefined);
      untypedContext.component.appfxDatagridComponent.onAdvancedSearchTermChange('test');
      renderFixture(untypedContext.fixture);
      expect(untypedContext.component.onSearchTermChange).toHaveBeenCalledWith('test');
    });

    it('emits change event with advanced filters', () => {
      const untypedContext: any = testContext;

      untypedContext.component.appfxDatagridComponent.filterMode = FilterMode.Advanced;
      renderFixture(untypedContext.fixture);
      vi.spyOn(untypedContext.component, 'onAdvancedFilterChange').mockImplementation(() => undefined);
      const propertyFilters: PropertyFilter[] = [new PropertyFilter()];
      untypedContext.component.appfxDatagridComponent.onAdvancedFilterCriteriaChange(propertyFilters);
      renderFixture(untypedContext.fixture);
      expect(untypedContext.component.onAdvancedFilterChange).toHaveBeenCalledWith(propertyFilters);
    });

    afterEach(() => {
      const untypedContext: any = testContext;

      untypedContext.mockEvent = null;
    });
  });

  describe('Detail pane', () => {
    beforeEach(() => {
      const untypedContext: any = testContext;

      untypedContext.component.columnsDefs = untypedContext.columnsDefs;
      untypedContext.component.data = untypedContext.data;
      untypedContext.component.appfxDatagridComponent.detailHeader = untypedContext.component.detailHeader;
    });

    it('should be hidden when "detailState" is empty', () => {
      const untypedContext: any = testContext;

      untypedContext.component.detailState = null;
      renderFixture(untypedContext.fixture);
      const detailPane: DebugElement = untypedContext.fixture.debugElement.query(By.css('clr-datagrid clr-dg-detail'));
      expect(detailPane).toBeFalsy();
    });

    it('should be visible when "detailState" not empty', () => {
      const untypedContext: any = testContext;

      untypedContext.component.detailState = untypedContext.component.data[0];
      renderFixture(untypedContext.fixture);
      const detailPane: DebugElement = untypedContext.fixture.debugElement.query(By.css('clr-datagrid clr-dg-detail'));
      expect(detailPane).toBeTruthy();
    });

    it('after hiding, "detailState" should be null in the hosting component', async () => {
      const untypedContext: any = testContext;

      untypedContext.component.detailState = untypedContext.component.data[0];
      renderFixture(untypedContext.fixture);
      const detailPaneCloseBtn: DebugElement = untypedContext.fixture.debugElement.query(
        By.css('clr-datagrid clr-dg-detail clr-dg-detail-header button')
      );
      detailPaneCloseBtn.nativeElement.click();
      await untypedContext.fixture.whenStable();
      expect(untypedContext.component.detailState).toBeNull();
    });
  });

  describe('Expandable rows', () => {
    beforeEach(() => {
      const untypedContext: any = testContext;

      untypedContext.component.columnsDefs = untypedContext.columnsDefs;
      untypedContext.component.data = untypedContext.data;
    });

    it('should be expanded by default when requested', () => {
      const untypedContext: any = testContext;

      untypedContext.component.rowsExpandedByDefault = true;
      untypedContext.component.appfxDatagridComponent.rowDetailContent = untypedContext.component.rowDetailContent;
      renderFixture(untypedContext.fixture);

      const gridHelper: GridHelper = new GridHelper(untypedContext.fixture.debugElement);
      const rows: GridRowTestHelper[] = gridHelper.getRows();
      expect(rows.length).toEqual(untypedContext.data.length);

      let rowDetailComponent: HTMLElement;
      rows.forEach((row: GridRowTestHelper) => {
        expect(row.isRowExpandable()).toBeTruthy();

        rowDetailComponent = row
          .getElement()
          .querySelector('clr-dg-row-detail > clr-dg-cell > * > span') as HTMLElement;
        expect(rowDetailComponent).toBeDefined();
        expect(rowDetailComponent?.innerText.trim()).toEqual('Test');
      });
    });

    it('should NOT be expanded by default when NOT requested', () => {
      const untypedContext: any = testContext;

      untypedContext.component.rowsExpandedByDefault = false;
      untypedContext.component.appfxDatagridComponent.rowDetailContent = untypedContext.component.rowDetailContent;
      renderFixture(untypedContext.fixture);

      const gridHelper: GridHelper = new GridHelper(untypedContext.fixture.debugElement);
      const rows: GridRowTestHelper[] = gridHelper.getRows();
      expect(rows.length).toEqual(untypedContext.data.length);

      let rowDetailComponent: HTMLElement;
      rows.forEach((row: GridRowTestHelper) => {
        expect(row.isRowExpandable()).toBeTruthy();

        rowDetailComponent = row.getElement().querySelector('clr-dg-row-detail > span') as HTMLElement;
        expect(rowDetailComponent).toBeNull();
      });
    });

    it('should preserve detail state and not recreate row when items are updated by reference but trackByProperty matches', async () => {
      useTestTimers();
      class TestItem {
        constructor(
          public name: string,
          public status: string,
          public powerState: string,
          public host: string,
          public rowDetailRenderer?: any
        ) {}
        get id() {
          return `id-${this.name}`;
        }
      }

      testContext.component.trackByProperty = 'id';
      testContext.component.appfxDatagridComponent.rowDetailContent = testContext.component.rowDetailContent;

      const allGridData = testContext.data.map(d => new TestItem(d.name, d.status, d.powerState, d.host));
      allGridData[0].rowDetailRenderer = RowDetailRendererComponent;
      testContext.component.data = allGridData;

      renderFixture(testContext.fixture);
      await vi.advanceTimersByTimeAsync(0);

      const gridHelper: GridHelper = new GridHelper(testContext.fixture.debugElement);
      const rows: GridRowTestHelper[] = gridHelper.getRows();

      // Expand the first row
      rows[0].expand();
      renderFixture(testContext.fixture);
      await vi.advanceTimersByTimeAsync(0);
      renderFixture(testContext.fixture);

      // Verify row is expanded
      expect(rows[0].isExpanded(), 'Row should be expanded initially').toBe(true);
      const originalRowElement = rows[0].getElement();

      // Update data with new references but same 'id' values
      const newData = allGridData.map(
        item => new TestItem(item.name, item.status, item.powerState, item.host, item.rowDetailRenderer)
      );
      testContext.component.data = newData;
      renderFixture(testContext.fixture);
      await vi.advanceTimersByTimeAsync(0);
      renderFixture(testContext.fixture);

      const updatedRows = gridHelper.getRows();

      // Verify the first row is still expanded
      expect(updatedRows[0].isExpanded(), 'Row should remain expanded after data refresh').toBe(true);

      // Verify it's the exact same DOM element (not recreated)
      expect(updatedRows[0].getElement(), 'Row DOM element should not be recreated').toBe(originalRowElement);
    });

    it('should have aria description', () => {
      testContext.component.rowsExpandedByDefault = true;
      testContext.component.appfxDatagridComponent.rowDetailContent = testContext.component.rowDetailContent;
      renderFixture(testContext.fixture);

      const gridHelper = new GridHelper(testContext.fixture.debugElement);
      const rows: GridRowTestHelper[] = gridHelper.getRows();
      expect(rows.length).toEqual(testContext.data.length);

      rows.forEach((row, i) => {
        expect(row.isRowExpandable()).toBeTruthy();

        const rowDetailComponent = row.getElement().querySelector('clr-dg-row-detail') as HTMLElement;

        const contentId = testContext.component.appfxDatagridComponent.buildRowDetailContentId(i);

        expect(rowDetailComponent).toBeDefined();
        expect(rowDetailComponent.getAttribute('aria-describedby')).toEqual(contentId);
        expect(rowDetailComponent.querySelectorAll(`#${contentId}`).length).toBe(1);
      });
    });
  });

  describe('toggleAll', () => {
    it('should toggle the allSelected property of clrDatagrid', async () => {
      const untypedContext: any = testContext;

      untypedContext.component.selectionType = SelectionType.Multi;
      untypedContext.component.data = untypedContext.data;
      untypedContext.component.columnsDefs = untypedContext.columnsDefs;
      renderFixture(untypedContext.fixture);

      const datagridComponent = untypedContext.component.appfxDatagridComponent;

      expect((datagridComponent as any).clrDatagrid.allSelected).toBeFalsy();

      datagridComponent.toggleAll();
      // Selection output is debounced before Angular receives the rendering notification.
      await new Promise(resolve => setTimeout(resolve, 0));
      await untypedContext.fixture.whenStable();

      expect((datagridComponent as any).clrDatagrid.allSelected).toBeTruthy();

      datagridComponent.toggleAll();
      // Selection output is debounced before Angular receives the rendering notification.
      await new Promise(resolve => setTimeout(resolve, 0));
      await untypedContext.fixture.whenStable();

      expect((datagridComponent as any).clrDatagrid.allSelected).toBeFalsy();
    });
  });
});

class StatusComparator implements ClrDatagridComparatorInterface<any> {
  private readonly filed: string = 'status';
  private readonly missingValue: string = 'unknown';

  compare(value1: any, value2: any): number {
    // emulate placement of null or unknown values at the top
    if (value1[this.filed].toString() === this.missingValue || value2[this.filed].toString() === this.missingValue) {
      return 1;
    }
    return value1[this.filed].toString().localeCompare(value2[this.filed].toString());
  }
}

@Component({
  selector: 'appfx-datagrid-host-component',
  imports: [AppfxDatagridModule, CdkA11yModule, DatagridColumnsOrderModule, DragDropModule, FormsModule, OverlayModule],
  template: `
    <appfx-datagrid
      [selectionType]="selectionType"
      [gridItems]="data"
      [columns]="columnsDefs"
      [rowSelectionMode]="isRowSelectionMode"
      [datagridLabels]="datagridLabels"
      [trackByGridItemProperty]="trackByProperty"
      [isRowLocked]="isRowLocked"
      [virtualScrolling]="virtualScrolling"
      [disableUnsort]="disableUnsort"
      [enableColumnActions]="enableColumnActions"
      [columnActions]="columnActions"
      [serverDrivenDatagrid]="serverDrivenDatagrid"
      [dataRange]="dataRange"
      [(detailState)]="detailState"
      (actionClick)="onActionClick($event)"
      (rowActionMenuOpenChange)="onRowActionOverflowOpen($event)"
      (columnSortOrderChange)="columnSortOrderChange($event)"
      (columnPinnedChange)="columnPinnedChange($event)"
      (columnHiddenStateChange)="onColumnHiddenStateChange($event)"
      (columnFilterChange)="onColumnFilterChange($event)"
      (selectedItemsChange)="changeSelection($event)"
      (refreshGridData)="refreshGridData($event)"
      (refreshVirtualGridData)="refreshVirtualGridData($event)"
      (openContextMenu)="onOpenContextMenu($event)"
      (searchTermChange)="onSearchTermChange($event)"
      (advancedFilterChange)="onAdvancedFilterChange($event)"
      (columnDefsChange)="onColumnDefsChange($event)"
      (columnOrderChange)="onColumnOrderChange($event)"
      (pageSizeChange)="onPageSizeChange($event)"
      (exportDataEvent)="onExportDataEvent($event)"
      [rowsExpandedByDefault]="rowsExpandedByDefault"
      [rowDetailContent]="rowDetailContent"
    >
      <div class="custom-placeholder-content">
        <p>Custom placeholder content</p>
        <button type="button" class="btn btn-primary">Add New Item</button>
      </div>
    </appfx-datagrid>
    <ng-template #detailHeader>
      <div></div>
    </ng-template>
    <ng-template #rowDetailContent>
      <span>Test</span>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
class DatagridHostComponent {
  @ViewChild(DatagridComponent, { static: true }) appfxDatagridComponent: DatagridComponent<unknown>;
  @ViewChild(TemplateRef, { static: true }) detailHeader: TemplateRef<any>;
  @ViewChild(TemplateRef, { static: true }) rowDetailContent: TemplateRef<any>;
  trackByProperty: string | null;
  trackByGridItemPropertySeparator = '.';
  data: any[] = [];
  columnsDefs: ColumnDefinition<any>[];
  actions: any[];
  actionBarActions: any[];
  selectionType = SelectionType.Single;
  selectedItems: any[];
  loading: boolean;
  loadingMoreItems: boolean;
  datagridLabels = { noItemsFound: 'No items found' };
  noItemsFoundPlaceholder?: string = 'No items found';
  detailState: any = null;
  rowsExpandedByDefault?: boolean = false;
  virtualScrolling = false;
  disableUnsort = true;
  enableColumnActions = false;
  columnActions: ActionDefinition[] | null = null;
  serverDrivenDatagrid = false;
  dataRange: ClrDatagridVirtualScrollRangeInterface<any> = {
    total: 100,
    skip: 0,
    data: <any>[],
  };
  private readonly rowSelectionEnabled = signal(true);
  get isRowSelectionMode(): boolean {
    return this.rowSelectionEnabled();
  }
  set isRowSelectionMode(value: boolean) {
    this.rowSelectionEnabled.set(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changeSelection(event: any) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  columnSortOrderChange(event: any) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  columnPinnedChange(event: any) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onColumnHiddenStateChange(event: any) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onColumnFilterChange(event: any) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onActionClick(event: any): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRowActionOverflowOpen(event: any): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onOpenContextMenu(event: any) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refreshGridData(state: ClrDatagridStateInterface): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refreshVirtualGridData(state: ClrDatagridStateInterface): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSearchTermChange(event: any): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAdvancedFilterChange(event: any): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onColumnDefsChange(event: any): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onPageSizeChange(event: any): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onColumnOrderChange(event: any): void {}

  isRowLocked(): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onExportDataEvent(event: any): void {}
}

@Component({
  selector: 'test-status-renderer',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div ng-non-bindable class="object">
      <span [attr.title]="label">
        <cds-icon [shape]="icon" class="is-solid"></cds-icon>
        {{ label }}</span
      >
    </div>
  `,
})
class StatusRendererComponent implements ColumnRenderer<any> {
  column: ColumnDefinition<any>;

  icon: string;
  label: string;

  set item(value: any) {
    this.statusProperties(value['status']);
  }

  onChange(item: any) {
    this.statusProperties(item['status']);
  }

  private statusProperties(status: string): void {
    this.icon = 'unknown-status';
    this.label = 'Unknown';
    if (status === 'green') {
      this.icon = 'check';
      this.label = 'Normal';
    } else if (status === 'yellow') {
      this.icon = 'warning-standard';
      this.label = 'Warning';
    } else if (status === 'red') {
      this.icon = 'error-standard';
      this.label = 'Error';
    }
  }
}

@Component({
  selector: 'row-detail-renderer',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: ` <div>some row detail</div>`,
})
class RowDetailRendererComponent implements ColumnRenderer<any> {
  item: any;
  column?: ColumnDefinition<any>;
}

class NameFilter implements ClrDatagridStringFilterInterface<any> {
  private readonly filed: string = 'name';

  accepts(item: any, search: string): boolean {
    if (search.length === 0) {
      return true;
    }
    const currentValue: string = '' + item[this.filed];
    return currentValue.toLowerCase().indexOf(search.toLowerCase()) >= 0;
  }
}

interface PowerStateObject {
  poweredOn: boolean;
  poweredOff: boolean;
}

@Component({
  selector: 'custom-power-state-filter',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: ` <div>
    <clr-checkbox-container>
      <clr-checkbox-wrapper>
        <input type="checkbox" clrCheckbox [(ngModel)]="poweredOn" />
        <label>Powered On</label>
      </clr-checkbox-wrapper>

      <clr-checkbox-wrapper>
        <input type="checkbox" clrCheckbox [(ngModel)]="poweredOff" />
        <label>Powered Off</label>
      </clr-checkbox-wrapper>
    </clr-checkbox-container>
  </div>`,
})
class PowerStateFilterComponent implements ClrDatagridFilterInterface<PowerStateObject> {
  private readonly vmPowerOnStateColumn: string = 'runtime.powerState.@formatted';

  #changes: Subject<any> = new Subject<any>();

  #poweredOn = true;
  #poweredOff = true;

  get changes(): Observable<ClrDatagridFilterInterface<PowerStateFilterComponent>[]> {
    return this.#changes.asObservable();
  }

  get poweredOn(): boolean {
    return this.#poweredOn;
  }

  set poweredOn(value: boolean) {
    if (this.#poweredOn !== value) {
      this.#poweredOn = value;
      this.#changes.next({ poweredOn: value });
    }
  }

  set filterValue(value: PowerStateFilterComponent) {
    if (!value) {
      return;
    }
    if (value.poweredOn) {
      this.poweredOn = value.poweredOn;
    }

    if (value.poweredOff) {
      this.poweredOff = value.poweredOff;
    }
  }

  get poweredOff(): boolean {
    return this.#poweredOff;
  }

  set poweredOff(value: boolean) {
    if (this.#poweredOff !== value) {
      this.#poweredOff = value;
      this.#changes.next({ poweredOff: value });
    }
  }

  accepts(item: PowerStateFilterComponent) {
    if (
      !this.#poweredOff &&
      item &&
      (item as any)[this.vmPowerOnStateColumn] &&
      (item as any)[this.vmPowerOnStateColumn].indexOf('Powered Off') >= 0
    ) {
      return false;
    }

    return !(
      !this.#poweredOff &&
      item &&
      (item as any)[this.vmPowerOnStateColumn] &&
      (item as any)[this.vmPowerOnStateColumn].indexOf('Powered On') >= 0
    );
  }

  isActive(): boolean {
    return !this.#poweredOn || !this.#poweredOff;
  }
}

@NgModule({
  declarations: [PowerStateFilterComponent, RowDetailRendererComponent, StatusRendererComponent],
  imports: [ClrCheckboxModule, ClrIcon, CommonModule, FormsModule],
  exports: [PowerStateFilterComponent, RowDetailRendererComponent, StatusRendererComponent],
})
class TestModule {}

enum PowerState {
  off = 'Powered Off',
  on = 'Powered On',
}
