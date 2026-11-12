/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ExportDatagridComponent } from './export-datagrid.component';
import { ExportType } from './export-type';
import { DatagridStrings } from '../../i18n/datagrid-strings.service';

describe('ExportDatagridComponent', () => {
  let testContext: any;
  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [{ provide: DatagridStrings, useClass: DatagridStrings }],
    });
    testContext.fixture = TestBed.createComponent(ExportDatagridComponent);
    testContext.fixture.componentInstance.exportType = ExportType;
    testContext.fixture.componentInstance.exportEventEmitter = new EventEmitter<string>();
    testContext.fixture.componentInstance.exportStatus = { inProgress: false };
    testContext.exportDatagridHostComponent = testContext.fixture.componentInstance;
  });

  it('emits export event for all items on click with an export type ALL', () => {
    vi.spyOn(testContext.exportDatagridHostComponent.exportEventEmitter, 'emit').mockImplementation(() => undefined);
    testContext.exportDatagridHostComponent.onExportClick(testContext.exportDatagridHostComponent.exportType.ALL);
    testContext.fixture.componentInstance.exportStatus.exportType =
      testContext.exportDatagridHostComponent.exportType.ALL;
    expect(testContext.exportDatagridHostComponent.exportEventEmitter.emit).toHaveBeenCalledWith(
      testContext.fixture.componentInstance.exportStatus
    );
  });

  it('emits export event for filtered items on click with an export type MATCHING_FILTERS', () => {
    vi.spyOn(testContext.exportDatagridHostComponent.exportEventEmitter, 'emit').mockImplementation(() => undefined);
    testContext.exportDatagridHostComponent.onExportClick(
      testContext.exportDatagridHostComponent.exportType.MATCHING_FILTERS
    );
    testContext.fixture.componentInstance.exportStatus.exportType =
      testContext.exportDatagridHostComponent.exportType.MATCHING_FILTERS;
    expect(testContext.exportDatagridHostComponent.exportEventEmitter.emit).toHaveBeenCalledWith(
      testContext.fixture.componentInstance.exportStatus
    );
  });

  it('emits export event for selected items on click with an export type SELECTED_ONLY', () => {
    vi.spyOn(testContext.exportDatagridHostComponent.exportEventEmitter, 'emit').mockImplementation(() => undefined);
    testContext.exportDatagridHostComponent.onExportClick(
      testContext.exportDatagridHostComponent.exportType.SELECTED_ONLY
    );
    testContext.fixture.componentInstance.exportStatus.exportType =
      testContext.exportDatagridHostComponent.exportType.SELECTED_ONLY;
    expect(testContext.exportDatagridHostComponent.exportEventEmitter.emit).toHaveBeenCalledWith(
      testContext.fixture.componentInstance.exportStatus
    );
  });

  it('emits export event for all items if no selected or filtered items', () => {
    vi.spyOn(testContext.exportDatagridHostComponent.exportEventEmitter, 'emit').mockImplementation(() => undefined);
    testContext.exportDatagridHostComponent.allItemsCount = 10;
    testContext.exportDatagridHostComponent.filteredItemsCount = 0;
    testContext.exportDatagridHostComponent.selectedItemsCount = 0;

    testContext.exportDatagridHostComponent.exportAllIfOnlyOption();

    expect(testContext.exportDatagridHostComponent.exportEventEmitter.emit).toHaveBeenCalledWith({
      inProgress: false,
      exportType: testContext.exportDatagridHostComponent.exportType.ALL,
    });
  });

  it('does not emit export event if there are selected or filtered items', () => {
    vi.spyOn(testContext.exportDatagridHostComponent.exportEventEmitter, 'emit').mockImplementation(() => undefined);
    testContext.exportDatagridHostComponent.allItemsCount = 10;
    testContext.exportDatagridHostComponent.filteredItemsCount = 5;
    testContext.exportDatagridHostComponent.selectedItemsCount = 3;

    testContext.exportDatagridHostComponent.exportAllIfOnlyOption();

    expect(testContext.exportDatagridHostComponent.exportEventEmitter.emit).not.toHaveBeenCalled();
  });

  it('emits export event for selected items when exportType SELECTED_ONLY', () => {
    vi.spyOn(testContext.exportDatagridHostComponent.exportEventEmitter, 'emit').mockImplementation(() => undefined);
    testContext.exportDatagridHostComponent.selectedItemsCount = 5;

    testContext.exportDatagridHostComponent.onExportClick(
      testContext.exportDatagridHostComponent.exportType.SELECTED_ONLY
    );

    expect(testContext.exportDatagridHostComponent.exportEventEmitter.emit).toHaveBeenCalledWith({
      inProgress: false,
      exportType: testContext.exportDatagridHostComponent.exportType.SELECTED_ONLY,
    });
  });

  it('emits export event for filtered items when exportType MATCHING_FILTERS', () => {
    vi.spyOn(testContext.exportDatagridHostComponent.exportEventEmitter, 'emit').mockImplementation(() => undefined);
    testContext.exportDatagridHostComponent.filteredItemsCount = 8;

    testContext.exportDatagridHostComponent.onExportClick(
      testContext.exportDatagridHostComponent.exportType.MATCHING_FILTERS
    );

    expect(testContext.exportDatagridHostComponent.exportEventEmitter.emit).toHaveBeenCalledWith({
      inProgress: false,
      exportType: testContext.exportDatagridHostComponent.exportType.MATCHING_FILTERS,
    });
  });

  it('sets export inProgress status to true and emits correct status', () => {
    vi.spyOn(testContext.exportDatagridHostComponent.exportEventEmitter, 'emit').mockImplementation(() => undefined);
    testContext.exportDatagridHostComponent.exportStatus.inProgress = true;

    testContext.exportDatagridHostComponent.onExportClick(testContext.exportDatagridHostComponent.exportType.ALL);

    expect(testContext.exportDatagridHostComponent.exportStatus.inProgress).toBe(true);
    expect(testContext.exportDatagridHostComponent.exportEventEmitter.emit).toHaveBeenCalledWith(
      testContext.exportDatagridHostComponent.exportStatus
    );
  });

  it('shows the correct row counts in dropdown options', () => {
    testContext.exportDatagridHostComponent.allItemsCount = 10;
    testContext.exportDatagridHostComponent.filteredItemsCount = 5;
    testContext.exportDatagridHostComponent.selectedItemsCount = 3;

    testContext.exportDatagridHostComponent.exportAllIfOnlyOption();

    expect(testContext.exportDatagridHostComponent.allRowsCount).toBe('(10)');
    expect(testContext.exportDatagridHostComponent.matchedFilterRowsCount).toBe('(5)');
    expect(testContext.exportDatagridHostComponent.selectedRowsCount).toBe('(3)');
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });
});
