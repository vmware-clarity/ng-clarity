/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { A11yModule as CdkA11yModule } from '@angular/cdk/a11y';
import { CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, DebugElement, NgModule, SimpleChange, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
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
  ClrCheckboxModule,
  ClrDatagridComparatorInterface,
  ClrDatagridFilterInterface,
  ClrDatagridSortOrder,
  ClrDatagridStateInterface,
  ClrDatagridStringFilterInterface,
  ClrDatagridVirtualScrollRangeInterface,
  ClrIconModule,
  ClrInputModule,
  ClrSelectModule,
} from '@clr/angular';
import { Observable, Subject } from 'rxjs';

import { DatagridColumnsOrderModule } from './addons/column-ordering/datagrid-columns-order.module';
import { ExportProviderService } from './addons/export/export-provider.service';
import { ExportType } from './addons/export/export-type';
import { ClientSideExportConfig, ExportStatus } from './addons/export/export.interface';
import { DatagridComponent } from './datagrid.component';
import { AppfxDatagridModule } from './datagrid.module';
import { DatagridStrings } from './i18n/datagrid-strings.service';
import { ColumnSortOrder } from './interfaces/column-state';
import { SelectionType } from './interfaces/selection-type';
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
  beforeEach(function (this: any) {
    TestBed.configureTestingModule({
      imports: [
        ClrCheckboxModule,
        ClrInputModule,
        ClrSelectModule,
        FormsModule,
        NoopAnimationsModule,
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

    this.columnsDefs = [
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

    this.data = [
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

    this.actions = [
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

    this.fixture = TestBed.createComponent(DatagridHostComponent);
    this.component = this.fixture.componentInstance;
    this.dgStrings = TestBed.inject(DatagridStrings);
  });

  afterEach(function (this: any) {
    this.actions = null;
    this.columnsDefs = null;
    this.data = null;
    this.component.columnsDefs = null;
    this.component.data = null;
    this.component = null;
    this.fixture.destroy();
  });

  it('has the right columns', function (this: any) {
    this.component.columnsDefs = this.columnsDefs;
    this.fixture.detectChanges(false);
    const gridHelper = new GridHelper(this.fixture.debugElement);

    const headers = gridHelper.getHeaders();
    headers.forEach((columnName: string, index: number) => {
      expect(columnName).toEqual(this.columnsDefs[index].displayName);
    });

    const rows = gridHelper.getRows();
    expect(rows.length).toEqual(0);
  });

  it('emits change event when column definitions are set', function (this: any) {
    spyOn(this.component, 'onColumnDefsChange');
    this.component.columnsDefs = this.columnsDefs;
    this.fixture.detectChanges(false);
    expect(this.component.onColumnDefsChange).toHaveBeenCalledWith(this.columnsDefs);
  });

  it('emits change event when page size is set', function (this: any) {
    const pageSize = 10;
    spyOn(this.component, 'onPageSizeChange');
    this.component.appfxDatagridComponent.pageSize = pageSize;
    this.fixture.detectChanges(false);
    expect(this.component.onPageSizeChange).toHaveBeenCalledWith(pageSize);
  });

  it('has the right rows', function (this: any) {
    this.component.selectionType = SelectionType.None;
    this.component.columnsDefs = this.columnsDefs;
    this.component.data = this.data;
    this.fixture.detectChanges(true); // data received, update view

    const gridHelper = new GridHelper(this.fixture.debugElement);
    const rows = gridHelper.getRows();

    expect(rows.length).toEqual(this.data.length);

    rows.forEach((row: GridRowTestHelper, rowIndex: number) => {
      const expectedRow = this.data[rowIndex];
      for (const columnDef of this.columnsDefs) {
        expect(row.getCell(columnDef.displayName).getCellWrapperElement()?.textContent?.trim()).toEqual(
          expectedRow[columnDef.field]
        );
      }
    });
  });

  it('updates the grid cells in the grid rows when the grid data are changed and trackByProperty is specified', function (this: any) {
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
    this.component.trackByProperty = trackByPropertyPath.join(propSeparator);
    this.component.selectionType = SelectionType.None;
    this.component.columnsDefs = columns;
    this.component.data = this.data;

    this.fixture.detectChanges(true); // data received, update view

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

    this.component.data = newData;
    this.fixture.detectChanges(true);

    const gridHelper = new GridHelper(this.fixture.debugElement);
    const rows = gridHelper.getRows();

    expect(rows.length).toEqual(this.data.length);

    rows.forEach((row: GridRowTestHelper, rowIndex: number) => {
      const expectedRow = newData[rowIndex] as any;
      for (const columnDef of this.columnsDefs) {
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

  it('has correct placeholder text with default value', function (this: DatagridSpecContext) {
    this.component.selectionType = SelectionType.None;
    this.component.columnsDefs = this.columnsDefs;
    this.fixture.detectChanges(false); // data received, update view

    const gridHelper = new GridHelper(this.fixture.debugElement);
    const rows = gridHelper.getRows();

    expect(rows.length).toEqual(0);
    expect(gridHelper.getPlaceholder().getElement()).toBeTruthy();
    expect(gridHelper.getPlaceholder().getText()).toContain(this.dgStrings.noItemsFound);
  });

  it('has correct placeholder text with custom value', function (this: DatagridSpecContext) {
    this.component.selectionType = SelectionType.None;
    this.component.columnsDefs = this.columnsDefs;
    const customPlaceholderText = 'Custom no items found text';
    this.component.datagridLabels = {
      noItemsFound: customPlaceholderText,
    };
    this.fixture.detectChanges(false); // data received, update view
    const gridHelper = new GridHelper(this.fixture.debugElement);
    const rows = gridHelper.getRows();
    expect(rows.length).toEqual(0);
    expect(gridHelper.getPlaceholder().getElement()).toBeTruthy();
    expect(gridHelper.getPlaceholder().getText()).toContain(customPlaceholderText);
  });

  it('should project custom placeholder content when provided', function (this: DatagridSpecContext) {
    this.component.columnsDefs = this.columnsDefs;
    // Set empty data to show placeholder
    this.component.data = [];
    this.fixture.detectChanges();

    const gridHelper = new GridHelper(this.fixture.debugElement);
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

  it('has the right row details', function (this: any) {
    const allGridData = [...this.data];
    allGridData.push({
      status: 'Error',
      name: 'vm5',
      powerState: PowerState.off,
      rowDetailRenderer: RowDetailRendererComponent,
    });
    this.fixture.detectChanges();
    this.component.selectionType = SelectionType.None;
    this.component.columnsDefs = this.columnsDefs;
    this.component.data = allGridData;
    this.component.appfxDatagridComponent.rowDetailContent = undefined;
    this.fixture.detectChanges(false);

    const gridHelper = new GridHelper(this.fixture.debugElement);
    const rows = gridHelper.getRows();
    expect(rows.length).toEqual(allGridData.length);

    rows.forEach((row: GridRowTestHelper, rowIndex: number) => {
      const expectedRow = allGridData[rowIndex];
      for (const columnDef of this.columnsDefs) {
        expect(row.getCell(columnDef.displayName).getCellWrapperElement().textContent?.trim()).toEqual(
          expectedRow[columnDef.field]
        );
      }
      expect(row.isRowExpandable()).toEqual(!!expectedRow.rowDetailRenderer);
    });
  });

  it('updates data in an empty datagrid', function (this: any) {
    this.component.selectionType = SelectionType.None;
    this.component.columnsDefs = this.columnsDefs;
    this.fixture.detectChanges(false);
    const gridHelper = new GridHelper(this.fixture.debugElement);
    expect(gridHelper.getRows().length).toEqual(0);
    this.component.data = this.data;
    this.fixture.detectChanges();
    expect(gridHelper.getRows().length).toEqual(4);
  });

  it('updates data in a datagrid with virtual scrolling', function (this: any) {
    spyOn(this.component, 'refreshVirtualGridData');
    this.component.selectionType = SelectionType.None;
    this.component.columnsDefs = this.columnsDefs;
    this.component.virtualScrolling = true;
    this.component.trackByProperty = 'name';
    this.fixture.detectChanges(false);
    this.component.appfxDatagridComponent.renderedRangeChange({ start: 0, end: 10 });
    this.component.dataRange = { total: 5, skip: 0, data: this.data };
    this.fixture.detectChanges();
    expect(this.component.refreshVirtualGridData).toHaveBeenCalledWith({
      page: { from: 0, size: 10 },
    });
    expect(this.component.virtualScrolling).toEqual(true);
    expect(this.component.appfxDatagridComponent.dataRange).toEqual({
      total: 5,
      skip: 0,
      data: this.data,
    });
  });

  it('should render rows when serverDrivenDatagrid is true and virtualScrolling is false', function (this: any) {
    this.component.selectionType = SelectionType.None;
    this.component.columnsDefs = this.columnsDefs;
    this.component.data = this.data;
    this.component.serverDrivenDatagrid = true;
    this.component.virtualScrolling = false;
    this.fixture.detectChanges(true);

    const gridHelper = new GridHelper(this.fixture.debugElement);
    const rows = gridHelper.getRows();

    expect(rows.length).toEqual(this.data.length);

    rows.forEach((row: GridRowTestHelper, rowIndex: number) => {
      const expectedRow = this.data[rowIndex];
      for (const columnDef of this.columnsDefs) {
        expect(row.getCell(columnDef.displayName).getCellWrapperElement().textContent?.trim()).toEqual(
          expectedRow[columnDef.field]
        );
      }
    });
  });

  it('can render cell data with the help of column renderer', function (this: any) {
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

    this.component.columnsDefs = testColumnsDefs;
    this.component.data = this.data;
    this.fixture.detectChanges(false);

    const subjectColumnIndex = this.component.appfxDatagridComponent.visibleColumns.findIndex(
      (col: ColumnDefinition<any>) => col === subjectColumnDefinition
    );
    const gridHelper = new GridHelper(this.fixture.debugElement);
    const rows = gridHelper.getRows();

    expect(rows.length).toEqual(this.data.length);

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

    beforeEach(function (this: UidSpecContext) {
      this.uid = (this.component.appfxDatagridComponent as any).uid;
    });

    it('is used by buildRowDetailContentId', function (this: UidSpecContext) {
      expect(this.component.appfxDatagridComponent.buildRowDetailContentId(123)).toContain(this.uid);
    });
  });

  describe('column', () => {
    describe('sort', () => {
      describe('WHEN sortComparator is passed to one of the columns', function () {
        beforeEach(function (this: any) {
          this.component.selectionType = SelectionType.Multi;
          this.component.columnsDefs = this.columnsDefs;
          this.component.data = this.data;

          this.fixture.detectChanges(false);
        });

        it('that column is sortable and others columns are not sortable', function (this: any) {
          const gridHelper = new GridHelper(this.fixture.debugElement);
          expect(gridHelper.isColumnSortable(this.columnsDefs[0].displayName)).toBeFalsy();
          expect(gridHelper.isColumnSortable(this.columnsDefs[1].displayName)).toBeFalsy();
          expect(gridHelper.isColumnSortable(this.columnsDefs[2].displayName)).toBeTruthy();
        });

        it('can sort by column using the defined sortComparator', function (this: any) {
          const states: string[] = ['unknown', 'green', 'green', 'red']; // missing data value placed upfront for ascending
          const sortByColumnField = 'status';
          const subjectColumnDefinition = this.columnsDefs.find(
            (col: ColumnDefinition<any>) => col.field === sortByColumnField
          );
          const subjectColumnIndex = this.columnsDefs.findIndex(
            (col: ColumnDefinition<any>) => col === subjectColumnDefinition
          );
          const gridHelper = new GridHelper(this.fixture.debugElement);

          // ascending sorted status column
          gridHelper.sortByColumnIndex(subjectColumnIndex);
          this.fixture.detectChanges(false);

          gridHelper.getRows().forEach((row: GridRowTestHelper, rowIndex: number) => {
            expect(row.getCellAt(subjectColumnIndex).getCellWrapperElement().textContent?.trim()).toEqual(
              states[rowIndex]
            );
          });

          // descending sorted status column
          spyOn(subjectColumnDefinition.sortComparator, 'compare').and.callThrough();
          gridHelper.sortByColumnIndex(subjectColumnIndex);
          this.fixture.detectChanges();

          gridHelper.getRows().forEach((row: GridRowTestHelper, rowIndex: number) => {
            expect(row.getCellAt(subjectColumnIndex).getCellWrapperElement().textContent?.trim()).toEqual(
              states[states.length - rowIndex - 1]
            );
          });
        });

        it('column sort order change is emitted when sort by column', function (this: any) {
          const gridHelper = new GridHelper(this.fixture.debugElement);
          spyOn(this.component, 'columnSortOrderChange');
          gridHelper.sortByColumn(this.columnsDefs[2].displayName);
          this.fixture.detectChanges(false);
          const expectedColumnSortOrdeChange: ColumnSortOrder = {
            sortOrder: ClrDatagridSortOrder.ASC,
            column: this.columnsDefs[2],
          };
          expect(this.component.columnSortOrderChange).toHaveBeenCalledWith(expectedColumnSortOrdeChange);
          expect(this.columnsDefs[2].defaultSortOrder).toEqual(ClrDatagridSortOrder.ASC);
          expect(this.columnsDefs[0].defaultSortOrder).toEqual(ClrDatagridSortOrder.UNSORTED);
          expect(this.columnsDefs[1].defaultSortOrder).toEqual(ClrDatagridSortOrder.UNSORTED);
        });
      });

      describe('WHEN sortAndFilterByField is passed to one of the columns', function () {
        beforeEach(function (this: any) {
          this.columnsDefs = [
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
          this.component.selectionType = SelectionType.Multi;
          this.component.columnsDefs = this.columnsDefs;
          this.component.data = this.data;

          this.fixture.detectChanges(false);
        });

        it('that column is sortable and others columns are not sortable', function (this: any) {
          const gridHelper = new GridHelper(this.fixture.debugElement);
          expect(gridHelper.isColumnSortable(this.columnsDefs[0].displayName)).toBeTruthy();
          expect(gridHelper.isColumnSortable(this.columnsDefs[1].displayName)).toBeFalsy();
          expect(gridHelper.isColumnSortable(this.columnsDefs[2].displayName)).toBeFalsy();
        });

        it('can sort the column alphabetically', function (this: any) {
          const states: string[] = ['vm0', 'vm1', 'vm2', 'vm3'];
          const subjectColumnIndex = 0;
          const gridHelper = new GridHelper(this.fixture.debugElement);

          // ascending sorted status column
          gridHelper.sortByColumnIndex(subjectColumnIndex);
          this.fixture.detectChanges(false);

          gridHelper.getRows().forEach((row: GridRowTestHelper, rowIndex: number) => {
            expect(row.getCellAt(subjectColumnIndex).getCellWrapperElement().textContent?.trim()).toEqual(
              states[rowIndex]
            );
          });

          // descending sorted status column
          gridHelper.sortByColumnIndex(subjectColumnIndex);
          this.fixture.detectChanges();

          gridHelper.getRows().forEach((row: GridRowTestHelper, rowIndex: number) => {
            expect(row.getCellAt(subjectColumnIndex).getCellWrapperElement().textContent?.trim()).toEqual(
              states[states.length - rowIndex - 1]
            );
          });
        });

        it('column sort order change is emitted when sort by column', function (this: any) {
          const gridHelper = new GridHelper(this.fixture.debugElement);
          spyOn(this.component, 'columnSortOrderChange');
          gridHelper.sortByColumn(this.columnsDefs[0].displayName);
          this.fixture.detectChanges(false);
          const expectedColumnSortOrdeChange: ColumnSortOrder = {
            sortOrder: 1,
            column: this.columnsDefs[0],
          };
          expect(this.component.columnSortOrderChange).toHaveBeenCalledWith(expectedColumnSortOrdeChange);
        });
      });
    });

    describe('hide', () => {
      beforeEach(function (this: any) {
        this.columnsDefs = [
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
        this.component.columnsDefs = this.columnsDefs;
        this.component.data = this.data;
        this.fixture.detectChanges(false);
        this.fixture.detectChanges();
        this.hiddenColumns = () => {
          return this.component.appfxDatagridComponent.columns
            .filter((column: ColumnDefinition<any>) => column.hidden === true)
            .map((column: ColumnDefinition<any>) => column.displayName);
        };
      });

      it('allows creation of grid with hidden columns', function (this: any) {
        const gridHelper = new GridHelper(this.fixture.debugElement);
        const hiddenHeaders: string[] = this.hiddenColumns();
        expect(hiddenHeaders.length).toEqual(1);
        expect(hiddenHeaders[0]).toEqual(this.columnsDefs[2].displayName);
        const row: GridRowTestHelper = gridHelper.getRows()[0];
        expect(row.getElement().querySelectorAll('clr-dg-cell.datagrid-cell').length).toEqual(3);
      });

      it('allows hide of column', function (this: any) {
        const gridHelper = new GridHelper(this.fixture.debugElement);

        let hiddenHeaders: string[] = this.hiddenColumns();
        expect(hiddenHeaders.length).toEqual(1);

        gridHelper.getFooter().openShowHideColumnsMenu();
        this.fixture.detectChanges();
        gridHelper.getFooter().clickShowHideColumnsItem(this.columnsDefs[2].displayName);
        this.fixture.detectChanges();
        hiddenHeaders = this.hiddenColumns();
        expect(hiddenHeaders.length).toEqual(0);
        const row: GridRowTestHelper = gridHelper.getRows()[0];
        expect(row.getElement().querySelectorAll('clr-dg-cell.datagrid-cell').length).toEqual(4);
      });

      it("doesn't allow hiding non-hideable column", function (this: any) {
        const gridHelper = new GridHelper(this.fixture.debugElement);
        gridHelper.getFooter().openShowHideColumnsMenu();
        this.fixture.detectChanges();
        const showHideColumnsItem = gridHelper
          .getFooter()
          .findShowHideColumnsItemByName(this.columnsDefs[0].displayName);
        expect(showHideColumnsItem).toBeNull();
      });

      it('column hidden state change is emitted when show column', function (this: any) {
        const gridHelper = new GridHelper(this.fixture.debugElement);
        spyOn(this.component, 'onColumnHiddenStateChange');
        gridHelper.getFooter().openShowHideColumnsMenu();
        this.fixture.detectChanges();

        gridHelper.getFooter().clickShowHideColumnsItem(this.columnsDefs[2].displayName);
        expect(this.component.onColumnHiddenStateChange).toHaveBeenCalledWith({
          hidden: false,
          column: this.columnsDefs[2],
        });
      });
    });

    describe('filter', () => {
      describe('WHEN filter property is passed to a column', function () {
        beforeEach(function (this: any) {
          this.component.columnsDefs = [
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
          this.component.data = this.data;
          this.fixture.detectChanges(false);
        });

        it('allows filtering', function (this: any) {
          const gridHelper = new GridHelper(this.fixture.debugElement);
          gridHelper.openFilter('Name');
          spyOn(this.component, 'onColumnFilterChange').and.callThrough();
          this.fixture.detectChanges();
          const filterInput: FilterInputTestHelper = gridHelper.getFilterInput();
          filterInput.inputText('vm1', 'keyup');
          this.fixture.detectChanges();
          expect(gridHelper.getRows().length).toBe(1);
          expect(this.component.onColumnFilterChange).toHaveBeenCalledWith({
            filterValue: 'vm1',
            column: this.component.columnsDefs[0],
          });
          gridHelper.closeFilter();
          this.fixture.detectChanges();
        });

        it('can use custom filter ', function (this: any) {
          const gridHelper = new GridHelper(this.fixture.debugElement);
          gridHelper.openFilter('Status');
          this.fixture.detectChanges();
          expect(
            document.body.querySelectorAll('.clr-popover-content appfx-dg-filter-container custom-power-state-filter')
              .length
          ).toEqual(1);
          gridHelper.closeFilter();
          this.fixture.detectChanges();
        });
      });

      describe('WHEN sortAndFilterByField property is passed to a column', function () {
        beforeEach(function (this: any) {
          this.columnsDefs = [
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
          this.component.columnsDefs = this.columnsDefs;
          this.component.data = this.data;
          this.fixture.detectChanges(false);
        });

        it('allows filtering by that column', function (this: any) {
          const gridHelper = new GridHelper(this.fixture.debugElement);
          gridHelper.openFilter('Name');
          this.fixture.detectChanges();
          const filterInput: FilterInputTestHelper = gridHelper.getFilterInput();
          filterInput.inputText('vm2', 'keyup');
          this.fixture.detectChanges();

          expect(gridHelper.getRows().length).toBe(1);
          expect(gridHelper.getRows()[0].getCellAt(0).getText()).toEqual('vm2');

          gridHelper.closeFilter();
          this.fixture.detectChanges();
        });
      });
    });

    describe('reorder', () => {
      beforeEach(function (this: any) {
        this.component.selectionType = SelectionType.Single;
        this.component.columnsDefs = [
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
        this.component.data = this.data;
        this.fixture.detectChanges(false);
      });

      it('with drag and drop', function (this: any) {
        let gridHelper = new GridHelper(this.fixture.debugElement);
        expect(gridHelper.getHeaders()[0]).toEqual('Name');
        expect(gridHelper.getHeaders()[1]).toEqual('State');
        expect(gridHelper.getHeaders()[2]).toEqual('Status');
        const hostElement = this.fixture.debugElement.query(By.directive(CdkDropList));
        const cdkDropList = hostElement.injector.get(CdkDropList);
        //Move first column after the last on
        const newColumnIndex = cdkDropList.getSortedItems().findIndex((item: any) => {
          return item.data === this.component.columnsDefs[2];
        });
        const droppedData = {
          item: {
            data: this.component.columnsDefs[0],
          },
          currentIndex: newColumnIndex,
        };
        cdkDropList.dropped.next(droppedData);
        this.fixture.detectChanges();

        gridHelper = new GridHelper(this.fixture.debugElement);
        expect(gridHelper.getHeaders()[0]).toEqual('State');
        expect(gridHelper.getHeaders()[1]).toEqual('Status');
        expect(gridHelper.getHeaders()[2]).toEqual('Name');
      });

      it('emits reorder change event', function (this: any) {
        spyOn(this.component, 'onColumnOrderChange');
        const hostElement = this.fixture.debugElement.query(By.directive(CdkDropList));
        const cdkDropList = hostElement.injector.get(CdkDropList);
        const newColumnIndex = cdkDropList.getSortedItems().findIndex((item: any) => {
          return item.data === this.component.columnsDefs[2];
        });
        const droppedData = {
          item: {
            data: this.component.columnsDefs[0],
          },
          currentIndex: newColumnIndex,
        };
        cdkDropList.dropped.next(droppedData);
        this.fixture.detectChanges();
        expect(this.component.onColumnOrderChange).toHaveBeenCalledWith({
          previousIndex: 0,
          currentIndex: 2,
          columns: [this.component.columnsDefs[1], this.component.columnsDefs[2], this.component.columnsDefs[0]],
        });
      });
    });
  });

  describe('drag drop rows', () => {
    beforeEach(function (this: any) {
      this.component.columnsDefs = this.columnsDefs;
      this.component.data = this.data;
      this.component.isRowSelectionMode = true;
    });

    it('able to get dragged rows', function (this: any) {
      const dataGridComponent = this.component.appfxDatagridComponent;
      const firstRow = this.data[0];
      dataGridComponent.selectedItems = [this.data[0]];
      dataGridComponent.setDraggedItems(firstRow);
      expect(dataGridComponent.draggedItems.length).toEqual(1);
      dataGridComponent.selectedItems = [this.data[0], this.data[1]];
      dataGridComponent.setDraggedItems(firstRow);
      expect(dataGridComponent.draggedItems.length).toEqual(2);
      dataGridComponent.setDraggedItems(this.data[2]);
      expect(dataGridComponent.draggedItems.length).toEqual(1);
    });
  });

  describe('#dropGroup', () => {
    it('should call getGroupItems', function (this: any) {
      const groupService = TestBed.inject(DragAndDropGroupService);
      const mockGroupItems = ['first-element', 'second-element'] as unknown[] as CdkDropList[];
      const mockGroupId = 'inventory';
      spyOn(groupService, 'getGroupItems').and.returnValue(mockGroupItems);

      const result = this.component.appfxDatagridComponent.dropGroup(mockGroupId);
      expect(result).toEqual(mockGroupItems);
      expect(groupService.getGroupItems).toHaveBeenCalledWith(mockGroupId);
    });
  });

  describe('is row locked', () => {
    beforeEach(function (this: any) {
      this.component.data = this.data;
      this.component.isRowSelectionMode = true;
    });

    it('when returns false', fakeAsync(function (this: any) {
      spyOn(this.component, 'isRowLocked').and.returnValue(false);
      this.fixture.detectChanges(false);
      tick();

      const gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getSelectedRows().length).toBe(0);

      gridHelper.getRows()[0].click();
      this.fixture.detectChanges(false);

      expect(gridHelper.getSelectedRows().length).toBe(1);
      expect(gridHelper.getRows()[0].isSelected()).toBeTruthy();
      expect(this.component.isRowLocked).toHaveBeenCalledWith(this.data[0]);
    }));

    it('when returns true', fakeAsync(function (this: any) {
      spyOn(this.component, 'isRowLocked').and.returnValue(true);
      this.fixture.detectChanges(false);
      tick();

      const gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getSelectedRows().length).toBe(0);

      gridHelper.getRows()[0].click();
      this.fixture.detectChanges(false);

      expect(gridHelper.getRows()[0].isSelectionDisabled).toBeTruthy();
      expect(gridHelper.getRows()[1].isSelectionDisabled).toBeTruthy();
      expect(gridHelper.getRows()[2].isSelectionDisabled).toBeTruthy();
      expect(gridHelper.getRows()[3].isSelectionDisabled).toBeTruthy();
      expect(this.component.isRowLocked).toHaveBeenCalledWith(this.data[0]);
    }));
  });

  describe('Single-selection mode', () => {
    beforeEach(function (this: any) {
      this.component.columnsDefs = this.columnsDefs;
      this.component.data = this.data;
      this.component.isRowSelectionMode = true;
      this.component.appfxDatagridComponent.ngOnInit();
    });

    it('is set by default', function (this: any) {
      this.fixture.detectChanges(false);

      const gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getSelectedRows().length).toBe(0);

      spyOn(this.component, 'changeSelection');
      gridHelper.getRows()[0].click();

      this.fixture.detectChanges(false);

      expect(gridHelper.getSelectedRows().length).toBe(1);

      expect(gridHelper.getRows()[0].isSelected()).toBeTruthy();
      expect(this.component.changeSelection).toHaveBeenCalledWith([this.data[0]]);
      gridHelper.getRows()[2].click();
      this.fixture.detectChanges();

      expect(gridHelper.getRows()[2].isSelected()).toBeTruthy();
      expect(gridHelper.getSelectedRows().length).toBe(1);
    });

    it('let the user to select only one item', fakeAsync(function (this: any) {
      this.fixture.detectChanges(false);
      tick();
      this.fixture.detectChanges();
      spyOn(this.component, 'changeSelection');
      const gridHelper = new GridHelper(this.fixture.debugElement);
      gridHelper.getRows()[0].click();
      tick();
      this.fixture.detectChanges();
      expect(gridHelper.getRows()[0].isSelected()).toBeTruthy();
      expect(gridHelper.getSelectedRows().length).toBe(1);
      expect(this.component.changeSelection).toHaveBeenCalledWith([this.data[0]]);

      gridHelper.getRows()[2].click();
      tick();
      this.fixture.detectChanges();
      expect(gridHelper.getSelectedRows().length).toBe(1);
      expect(gridHelper.getRows()[2].isSelected()).toBeTruthy();
      expect(this.component.changeSelection).toHaveBeenCalledWith([this.data[0]]);
    }));

    it('can be changed to multi-selection mode and reset to single selection mode', fakeAsync(function (this: any) {
      this.fixture.detectChanges(false);
      tick();
      this.fixture.detectChanges();

      const gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getRows()[2].isRowSingleSelectable()).toBeTruthy();

      this.component.appfxDatagridComponent.selectionType = SelectionType.None;
      this.component.appfxDatagridComponent.onModelChange();
      tick();
      this.fixture.detectChanges();
      expect(gridHelper.getRows()[2].isRowSingleSelectable()).toBeFalsy();

      this.component.appfxDatagridComponent.selectionType = SelectionType.Multi;
      tick();
      this.component.appfxDatagridComponent.onModelChange();
      this.fixture.detectChanges();
      expect(gridHelper.getRows()[2].isRowSingleSelectable()).toBeFalsy();

      gridHelper.getRows()[2].click();
      tick();
      this.fixture.detectChanges();
      expect(gridHelper.getRows()[2].isSelected()).toBeTruthy();
      gridHelper.getRows()[1].click();
      tick();
      this.fixture.detectChanges();
      expect(gridHelper.getSelectedRows().length).toBe(2);
      this.component.appfxDatagridComponent.selectionType = SelectionType.Single;
      this.component.appfxDatagridComponent.onModelChange();
      tick();
      this.fixture.detectChanges();
      expect(gridHelper.getRows()[2].isRowSingleSelectable()).toBeTruthy();
    }));

    it('allows selected items to be changed from the host component', fakeAsync(function (this: any) {
      this.component.appfxDatagridComponent.selectionType = SelectionType.Single;

      this.fixture.detectChanges(false);
      tick();
      this.fixture.detectChanges();
      const gridHelper = new GridHelper(this.fixture.debugElement);
      gridHelper.getRows()[0].click();
      tick();
      this.fixture.detectChanges();
      expect(gridHelper.getRows()[0].isSelected()).toBeTruthy();

      this.component.appfxDatagridComponent.selectedItems = [this.data[3]];
      tick();
      this.fixture.detectChanges();
      expect(gridHelper.getRows()[3].isSelected()).toBeTruthy();
      expect(gridHelper.getRows()[0].isSelected()).toBeFalsy();
    }));

    it('let the user to select the first item when pre-select first item flag is enabled', function (this: any) {
      this.component.appfxDatagridComponent.preSelectFirstItem = true;
      this.fixture.detectChanges(false);

      const gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getRows()[0].isSelected()).toBeTruthy();
    });
  });

  describe('None selection mode', () => {
    beforeEach(function (this: any) {
      this.component.columnsDefs = this.columnsDefs;
      this.component.data = this.data;
      this.component.appfxDatagridComponent.ngOnInit();
    });

    it('the user can not select an item', fakeAsync(function (this: DatagridSpecContext) {
      this.fixture.detectChanges(false);
      tick();
      this.fixture.detectChanges();

      const gridHelper = new GridHelper(this.fixture.debugElement);
      gridHelper.getRows()[0].click();
      tick();
      this.fixture.detectChanges();
      expect(gridHelper.getRows()[0].isSelected()).toBeTruthy();
      expect(gridHelper.getSelectedRows().length).toBe(1);

      this.component.appfxDatagridComponent.selectionType = SelectionType.None;
      this.component.appfxDatagridComponent.onModelChange();
      tick();
      this.fixture.detectChanges();
      spyOn(this.component, 'changeSelection');
      expect(gridHelper.getRows()[2].isRowSingleSelectable()).toBeFalsy();

      const rows = gridHelper.getRows();
      expect(rows.length).toBeGreaterThan(0);
      rows.forEach((row, i) => {
        expect(row.isRowClickable()).toBeFalsy(`Row ${i} should not be clickable`);
        expect(row.isSelectionAvailable()).toBeFalsy(`Row ${i} should not have selection available`);
      });
      expect(this.component.changeSelection).not.toHaveBeenCalled();
    }));
  });

  describe('Multi-selection mode', () => {
    beforeEach(function (this: any) {
      // required to execute the async callbacks in Clarity's Datagrid component
      jasmine.clock().uninstall();
      jasmine.clock().install();
      this.component.selectionType = SelectionType.Multi;
      this.component.columnsDefs = this.columnsDefs;
      this.component.data = this.data;
      this.component.appfxDatagridComponent.ngOnInit();
      this.fixture.detectChanges(false);
      jasmine.clock().tick(10);
      this.fixture.detectChanges();
      this.component.appfxDatagridComponent.selectedItems = []; // reset
      this.fixture.detectChanges(false);
      jasmine.clock().tick(10);
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('let the user to select several items', function (this: any) {
      const gridHelper = new GridHelper(this.fixture.debugElement);
      gridHelper.getRows()[0].click();

      jasmine.clock().tick(10);
      this.fixture.detectChanges(false);
      expect(gridHelper.getSelectedRows().length).toBe(1);
      spyOn(this.component, 'changeSelection');
      gridHelper.getRows()[2].click();
      jasmine.clock().tick(10);
      this.fixture.detectChanges();
      jasmine.clock().tick(10);
      expect(gridHelper.getSelectedRows().length).toBe(2);
      expect(gridHelper.getRows()[0].isSelected()).toBeTruthy();
      expect(gridHelper.getRows()[2].isSelected()).toBeTruthy();
      expect(this.component.changeSelection).toHaveBeenCalledWith([this.data[0], this.data[2]]);
    });

    it('selected items can be changed from the host component', function (this: any) {
      const gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getSelectedRows().length).toBe(0);

      this.component.appfxDatagridComponent.selectedItems = [this.data[3], this.data[2]];
      this.fixture.detectChanges();

      expect(gridHelper.getSelectedRows().length).toBe(2);
      expect(gridHelper.getRows()[3].isSelected()).toBeTruthy();
      expect(gridHelper.getRows()[2].isSelected()).toBeTruthy();
    });

    it('should set selected items to empty array when selectedItems is undefined', function (this: any) {
      const gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getSelectedRows().length).toBe(0);

      this.component.appfxDatagridComponent.selectedItems = undefined;
      this.fixture.detectChanges();

      expect(gridHelper.getSelectedRows().length).toBe(0);
      expect(gridHelper.getRows()[3].isSelected()).toBeFalsy();
      expect(gridHelper.getRows()[2].isSelected()).toBeFalsy();
    });

    it('should set selected items to empty array when selectedItems is array of undefined', function (this: any) {
      const gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getSelectedRows().length).toBe(0);

      this.component.appfxDatagridComponent.selectedItems = [undefined];
      this.fixture.detectChanges();

      expect(gridHelper.getSelectedRows().length).toBe(0);
      expect(gridHelper.getRows()[3].isSelected()).toBeFalsy();
      expect(gridHelper.getRows()[2].isSelected()).toBeFalsy();
    });

    it('should deselect all items on "Deselect All" button click', function (this: any) {
      const gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getSelectedRows().length).toBe(0);

      this.component.appfxDatagridComponent.selectedItems = [this.data[3], this.data[2]];
      this.fixture.detectChanges();
      expect(gridHelper.getSelectedRows().length).toBe(2);
      this.component.appfxDatagridComponent.onDeselectAllClick();
      expect(gridHelper.getSelectedRows().length).toBe(0);
    });

    it('`Select All` checkbox selects/deselects all rows in virtual datagrid', function (this: any) {
      this.component.columnsDefs = this.columnsDefs;
      this.component.virtualScrolling = true;
      this.component.trackByProperty = 'name';
      this.component.dataRange = { total: 5, skip: 0, data: this.data };

      jasmine.clock().tick(10);
      this.fixture.detectChanges();
      spyOn(this.component, 'changeSelection');
      const gridHelper = new GridHelper(this.fixture.debugElement);
      //Select All
      gridHelper.getSelectAllElement()?.click();
      expect(this.component.appfxDatagridComponent.selectedItems.length).toBe(4);
      expect(gridHelper.getSelectedRows().length).toBe(4);
      expect(this.component.changeSelection).toHaveBeenCalledWith(this.data);
      // Deselect All
      gridHelper.getSelectAllElement()?.click();
      expect(gridHelper.getSelectedRows().length).toBe(0);
      expect(this.component.changeSelection).toHaveBeenCalledWith([]);
    });
  });

  describe('Row selection mode', () => {
    beforeEach(function (this: any) {
      this.component.columnsDefs = this.columnsDefs;
      this.component.data = this.data;
      this.component.appfxDatagridComponent.ngOnInit();
    });

    it('is set by default', fakeAsync(function (this: any) {
      this.fixture.detectChanges(false);
      tick();
      this.fixture.detectChanges();
      expect(this.component.appfxDatagridComponent.rowSelectionMode).toBeTruthy();
      const gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getSelectedRows().length).toBe(0);
      gridHelper.getRows()[0].click();
      tick();
      this.fixture.detectChanges();
      expect(gridHelper.getSelectedRows().length).toBe(1);
    }));

    it('can be disabled', fakeAsync(function (this: DatagridSpecContext) {
      const detectChanges = () => {
        tick();
        this.fixture.detectChanges();
      };

      const gridHelper = new GridHelper(this.fixture.debugElement);

      this.component.appfxDatagridComponent.selectionType = SelectionType.Single;
      this.component.appfxDatagridComponent.rowSelectionMode = true;
      detectChanges();

      expect(gridHelper.getRows()[0].isRowClickable()).toEqual(true);
      expect(gridHelper.getSelectedRows().length).toBe(0);

      this.component.appfxDatagridComponent.rowSelectionMode = false;
      detectChanges();

      expect(gridHelper.getRows()[0].isRowClickable()).toEqual(false);
      expect(gridHelper.getSelectedRows().length).toBe(0);

      gridHelper.getRows()[0].select();

      detectChanges();
      expect(gridHelper.getSelectedRows().length).toBe(1);
    }));
  });

  describe('Actions', () => {
    beforeEach(function (this: any) {
      this.component.columnsDefs = this.columnsDefs;
      this.component.data = this.data;
    });

    it('allows creation of datagrid with rows actions', function (this: any) {
      const simpleChange: SimpleChanges = {
        singleRowActions: new SimpleChange(undefined, this.actions, true),
      };

      this.component.appfxDatagridComponent.selectionType = SelectionType.None;
      this.component.appfxDatagridComponent.singleRowActions = this.actions;
      this.component.appfxDatagridComponent.ngOnChanges(simpleChange);
      spyOn(this.component, 'onRowActionOverflowOpen');
      spyOn(this.component, 'onActionClick');
      this.component.appfxDatagridComponent.onModelChange();

      this.fixture.detectChanges(false);
      const gridHelper = new GridHelper(this.fixture.debugElement);
      const gridElement: HTMLElement = gridHelper.getRows()[1].getSingleRowActionMenuButton();
      gridElement.click();
      this.fixture.detectChanges();
      gridHelper.getRows()[1].clickOnSingleRowActionMenuItem('Delete');
      expect(this.component.onRowActionOverflowOpen).toHaveBeenCalledWith({
        open: true,
        actions: this.actions,
        context: this.data[1],
      });
      expect(this.component.onActionClick).toHaveBeenCalledWith({
        action: this.actions[1],
        context: this.data[1],
      });
    });

    it('allows creation of a datagrid with action bar', function (this: any) {
      this.component.appfxDatagridComponent.actionBarActions = this.actions;
      spyOn(this.component, 'onActionClick');
      this.component.appfxDatagridComponent.ngOnInit();
      this.fixture.detectChanges(false);
      const gridHelper = new GridHelper(this.fixture.debugElement);
      gridHelper.clickActionBarButton(this.actions[2].label);
      expect(this.component.onActionClick).toHaveBeenCalledWith({
        action: this.actions[2],
        context: [],
      });
    });
  });

  describe('Footer', () => {
    it('is visible by default', function (this: any) {
      this.component.columnsDefs = this.columnsDefs;
      this.component.data = this.data;

      this.fixture.detectChanges(false);
      const gridFooter = new GridHelper(this.fixture.debugElement).getFooter();
      expect(gridFooter.getFooterText()).toContain('4 items');
    });

    it('can be by hide', function (this: any) {
      this.component.columnsDefs = this.columnsDefs;
      this.component.data = this.data;
      this.component.appfxDatagridComponent.footerModel = {
        showFooter: false,
      };

      this.fixture.detectChanges(false);
      const gridFooter = new GridHelper(this.fixture.debugElement).getFooter();
      expect(gridFooter.getElement()).toBeNull();
    });

    it('supports pagination', function (this: DatagridSpecContext) {
      const allGridData = [...this.data];
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
      this.component.columnsDefs = this.columnsDefs;
      this.component.data = allGridData;
      this.component.appfxDatagridComponent.pageSize = 2;
      this.component.appfxDatagridComponent.totalItems = 6;

      this.fixture.detectChanges(false);
      const gridHelper = new GridHelper(this.fixture.debugElement);
      const footerText: string = gridHelper.getFooter().getFooterText();
      expect(footerText).toContain('1 - 2 of 6 items');
      let rows: GridRowTestHelper[] = gridHelper.getRows();
      expect(rows.length).toEqual(2);

      rows.forEach((row: GridRowTestHelper, rowIndex: number) => {
        for (const columnDef of this.columnsDefs) {
          const expectedRow: any = this.data[rowIndex];
          const subjectColumnIndex = this.columnsDefs.findIndex((col: ColumnDefinition<any>) => col === columnDef);
          expect(row.getCellAt(subjectColumnIndex).getCellWrapperElement().textContent?.trim()).toEqual(
            expectedRow[columnDef.field]
          );
        }
      });

      spyOn(this.component, 'refreshGridData');
      gridHelper.getFooter().clickNextPaginationButton();
      this.fixture.detectChanges();
      rows = gridHelper.getRows();
      expect(rows.length).toEqual(2);

      rows.forEach((row: GridRowTestHelper, rowIndex: number) => {
        for (const columnDef of this.columnsDefs) {
          const expectedRow: any = this.data[rowIndex + 2];
          const subjectColumnIndex = this.columnsDefs.findIndex((col: ColumnDefinition<any>) => col === columnDef);
          expect(row.getCellAt(subjectColumnIndex).getCellWrapperElement().textContent?.trim()).toEqual(
            expectedRow[columnDef.field]
          );
        }
      });

      expect(this.component.refreshGridData).toHaveBeenCalledWith({
        page: { from: 2, to: 3, size: 2, current: 2 },
      });
    });

    it('can hide column toggle', function (this: any) {
      this.component.columnsDefs = this.columnsDefs;
      this.component.appfxDatagridComponent.footerModel = {
        hideColumnToggle: true,
      };

      this.fixture.detectChanges();
      const gridHelper = new GridHelper(this.fixture.debugElement);

      // Verify that column headers are still properly rendered.
      const headers = gridHelper.getHeaders();
      headers.forEach((columnName: string, index: number) => {
        expect(columnName).toEqual(this.columnsDefs[index].displayName);
      });

      const rows = gridHelper.getRows();
      expect(rows.length).toEqual(0);

      const gridFooter = gridHelper.getFooter();
      expect(gridFooter.getElement().querySelector('clr-dg-column-toggle')).toBeNull();
    });

    it('shows correct items count', function (this: any) {
      const allGridData = [...this.data];
      this.component.appfxDatagridComponent.getFooterMessage = (totalItems: number): string => {
        return 'items ' + totalItems;
      };
      this.component.columnsDefs = this.columnsDefs;
      this.component.data = allGridData;

      this.fixture.detectChanges();
      const gridHelper = new GridHelper(this.fixture.debugElement);

      const rows = gridHelper.getRows();
      expect(rows.length).toEqual(4);

      const gridFooter = gridHelper.getFooter();
      expect(gridFooter.getElement().textContent).toContain('items ' + 4);
      this.component.data = this.data.slice(1);
      this.fixture.detectChanges();
      expect(gridHelper.getFooter().getElement().textContent).toContain('items ' + 3);
    });

    it('shows 1 item if one item', function (this: any) {
      this.component.virtualScrolling = true;
      this.fixture.detectChanges();
      let footerMessage = this.component.appfxDatagridComponent.getFooterMessage(1, undefined, 1, 1);
      expect(footerMessage).toEqual(this.dgStrings.singleItem);
      this.component.virtualScrolling = false;
      this.fixture.detectChanges();
      footerMessage = this.component.appfxDatagridComponent.getFooterMessage(1, undefined, 1, 1);
      expect(footerMessage).toEqual(this.dgStrings.singleItem);
    });

    it('shows loaded range of records', function (this: any) {
      this.component.virtualScrolling = true;
      this.fixture.detectChanges();
      // shows range when virtual scrolling is enabled
      let footerMessage = this.component.appfxDatagridComponent.getFooterMessage(640, undefined, 66, 109);
      expect(footerMessage).toEqual('66 - 109 of 640 items');
      // shows total count when virtual scrolling is enabled and loaded items are less than total count
      footerMessage = this.component.appfxDatagridComponent.getFooterMessage(44, undefined, 66, 109);
      expect(footerMessage).toEqual('44 items');

      this.component.virtualScrolling = false;
      this.fixture.detectChanges();
      // shows range when page size is set
      footerMessage = this.component.appfxDatagridComponent.getFooterMessage(640, 20, 66, 109);
      expect(footerMessage).toEqual('66 - 109 of 640 items');
      // shows total count when page size is not set
      footerMessage = this.component.appfxDatagridComponent.getFooterMessage(640, undefined, 66, 109);
      expect(footerMessage).toEqual('640 items');
    });

    it('should have custom footer text when datagridLabels.footer is set', function (this: any) {
      this.fixture.detectChanges();
      const gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getFooter().getFooterText()).toContain('items');
      const customFooterText = 'Apples';
      this.component.datagridLabels = {
        footer: customFooterText,
      };
      this.fixture.detectChanges();
      expect(gridHelper.getFooter().getFooterText()).toContain(customFooterText);
    });

    it('should emit exportDataEvent if footerModel.enableCustomExport is true', function (this: any) {
      this.component.appfxDatagridComponent.footerModel = {
        enableCustomExport: true,
      };
      spyOn(this.component, 'onExportDataEvent');
      const mockStatus: ExportStatus = {
        inProgress: false,
        exportType: ExportType.ALL,
      };
      this.component.appfxDatagridComponent.onExportEvent(mockStatus);
      expect(this.component.onExportDataEvent).toHaveBeenCalledWith(mockStatus);
    });

    it('should emit exportDataEvent if footerModel.clientSideExportConfig.customExport is true', function (this: any) {
      this.component.appfxDatagridComponent.footerModel = {
        clientSideExportConfig: {
          customExport: true,
        },
      };
      spyOn(this.component, 'onExportDataEvent');

      const mockStatus: ExportStatus = {
        inProgress: false,
        exportType: ExportType.ALL,
      };
      this.component.appfxDatagridComponent.onExportEvent(mockStatus);

      expect(this.component.onExportDataEvent).toHaveBeenCalledWith(mockStatus);
    });

    it('should call exportUIOnlyData if clientSideExportConfig is present', function (this: any) {
      const hostElement = this.fixture.debugElement.query(By.directive(DatagridComponent));
      const exportProviderService = hostElement.injector.get(ExportProviderService);
      const exportSpy = spyOn(exportProviderService, 'exportUIOnlyData');
      const clientSideExportConfig: ClientSideExportConfig = {
        exportedFileName: 'test-export-filename',
        columnDefinitions: this.columnsDefs,
      };
      this.component.appfxDatagridComponent.footerModel = {
        clientSideExportConfig,
      };
      const mockStatus = {} as ExportStatus;
      this.component.appfxDatagridComponent.onExportEvent(mockStatus);
      expect(exportSpy).toHaveBeenCalledWith(clientSideExportConfig, mockStatus, {
        totalDatagridItems: this.component.appfxDatagridComponent.gridItems,
        selectedItems: this.component.appfxDatagridComponent.selectedItems,
        filteredDatagridItems: [],
      });
    });

    it('should do nothing when enableCustomExport and clientSideExportConfig are not set', function (this: any) {
      const hostElement = this.fixture.debugElement.query(By.directive(DatagridComponent));
      const exportProviderService = hostElement.injector.get(ExportProviderService);
      const exportSpy = spyOn(exportProviderService, 'exportUIOnlyData');
      this.component.appfxDatagridComponent.footerModel = {
        enableCustomExport: undefined,
        clientSideExportConfig: undefined,
      };
      spyOn(this.component, 'onExportDataEvent');
      this.component.appfxDatagridComponent.onExportEvent({} as ExportStatus);
      expect(this.component.onExportDataEvent).not.toHaveBeenCalled();
      expect(exportSpy).not.toHaveBeenCalled();
    });
  });

  describe('Right click', () => {
    beforeEach(function (this: any) {
      this.mockEvent = {
        preventDefault: function () {},
      };
      this.component.columnsDefs = this.columnsDefs;
      this.component.data = this.data;
    });

    it('by default select the grid row', function (this: any) {
      this.fixture.detectChanges(false);
      spyOn(this.component, 'onOpenContextMenu');
      const gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getRows()[0].isSelected()).toBeFalsy();
      this.fixture.debugElement
        .query(By.css('clr-datagrid clr-dg-row'))
        .triggerEventHandler('contextmenu', this.mockEvent);
      this.fixture.detectChanges();
      expect(gridHelper.getRows()[0].isSelected()).toBeTruthy();
      expect(this.component.onOpenContextMenu).toHaveBeenCalledWith({
        event: this.mockEvent,
        context: [this.data[0]],
      });
    });

    it('opens context menu for last clicked row', function (this: any) {
      this.fixture.detectChanges(false);
      spyOn(this.component, 'onOpenContextMenu');
      const gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getRows()[0].isSelected()).toBeFalsy();
      const rows = this.fixture.debugElement.queryAll(By.css('clr-datagrid clr-dg-row'));
      expect(rows.length).toEqual(gridHelper.getRows().length);
      rows[0].triggerEventHandler('contextmenu', this.mockEvent);
      this.fixture.detectChanges();
      expect(gridHelper.getRows()[0].isSelected()).toBeTruthy();
      expect(this.component.onOpenContextMenu).toHaveBeenCalledWith({
        event: this.mockEvent,
        context: [this.data[0]],
      });
      rows[1].triggerEventHandler('contextmenu', this.mockEvent);
      this.fixture.detectChanges();
      expect(gridHelper.getRows()[0].isSelected()).toBeFalsy();
      expect(gridHelper.getRows()[1].isSelected()).toBeTruthy();
      expect(this.component.onOpenContextMenu).toHaveBeenCalledWith({
        event: this.mockEvent,
        context: [this.data[1]],
      });
      expect(this.component.onOpenContextMenu).toHaveBeenCalledTimes(2);
    });

    afterEach(function (this: any) {
      this.mockEvent = null;
    });
  });

  describe('Action bar filter', () => {
    beforeEach(function (this: any) {
      this.mockEvent = {
        preventDefault: function () {},
      };
      this.component.columnsDefs = this.columnsDefs;
      this.component.data = this.data;
    });

    it('emits change event with the search term', function (this: any) {
      this.component.appfxDatagridComponent.filterMode = FilterMode.Quick;
      this.fixture.detectChanges(false);
      spyOn(this.component, 'onSearchTermChange');
      this.component.appfxDatagridComponent.onAdvancedSearchTermChange('test');
      this.fixture.detectChanges();
      expect(this.component.onSearchTermChange).toHaveBeenCalledWith('test');
    });

    it('emits change event with advanced filters', function (this: any) {
      this.component.appfxDatagridComponent.filterMode = FilterMode.Advanced;
      this.fixture.detectChanges(false);
      spyOn(this.component, 'onAdvancedFilterChange');
      const propertyFilters: PropertyFilter[] = [new PropertyFilter()];
      this.component.appfxDatagridComponent.onAdvancedFilterCriteriaChange(propertyFilters);
      this.fixture.detectChanges();
      expect(this.component.onAdvancedFilterChange).toHaveBeenCalledWith(propertyFilters);
    });

    afterEach(function (this: any) {
      this.mockEvent = null;
    });
  });

  describe('Detail pane', () => {
    beforeEach(function (this: any) {
      this.component.columnsDefs = this.columnsDefs;
      this.component.data = this.data;
      this.component.appfxDatagridComponent.detailHeader = this.component.detailHeader;
    });

    it('should be hidden when "detailState" is empty', function (this: any) {
      this.component.detailState = null;
      this.fixture.detectChanges(true);
      const detailPane: DebugElement = this.fixture.debugElement.query(By.css('clr-datagrid clr-dg-detail'));
      expect(detailPane).toBeFalsy();
    });

    it('should be visible when "detailState" not empty', function (this: any) {
      this.component.detailState = this.component.data[0];
      this.fixture.detectChanges(true);
      const detailPane: DebugElement = this.fixture.debugElement.query(By.css('clr-datagrid clr-dg-detail'));
      expect(detailPane).toBeTruthy();
    });

    it('after hiding, "detailState" should be null in the hosting component', function (this: any) {
      this.component.detailState = this.component.data[0];
      this.fixture.detectChanges(true);
      const detailPaneCloseBtn: DebugElement = this.fixture.debugElement.query(
        By.css('clr-datagrid clr-dg-detail clr-dg-detail-header button')
      );
      detailPaneCloseBtn.nativeElement.click();
      this.fixture.whenStable().then(() => {
        expect(this.component.detailState).toBeNull();
      });
    });
  });

  describe('Expandable rows', () => {
    beforeEach(function (this: any) {
      this.component.columnsDefs = this.columnsDefs;
      this.component.data = this.data;
    });

    it('should be expanded by default when requested', function (this: any) {
      this.component.rowsExpandedByDefault = true;
      this.component.appfxDatagridComponent.rowDetailContent = this.component.rowDetailContent;
      this.fixture.detectChanges(true);

      const gridHelper: GridHelper = new GridHelper(this.fixture.debugElement);
      const rows: GridRowTestHelper[] = gridHelper.getRows();
      expect(rows.length).toEqual(this.data.length);

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

    it('should NOT be expanded by default when NOT requested', function (this: any) {
      this.component.rowsExpandedByDefault = false;
      this.component.appfxDatagridComponent.rowDetailContent = this.component.rowDetailContent;
      this.fixture.detectChanges(true);

      const gridHelper: GridHelper = new GridHelper(this.fixture.debugElement);
      const rows: GridRowTestHelper[] = gridHelper.getRows();
      expect(rows.length).toEqual(this.data.length);

      let rowDetailComponent: HTMLElement;
      rows.forEach((row: GridRowTestHelper) => {
        expect(row.isRowExpandable()).toBeTruthy();

        rowDetailComponent = row.getElement().querySelector('clr-dg-row-detail > span') as HTMLElement;
        expect(rowDetailComponent).toBeNull();
      });
    });

    it('should have aria description', function (this: DatagridSpecContext) {
      this.component.rowsExpandedByDefault = true;
      this.component.appfxDatagridComponent.rowDetailContent = this.component.rowDetailContent;
      this.fixture.detectChanges();

      const gridHelper = new GridHelper(this.fixture.debugElement);
      const rows: GridRowTestHelper[] = gridHelper.getRows();
      expect(rows.length).toEqual(this.data.length);

      rows.forEach((row, i) => {
        expect(row.isRowExpandable()).toBeTruthy();

        const rowDetailComponent = row.getElement().querySelector('clr-dg-row-detail') as HTMLElement;

        const contentId = this.component.appfxDatagridComponent.buildRowDetailContentId(i);

        expect(rowDetailComponent).toBeDefined();
        expect(rowDetailComponent.getAttribute('aria-describedby')).toEqual(contentId);
        expect(rowDetailComponent.querySelectorAll(`#${contentId}`).length).toBe(1);
      });
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
      [serverDrivenDatagrid]="serverDrivenDatagrid"
      [dataRange]="dataRange"
      [(detailState)]="detailState"
      (actionClick)="onActionClick($event)"
      (rowActionMenuOpenChange)="onRowActionOverflowOpen($event)"
      (columnSortOrderChange)="columnSortOrderChange($event)"
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
  isRowSelectionMode = true; // default
  datagridLabels = { noItemsFound: 'No items found' };
  noItemsFoundPlaceholder?: string = 'No items found';
  detailState: any = null;
  rowsExpandedByDefault?: boolean = false;
  virtualScrolling = false;
  serverDrivenDatagrid = false;
  dataRange: ClrDatagridVirtualScrollRangeInterface<any> = {
    total: 100,
    skip: 0,
    data: <any>[],
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changeSelection(event: any) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  columnSortOrderChange(event: any) {}

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
  template: `
    <div ng-non-bindable class="object">
      <span [attr.title]="label">
        <cds-icon [attr.shape]="icon" class="is-solid"></cds-icon>
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
  imports: [ClrCheckboxModule, ClrIconModule, CommonModule, FormsModule],
  exports: [PowerStateFilterComponent, RowDetailRendererComponent, StatusRendererComponent],
})
class TestModule {}

enum PowerState {
  off = 'Powered Off',
  on = 'Powered On',
}
