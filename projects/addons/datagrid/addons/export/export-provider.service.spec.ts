/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClrDatagrid, ClrDatagridModule, ClrDatagridSortOrder } from '@clr/angular';

import { CsvHelperService } from './csv-helper.service';
import { ExportProviderService } from './export-provider.service';
import { ExportType } from './export-type';
import { ClientSideExportConfig, ExportStatus } from './export.interface';
import { DatagridStrings } from '../../i18n/datagrid-strings.service';
import { appfxDatagridErrorNotifiableToken } from '../../interfaces/tokens';

@Component({
  selector: 'clr-datagrid-with-export-directive',
  imports: [ClrDatagridModule, FormsModule],
  template: ` <clr-datagrid></clr-datagrid> `,
  providers: [ExportProviderService],
  standalone: true,
})
class ClrDatagridHostComponent {
  @ViewChild(ClrDatagrid, { static: true }) clrDatagrid: ClrDatagrid;

  serialKeyLicenseItems: any[] = [
    {
      name: 'License 1',
      serialKey: 'aaaa-bbbb-cccc-dddd',
      product: 'VMware License 1',
      usage: '0 CPUs',
    },
    {
      name: 'License 2',
      serialKey: 'mmmm-nnnn-oooo-pppp',
      product: 'VMware License 2',
      usage: '10 CPUs',
    },
    {
      name: 'License 3',
      serialKey: 'qqqq-rrrr-ssss-tttt',
      product: 'VMware License 3',
      usage: '20 CPUs',
    },
    {
      name: 'License 4',
      serialKey: 'wwww-xxxx-yyyy-zzzz',
      product: 'VMware License 4',
      usage: '30 CPUs',
    },
  ];

  columnDef: any[] = [
    {
      field: 'name',
      displayName: 'Name',
    },
    {
      field: 'usage',
      displayName: 'Usage',
    },
    {
      field: 'formattedProductName',
      displayName: 'ProductName',
    },
    {
      field: 'license.name',
      displayName: 'License Name',
    },
    {
      field: 'expirationDate',
      displayName: 'Expiration Date',
    },
    {
      field: 'licenseState',
      displayName: 'State',
    },
  ];

  exportProperties: ClientSideExportConfig = {
    exportedFileName: 'LicenseAssets',
    columnDefinitions: this.columnDef,
  };
}

class MockDatagrid {}
class MockElementRef {}

describe('ExportProviderService', () => {
  beforeEach(function (this: any) {
    TestBed.configureTestingModule({
      imports: [ClrDatagridHostComponent],
      providers: [
        CsvHelperService,
        ExportProviderService,
        Renderer2,
        ViewContainerRef,
        { provide: ClrDatagrid, useClass: MockDatagrid },
        { provide: ElementRef, useClass: MockElementRef },
        { provide: DatagridStrings, useClass: DatagridStrings },
        {
          provide: appfxDatagridErrorNotifiableToken,
          useValue: {
            notifyError: () => {},
          },
        },
      ],
    });

    this.fixture = TestBed.createComponent(ClrDatagridHostComponent);
    this.clrDatagridHostComponent = this.fixture.componentInstance;
    this.clrDatagrid = this.clrDatagridHostComponent.clrDatagrid;

    this.datagridItemSet = {
      totalDatagridItems: this.clrDatagridHostComponent.serialKeyLicenseItems,
      selectedItems: this.clrDatagridHostComponent.serialKeyLicenseItems[1],
      filteredDatagridItems: [
        this.clrDatagridHostComponent.serialKeyLicenseItems[1],
        this.clrDatagridHostComponent.serialKeyLicenseItems[3],
      ],
    };

    this.columnDef = [];
    this.exportProperties = {
      exportedFileName: 'LicenseAssets',
      columnDefinitions: this.columnDef,
    };
  });

  afterEach(function (this: any) {
    this.fixture.destroy();
    this.fixture = null;
    this.clrDatagrid = null;
  });

  it('exportUIOnlyData with all items export option creates CSV data of all datagrid items and downloads file', function (this: any) {
    const exportProviderService = TestBed.inject(ExportProviderService);
    const csvHelperService = TestBed.inject(CsvHelperService);
    const exportStatus: ExportStatus = {
      inProgress: false,
      exportType: ExportType.ALL,
    };

    spyOn(csvHelperService, 'getData');
    spyOn(exportProviderService, 'downloadFile');
    exportProviderService.exportUIOnlyData(this.exportProperties, exportStatus, this.datagridItemSet);

    expect(csvHelperService.getData).toHaveBeenCalledWith(this.datagridItemSet.totalDatagridItems, this.columnDef);

    const csvData = csvHelperService.getData(this.datagridItemSet.totalDatagridItems, this.columnDef);
    expect(exportProviderService.downloadFile).toHaveBeenCalledWith(csvData, this.exportProperties.exportedFileName);
  });

  it('exportUIOnlyData with selected items export option creates CSV data of selected datagrid items and downloads file', function (this: any) {
    const exportProviderService = TestBed.inject(ExportProviderService);
    const csvHelperService = TestBed.inject(CsvHelperService);
    const exportStatus: ExportStatus = {
      inProgress: false,
      exportType: ExportType.SELECTED_ONLY,
    };

    spyOn(csvHelperService, 'getData');
    spyOn(exportProviderService, 'downloadFile');
    exportProviderService.exportUIOnlyData(this.exportProperties, exportStatus, this.datagridItemSet);

    expect(csvHelperService.getData).toHaveBeenCalledWith(this.datagridItemSet.selectedItems, this.columnDef);

    const csvData = csvHelperService.getData(this.datagridItemSet.selectedItems, this.columnDef);
    expect(exportProviderService.downloadFile).toHaveBeenCalledWith(csvData, this.exportProperties.exportedFileName);
  });

  it(
    'exportUIOnlyData with filtered items export option creates CSV data of filtered datagrid' +
      'items and downloads file',
    function (this: any) {
      const exportProviderService = TestBed.inject(ExportProviderService);
      const csvHelperService = TestBed.inject(CsvHelperService);
      const exportStatus: ExportStatus = {
        inProgress: false,
        exportType: ExportType.MATCHING_FILTERS,
      };
      spyOn(csvHelperService, 'getData');
      spyOn(exportProviderService, 'downloadFile');
      exportProviderService.exportUIOnlyData(this.exportProperties, exportStatus, this.datagridItemSet);

      expect(csvHelperService.getData).toHaveBeenCalledWith(this.datagridItemSet.filteredDatagridItems, this.columnDef);

      const csvData = csvHelperService.getData(this.datagridItemSet.filteredDatagridItems, this.columnDef);
      expect(exportProviderService.downloadFile).toHaveBeenCalledWith(csvData, this.exportProperties.exportedFileName);
    }
  );

  it('should handle error in exportUIOnlyData and show error message', function (this: any) {
    const exportProviderService = TestBed.inject(ExportProviderService);
    const csvHelperService = TestBed.inject(CsvHelperService);
    const exportStatus: ExportStatus = {
      inProgress: false,
      exportType: ExportType.ALL,
    };

    spyOn(csvHelperService, 'getData').and.throwError('Test error');
    spyOn(exportProviderService as any, 'showExportError');

    exportProviderService.exportUIOnlyData(this.exportProperties, exportStatus, this.datagridItemSet);

    expect(exportStatus.inProgress).toBeFalse();
    expect(exportProviderService['showExportError']).toHaveBeenCalled();
  });

  it('should sort items when sort configuration is provided', function (this: any) {
    const exportProviderService = TestBed.inject(ExportProviderService);
    const csvHelperService = TestBed.inject(CsvHelperService);
    const exportStatus: ExportStatus = {
      inProgress: false,
      exportType: ExportType.ALL,
    };

    this.exportProperties.sort = true;
    this.exportProperties.sortOrder = {
      column: { field: 'name' },
      sortOrder: ClrDatagridSortOrder.DESC,
    };

    spyOn(csvHelperService, 'getData');
    spyOn(exportProviderService, 'downloadFile');

    exportProviderService.exportUIOnlyData(this.exportProperties, exportStatus, this.datagridItemSet);

    // Verify items were sorted before being passed to getData
    const sortedItems = [...this.datagridItemSet.totalDatagridItems].sort((a, b) => b.name.localeCompare(a.name));
    expect(csvHelperService.getData).toHaveBeenCalledWith(sortedItems, this.columnDef);
  });

  it('should handle missing errorNotifiableService', function (this: any) {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ClrDatagridHostComponent],
      providers: [
        CsvHelperService,
        ExportProviderService,
        Renderer2,
        ViewContainerRef,
        { provide: ClrDatagrid, useClass: MockDatagrid },
        { provide: ElementRef, useClass: MockElementRef },
        { provide: DatagridStrings, useClass: DatagridStrings },
      ],
    });

    const exportProviderService = TestBed.inject(ExportProviderService);
    spyOn(console, 'error');

    exportProviderService['showExportError']();

    expect(console.error).toHaveBeenCalled();
  });

  it('should handle null values in sorting', function (this: any) {
    const exportProviderService = TestBed.inject(ExportProviderService);
    const csvHelperService = TestBed.inject(CsvHelperService);
    const exportStatus: ExportStatus = {
      inProgress: false,
      exportType: ExportType.ALL,
    };

    this.datagridItemSet.totalDatagridItems = [{ name: null }, { name: 'B' }, { name: null }, { name: 'A' }];

    this.exportProperties.sort = true;
    this.exportProperties.sortOrder = {
      column: { field: 'name' },
      sortOrder: ClrDatagridSortOrder.ASC,
    };

    spyOn(csvHelperService, 'getData');
    spyOn(exportProviderService, 'downloadFile');

    exportProviderService.exportUIOnlyData(this.exportProperties, exportStatus, this.datagridItemSet);

    // Verify items were sorted with nulls at the end
    const expectedOrder = [{ name: 'A' }, { name: 'B' }, { name: null }, { name: null }];
    expect(csvHelperService.getData).toHaveBeenCalledWith(expectedOrder, this.columnDef);
  });

  it('should handle missing properties in sorting', function (this: any) {
    const exportProviderService = TestBed.inject(ExportProviderService);
    const csvHelperService = TestBed.inject(CsvHelperService);
    const exportStatus: ExportStatus = {
      inProgress: false,
      exportType: ExportType.ALL,
    };

    this.datagridItemSet.totalDatagridItems = [{ other: 'value' }, { name: 'B' }, { other: 'value2' }, { name: 'A' }];

    this.exportProperties.sort = true;
    this.exportProperties.sortOrder = {
      column: { field: 'name' },
      sortOrder: ClrDatagridSortOrder.ASC,
    };

    spyOn(csvHelperService, 'getData');
    spyOn(exportProviderService, 'downloadFile');

    exportProviderService.exportUIOnlyData(this.exportProperties, exportStatus, this.datagridItemSet);

    // Items without the sorted property should be preserved in their original order
    expect(csvHelperService.getData).toHaveBeenCalledWith(this.datagridItemSet.totalDatagridItems, this.columnDef);
  });
});
