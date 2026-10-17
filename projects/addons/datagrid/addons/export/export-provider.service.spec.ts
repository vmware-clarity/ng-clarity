/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClrDatagrid, ClrDatagridModule, ClrDatagridSortOrder } from '@clr/angular/data/datagrid';

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
  let testContext: any;
  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
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

    testContext.fixture = TestBed.createComponent(ClrDatagridHostComponent);
    testContext.clrDatagridHostComponent = testContext.fixture.componentInstance;
    testContext.clrDatagrid = testContext.clrDatagridHostComponent.clrDatagrid;

    testContext.datagridItemSet = {
      totalDatagridItems: testContext.clrDatagridHostComponent.serialKeyLicenseItems,
      selectedItems: testContext.clrDatagridHostComponent.serialKeyLicenseItems[1],
      filteredDatagridItems: [
        testContext.clrDatagridHostComponent.serialKeyLicenseItems[1],
        testContext.clrDatagridHostComponent.serialKeyLicenseItems[3],
      ],
    };

    testContext.columnDef = [];
    testContext.exportProperties = {
      exportedFileName: 'LicenseAssets',
      columnDefinitions: testContext.columnDef,
    };
  });

  afterEach(() => {
    testContext.fixture.destroy();
    testContext.fixture = null;
    testContext.clrDatagrid = null;
  });

  it('exportUIOnlyData with all items export option creates CSV data of all datagrid items and downloads file', () => {
    const exportProviderService = TestBed.inject(ExportProviderService);
    const csvHelperService = TestBed.inject(CsvHelperService);
    const exportStatus: ExportStatus = {
      inProgress: false,
      exportType: ExportType.ALL,
    };

    vi.spyOn(csvHelperService, 'getData').mockImplementation(() => undefined);
    vi.spyOn(exportProviderService, 'downloadFile').mockImplementation(() => undefined);
    exportProviderService.exportUIOnlyData(testContext.exportProperties, exportStatus, testContext.datagridItemSet);

    expect(csvHelperService.getData).toHaveBeenCalledWith(
      testContext.datagridItemSet.totalDatagridItems,
      testContext.columnDef
    );

    const csvData = csvHelperService.getData(testContext.datagridItemSet.totalDatagridItems, testContext.columnDef);
    expect(exportProviderService.downloadFile).toHaveBeenCalledWith(
      csvData,
      testContext.exportProperties.exportedFileName
    );
  });

  it('exportUIOnlyData with selected items export option creates CSV data of selected datagrid items and downloads file', () => {
    const exportProviderService = TestBed.inject(ExportProviderService);
    const csvHelperService = TestBed.inject(CsvHelperService);
    const exportStatus: ExportStatus = {
      inProgress: false,
      exportType: ExportType.SELECTED_ONLY,
    };

    vi.spyOn(csvHelperService, 'getData').mockImplementation(() => undefined);
    vi.spyOn(exportProviderService, 'downloadFile').mockImplementation(() => undefined);
    exportProviderService.exportUIOnlyData(testContext.exportProperties, exportStatus, testContext.datagridItemSet);

    expect(csvHelperService.getData).toHaveBeenCalledWith(
      testContext.datagridItemSet.selectedItems,
      testContext.columnDef
    );

    const csvData = csvHelperService.getData(testContext.datagridItemSet.selectedItems, testContext.columnDef);
    expect(exportProviderService.downloadFile).toHaveBeenCalledWith(
      csvData,
      testContext.exportProperties.exportedFileName
    );
  });

  it(
    'exportUIOnlyData with filtered items export option creates CSV data of filtered datagrid' +
      'items and downloads file',
    () => {
      const exportProviderService = TestBed.inject(ExportProviderService);
      const csvHelperService = TestBed.inject(CsvHelperService);
      const exportStatus: ExportStatus = {
        inProgress: false,
        exportType: ExportType.MATCHING_FILTERS,
      };
      vi.spyOn(csvHelperService, 'getData').mockImplementation(() => undefined);
      vi.spyOn(exportProviderService, 'downloadFile').mockImplementation(() => undefined);
      exportProviderService.exportUIOnlyData(testContext.exportProperties, exportStatus, testContext.datagridItemSet);

      expect(csvHelperService.getData).toHaveBeenCalledWith(
        testContext.datagridItemSet.filteredDatagridItems,
        testContext.columnDef
      );

      const csvData = csvHelperService.getData(
        testContext.datagridItemSet.filteredDatagridItems,
        testContext.columnDef
      );
      expect(exportProviderService.downloadFile).toHaveBeenCalledWith(
        csvData,
        testContext.exportProperties.exportedFileName
      );
    }
  );

  it('should handle error in exportUIOnlyData and show error message', () => {
    const exportProviderService = TestBed.inject(ExportProviderService);
    const csvHelperService = TestBed.inject(CsvHelperService);
    const exportStatus: ExportStatus = {
      inProgress: false,
      exportType: ExportType.ALL,
    };

    vi.spyOn(csvHelperService, 'getData').mockImplementation(() => {
      throw new Error('Test error');
    });
    vi.spyOn(exportProviderService as any, 'showExportError').mockImplementation(() => undefined);

    exportProviderService.exportUIOnlyData(testContext.exportProperties, exportStatus, testContext.datagridItemSet);

    expect(exportStatus.inProgress).toBe(false);
    expect(exportProviderService['showExportError']).toHaveBeenCalled();
  });

  it('should sort items when sort configuration is provided', () => {
    const exportProviderService = TestBed.inject(ExportProviderService);
    const csvHelperService = TestBed.inject(CsvHelperService);
    const exportStatus: ExportStatus = {
      inProgress: false,
      exportType: ExportType.ALL,
    };

    testContext.exportProperties.sort = true;
    testContext.exportProperties.sortOrder = {
      column: { field: 'name' },
      sortOrder: ClrDatagridSortOrder.DESC,
    };

    vi.spyOn(csvHelperService, 'getData').mockImplementation(() => undefined);
    vi.spyOn(exportProviderService, 'downloadFile').mockImplementation(() => undefined);

    exportProviderService.exportUIOnlyData(testContext.exportProperties, exportStatus, testContext.datagridItemSet);

    // Verify items were sorted before being passed to getData
    const sortedItems = [...testContext.datagridItemSet.totalDatagridItems].sort((a, b) =>
      b.name.localeCompare(a.name)
    );
    expect(csvHelperService.getData).toHaveBeenCalledWith(sortedItems, testContext.columnDef);
  });

  it('should handle missing errorNotifiableService', () => {
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
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    exportProviderService['showExportError']();

    expect(console.error).toHaveBeenCalled();
  });

  it('should handle null values in sorting', () => {
    const exportProviderService = TestBed.inject(ExportProviderService);
    const csvHelperService = TestBed.inject(CsvHelperService);
    const exportStatus: ExportStatus = {
      inProgress: false,
      exportType: ExportType.ALL,
    };

    testContext.datagridItemSet.totalDatagridItems = [{ name: null }, { name: 'B' }, { name: null }, { name: 'A' }];

    testContext.exportProperties.sort = true;
    testContext.exportProperties.sortOrder = {
      column: { field: 'name' },
      sortOrder: ClrDatagridSortOrder.ASC,
    };

    vi.spyOn(csvHelperService, 'getData').mockImplementation(() => undefined);
    vi.spyOn(exportProviderService, 'downloadFile').mockImplementation(() => undefined);

    exportProviderService.exportUIOnlyData(testContext.exportProperties, exportStatus, testContext.datagridItemSet);

    // Verify items were sorted with nulls at the end
    const expectedOrder = [{ name: 'A' }, { name: 'B' }, { name: null }, { name: null }];
    expect(csvHelperService.getData).toHaveBeenCalledWith(expectedOrder, testContext.columnDef);
  });

  it('should handle missing properties in sorting', () => {
    const exportProviderService = TestBed.inject(ExportProviderService);
    const csvHelperService = TestBed.inject(CsvHelperService);
    const exportStatus: ExportStatus = {
      inProgress: false,
      exportType: ExportType.ALL,
    };

    testContext.datagridItemSet.totalDatagridItems = [
      { other: 'value' },
      { name: 'B' },
      { other: 'value2' },
      { name: 'A' },
    ];

    testContext.exportProperties.sort = true;
    testContext.exportProperties.sortOrder = {
      column: { field: 'name' },
      sortOrder: ClrDatagridSortOrder.ASC,
    };

    vi.spyOn(csvHelperService, 'getData').mockImplementation(() => undefined);
    vi.spyOn(exportProviderService, 'downloadFile').mockImplementation(() => undefined);

    exportProviderService.exportUIOnlyData(testContext.exportProperties, exportStatus, testContext.datagridItemSet);

    // Items without the sorted property should be preserved in their original order
    expect(csvHelperService.getData).toHaveBeenCalledWith(
      testContext.datagridItemSet.totalDatagridItems,
      testContext.columnDef
    );
  });
});
