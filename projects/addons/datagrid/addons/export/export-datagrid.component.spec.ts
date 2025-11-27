/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { DatagridStrings } from '../../i18n/datagrid-strings.service';
import { ExportDatagridComponent } from './export-datagrid.component';
import { ExportType } from './export-type';

describe('ExportDatagridComponent', () => {
  beforeEach(function (this: any) {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [{ provide: DatagridStrings, useClass: DatagridStrings }],
    });
    this.fixture = TestBed.createComponent(ExportDatagridComponent);
    this.fixture.componentInstance.exportType = ExportType;
    this.fixture.componentInstance.exportEventEmitter = new EventEmitter<string>();
    this.fixture.componentInstance.exportStatus = { inProgress: false };
    this.exportDatagridHostComponent = this.fixture.componentInstance;
  });

  it('emits export event for all items on click with an export type ALL', function (this: any) {
    spyOn(this.exportDatagridHostComponent.exportEventEmitter, 'emit');
    this.exportDatagridHostComponent.onExportClick(this.exportDatagridHostComponent.exportType.ALL);
    this.fixture.componentInstance.exportStatus.exportType = this.exportDatagridHostComponent.exportType.ALL;
    expect(this.exportDatagridHostComponent.exportEventEmitter.emit).toHaveBeenCalledWith(
      this.fixture.componentInstance.exportStatus
    );
  });

  it('emits export event for filtered items on click with an export type MATCHING_FILTERS', function (this: any) {
    spyOn(this.exportDatagridHostComponent.exportEventEmitter, 'emit');
    this.exportDatagridHostComponent.onExportClick(this.exportDatagridHostComponent.exportType.MATCHING_FILTERS);
    this.fixture.componentInstance.exportStatus.exportType =
      this.exportDatagridHostComponent.exportType.MATCHING_FILTERS;
    expect(this.exportDatagridHostComponent.exportEventEmitter.emit).toHaveBeenCalledWith(
      this.fixture.componentInstance.exportStatus
    );
  });

  it('emits export event for selected items on click with an export type SELECTED_ONLY', function (this: any) {
    spyOn(this.exportDatagridHostComponent.exportEventEmitter, 'emit');
    this.exportDatagridHostComponent.onExportClick(this.exportDatagridHostComponent.exportType.SELECTED_ONLY);
    this.fixture.componentInstance.exportStatus.exportType = this.exportDatagridHostComponent.exportType.SELECTED_ONLY;
    expect(this.exportDatagridHostComponent.exportEventEmitter.emit).toHaveBeenCalledWith(
      this.fixture.componentInstance.exportStatus
    );
  });

  it('emits export event for all items if no selected or filtered items', function (this: any) {
    spyOn(this.exportDatagridHostComponent.exportEventEmitter, 'emit');
    this.exportDatagridHostComponent.allItemsCount = 10;
    this.exportDatagridHostComponent.filteredItemsCount = 0;
    this.exportDatagridHostComponent.selectedItemsCount = 0;

    this.exportDatagridHostComponent.exportAllIfOnlyOption();

    expect(this.exportDatagridHostComponent.exportEventEmitter.emit).toHaveBeenCalledWith({
      inProgress: false,
      exportType: this.exportDatagridHostComponent.exportType.ALL,
    });
  });

  it('does not emit export event if there are selected or filtered items', function (this: any) {
    spyOn(this.exportDatagridHostComponent.exportEventEmitter, 'emit');
    this.exportDatagridHostComponent.allItemsCount = 10;
    this.exportDatagridHostComponent.filteredItemsCount = 5;
    this.exportDatagridHostComponent.selectedItemsCount = 3;

    this.exportDatagridHostComponent.exportAllIfOnlyOption();

    expect(this.exportDatagridHostComponent.exportEventEmitter.emit).not.toHaveBeenCalled();
  });

  it('emits export event for selected items when exportType SELECTED_ONLY', function (this: any) {
    spyOn(this.exportDatagridHostComponent.exportEventEmitter, 'emit');
    this.exportDatagridHostComponent.selectedItemsCount = 5;

    this.exportDatagridHostComponent.onExportClick(this.exportDatagridHostComponent.exportType.SELECTED_ONLY);

    expect(this.exportDatagridHostComponent.exportEventEmitter.emit).toHaveBeenCalledWith({
      inProgress: false,
      exportType: this.exportDatagridHostComponent.exportType.SELECTED_ONLY,
    });
  });

  it('emits export event for filtered items when exportType MATCHING_FILTERS', function (this: any) {
    spyOn(this.exportDatagridHostComponent.exportEventEmitter, 'emit');
    this.exportDatagridHostComponent.filteredItemsCount = 8;

    this.exportDatagridHostComponent.onExportClick(this.exportDatagridHostComponent.exportType.MATCHING_FILTERS);

    expect(this.exportDatagridHostComponent.exportEventEmitter.emit).toHaveBeenCalledWith({
      inProgress: false,
      exportType: this.exportDatagridHostComponent.exportType.MATCHING_FILTERS,
    });
  });

  it('sets export inProgress status to true and emits correct status', function (this: any) {
    spyOn(this.exportDatagridHostComponent.exportEventEmitter, 'emit');
    this.exportDatagridHostComponent.exportStatus.inProgress = true;

    this.exportDatagridHostComponent.onExportClick(this.exportDatagridHostComponent.exportType.ALL);

    expect(this.exportDatagridHostComponent.exportStatus.inProgress).toBeTrue();
    expect(this.exportDatagridHostComponent.exportEventEmitter.emit).toHaveBeenCalledWith(
      this.exportDatagridHostComponent.exportStatus
    );
  });

  it('shows the correct row counts in dropdown options', function (this: any) {
    this.exportDatagridHostComponent.allItemsCount = 10;
    this.exportDatagridHostComponent.filteredItemsCount = 5;
    this.exportDatagridHostComponent.selectedItemsCount = 3;

    this.exportDatagridHostComponent.exportAllIfOnlyOption();

    expect(this.exportDatagridHostComponent.allRowsCount).toBe('(10)');
    expect(this.exportDatagridHostComponent.matchedFilterRowsCount).toBe('(5)');
    expect(this.exportDatagridHostComponent.selectedRowsCount).toBe('(3)');
  });

  afterEach(function (this: any) {
    this.fixture.destroy();
  });
});
